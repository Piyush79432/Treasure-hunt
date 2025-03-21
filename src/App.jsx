import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { useAuth } from "./context/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GamePage from "./pages/GamePage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <ToastContainer position="top-right" theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game" element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/game" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
