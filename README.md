# SyncDocs - Collaborative Document Editor

A full-featured document editor similar to Google Docs and MS Word, built with React and Tiptap editor.

## Features

### Implemented Features

1. **Rich Text Formatting**
   - Bold, Italic, Underline, Strikethrough
   - Text color and highlight colors
   - Font family selection (Sans Serif, Serif, Monospace, Arial, Times New Roman, Courier New)
   - Font size selection (10px to 96px)

2. **Headings & Lists**
   - Heading levels (H1, H2, H3)
   - Bullet lists
   - Numbered lists
   - Task lists with checkboxes

3. **Text Alignment**
   - Left, Center, Right, Justify alignment

4. **Page Setup**
   - Paper size: Letter, Legal, A4, A5, Executive
   - Orientation: Portrait/Landscape
   - Margin presets: Normal, Narrow, Moderate, Wide, Mirror
   - Custom margin controls

5. **Document Layout**
   - Line spacing (1.0, 1.15, 1.5, 2.0, 2.5, 3.0)
   - Column layout (1, 2, or 3 columns)
   - Zoom controls (50% to 200%)

6. **Insert Elements**
   - Links
   - Images
   - Tables
   - Horizontal lines

7. **Find & Replace**
   - Find text
   - Replace single occurrence
   - Replace all occurrences

8. **Document Management**
   - Auto-save
   - Version history
   - Download as HTML or Text
   - Print/Export to PDF
   - Share document via email or link

9. **AI Features**
   - AI-powered document summarization

10. **Additional Tools**
    - Undo/Redo
    - Clear formatting
    - Subscript/Superscript
    - Code blocks
    - Blockquotes

### To Be Implemented

1. **Real-time Collaboration** (WebSocket)
   - Multiple users editing simultaneously
   - Live cursor positions
   - User presence indicators

2. **User Authentication**
   - Login/Signup
   - User profiles

3. **Document Organization**
   - Folders
   - Tags
   - Search within documents

4. **Comments & Suggestions**
   - Add comments to text
   - Suggest edits

5. **Table Features**
   - More table formatting options
   - Table formulas

6. **Drawing Tools**
   - Insert shapes
   - Drawing canvas

7. **Export Options**
   - Export to PDF with better formatting
   - Export to Word (.docx)
   - Export to Markdown

8. **Mobile Responsiveness**
   - Better mobile editing experience

## Tech Stack

### Frontend
- **React** - UI framework
- **Tiptap** - Rich text editor
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Motion** - Animations

### Backend
- **Express** - Web server
- **TypeScript** - Type safety
- **MongoDB** - Primary database (with SQLite fallback)
- **Better-SQLite3** - Local fallback database

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (optional, uses SQLite fallback)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd syncdocs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
MONGODB_URI=your_mongodb_connection_string
DB_NAME=syncdocs
APP_URL=http://localhost:8080
```

## Running the Project

### Development Mode
```bash
npm run dev
```
Server runs on http://localhost:8080

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
syncdocs/
├── src/
│   ├── components/
│   │   ├── Editor.tsx         # Main document editor
│   │   ├── RichTextEditor.tsx # Tiptap editor component
│   │   ├── Dashboard.tsx      # Document list dashboard
│   │   ├── Login.tsx          # Login page
│   │   ├── Layout.tsx         # App layout
│   │   └── ...
│   ├── services/
│   │   └── gemini.ts         # AI summarization service
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── types.ts              # TypeScript types
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # App component
│   └── index.css             # Global styles
├── server.ts                 # Express server
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README.md                 # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type check |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | Get all documents |
| GET | `/api/documents/:id` | Get single document |
| POST | `/api/documents` | Create new document |
| PUT | `/api/documents/:id` | Update document |
| POST | `/api/documents/:id/share` | Share document |

## Database

The project supports two databases:

1. **MongoDB Atlas** - Primary (requires connection string in .env)
2. **SQLite** - Automatic fallback when MongoDB is unavailable

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + B | Bold |
| Ctrl + I | Italic |
| Ctrl + U | Underline |
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + F | Find & Replace |

## Dependencies

### Main Dependencies
- `@tiptap/react` - React wrapper for Tiptap
- `@tiptap/starter-kit` - Basic Tiptap extensions
- `@tiptap/extension-*` - Various Tiptap extensions (underline, text-align, link, image, highlight, etc.)
- `react` - React library
- `react-dom` - React DOM library
- `react-router-dom` - Routing
- `express` - Express.js server
- `mongodb` - MongoDB driver
- `better-sqlite3` - SQLite database
- `socket.io` - WebSocket (for future collaboration)

### Dev Dependencies
- `typescript` - TypeScript compiler
- `vite` - Build tool
- `tsx` - TypeScript executor
- `tailwindcss` - CSS framework
- `@types/*` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
