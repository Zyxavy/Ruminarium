import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import JournalList from "./components/JournalList";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from './pages/Login';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<div>Register Page(WIP)</div>} />
                    <Route
                        path="/journals"
                        element={
                            <ProtectedRoute>
                                <JournalList />
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
