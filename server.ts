import os from "os";
import express from "express";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
import { MongoClient, ObjectId } from "mongodb";
import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const localIP = getLocalIP();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "syncdocs";

interface Document {
  _id?: ObjectId;
  id: string;
  title: string;
  content: string;
  owner: string;
  is_favorite?: number;
  updated_at: Date;
}

interface User {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface DocumentShare {
  _id?: ObjectId;
  document_id: string;
  user_id: string;
  permission: string;
  status: string;
  created_at: Date;
}

interface PendingRequest {
  _id?: ObjectId;
  document_id: string;
  user_id: string;
  user_name: string;
  status: string;
  created_at: Date;
}

let db: any;
let documents: any;
let users: any;
let documentShares: any;
let pendingRequests: any;
let useMongoDB = true;

let sqliteDb: Database.Database;

async function connectMongoDB() {
  try {
    const isAtlas = MONGODB_URI.includes("mongodb+srv://");
    console.log(`Attempting MongoDB connection to: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      retryWrites: true,
      retryReads: true,
    });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log("✓ Connected to MongoDB Atlas");
    
    useMongoDB = true;
    db = client.db(DB_NAME);
    documents = db.collection("documents");
    users = db.collection("users");
    documentShares = db.collection("document_shares");
    pendingRequests = db.collection("pending_requests");
    
    return client;
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    console.warn("⚠ MongoDB Atlas unavailable, using SQLite fallback");
    useMongoDB = false;
    
    sqliteDb = new Database("syncdocs.db");
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT DEFAULT '',
        owner TEXT NOT NULL,
        is_favorite INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar TEXT,
        role TEXT
      );
      CREATE TABLE IF NOT EXISTS document_shares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        permission TEXT DEFAULT 'view',
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(document_id, user_id)
      );
      CREATE TABLE IF NOT EXISTS pending_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ SQLite database initialized");
    
    return null;
  }
}

async function startServer() {
  await connectMongoDB();
  
  const app = express();
  const httpServer = createServer(app);

  const PORT = 8080;

  app.use(express.json());

  app.get("/api/documents", async (req, res) => {
    try {
      if (useMongoDB) {
        const docs = await documents.find().sort({ updated_at: -1 }).toArray();
        res.json(docs);
      } else {
        const docs = sqliteDb.prepare("SELECT * FROM documents ORDER BY updated_at DESC").all();
        res.json(docs);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      if (useMongoDB) {
        const doc = await documents.findOne({ id: req.params.id });
        if (!doc) return res.status(404).json({ error: "Document not found" });
        res.json(doc);
      } else {
        const doc = sqliteDb.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
        if (!doc) return res.status(404).json({ error: "Document not found" });
        res.json(doc);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    const { id, title, owner } = req.body;
    try {
      if (useMongoDB) {
        await documents.insertOne({
          id,
          title,
          content: "",
          owner,
          updated_at: new Date()
        });
      } else {
        sqliteDb.prepare("INSERT INTO documents (id, title, owner) VALUES (?, ?, ?)").run(id, title, owner);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.put("/api/documents/:id", async (req, res) => {
    const { title, content, is_favorite } = req.body;
    const { id } = req.params;
    
    try {
      if (useMongoDB) {
        const updateFields: any = { title, updated_at: new Date() };
        if (content !== undefined) updateFields.content = content;
        if (is_favorite !== undefined) updateFields.is_favorite = is_favorite ? 1 : 0;
        await documents.updateOne({ id }, { $set: updateFields });
      } else {
        const fields: string[] = ["title = ?", "updated_at = datetime('now')"];
        const values: any[] = [title];
        if (content !== undefined) {
          fields.push("content = ?");
          values.push(content);
        }
        if (is_favorite !== undefined) {
          fields.push("is_favorite = ?");
          values.push(is_favorite ? 1 : 0);
        }
        values.push(id);
        sqliteDb.prepare(`UPDATE documents SET ${fields.join(", ")} WHERE id = ?`).run(...values);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.post("/api/documents/:id/share", async (req, res) => {
    const { id } = req.params;
    const { email, permission } = req.body;
    
    try {
      if (useMongoDB) {
        const user = await users.findOne({ email });
        if (user) {
          await documentShares.updateOne(
            { document_id: id, user_id: user.id },
            { $set: { permission, status: "accepted", created_at: new Date() } },
            { upsert: true }
          );
        }
      } else {
        const user = sqliteDb.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (user) {
          sqliteDb.prepare(`
            INSERT OR REPLACE INTO document_shares (document_id, user_id, permission, status)
            VALUES (?, ?, ?, 'accepted')
          `).run(id, user.id, permission);
        }
      }
      
      res.json({ success: true, shareLink: `${process.env.APP_URL || 'http://localhost:8080'}/doc/${id}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to share document" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Access from other devices on your network: http://${localIP}:${PORT}`);
    console.log(`MongoDB: ${MONGODB_URI}`);
  });
}

startServer();
