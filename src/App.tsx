import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import Login from './components/Login';
import SharedWithMe from './components/SharedWithMe';
import Invitations from './components/Invitations';
import VersionHistory from './components/VersionHistory';
import Settings from './components/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/shared" element={<SharedWithMe />} />
        <Route path="/invitations" element={<Invitations />} />
        <Route path="/history" element={<VersionHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
