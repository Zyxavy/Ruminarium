import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import JournalList from "./components/JournalList";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './pages/Register';
import JournalEditor from './pages/JournalEditor';

import Login from './pages/Login';

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
