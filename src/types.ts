export interface Document {
  id: string;
  title: string;
  content: string;
  owner: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface CursorPos {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
}
