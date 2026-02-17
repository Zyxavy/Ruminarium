import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import JournalList from "./components/JournalList";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './pages/Register';
import JournalEditor from './pages/JournalEditor';

import Login from './pages/Login';

/**
 * Root application component – defines the routing structure of the entire app.
 *
 * Features:
 * - Uses React Router v6 for client-side routing
 * - Public routes: /login and /register (no authentication required)
 * - Protected routes: all journal-related pages (require valid token)
 * - Root path ("/") redirects to /journals
 * - Wraps everything in BrowserRouter and a full-height background container
 *
 * Route overview:
 *   - /login          -> Login page
 *   - /register       -> Registration page
 *   - /journals       -> List of all user journals
 *   - /journals/new   -> Create new journal entry
 *   - /journals/:id   -> View/edit existing journal entry
 *   - /               -> Redirects to /journals
 */
function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/journals"
                        element={
                            <ProtectedRoute>
                                <JournalList />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                      path="/journals/:id" 
                      element={
                        <ProtectedRoute>
                          <JournalEditor />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/journals/new" 
                      element={
                        <ProtectedRoute>
                          <JournalEditor />
                        </ProtectedRoute>
                      } 
                    />

                    <Route path="/" element={<Navigate to="/journals" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
