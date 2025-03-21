import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaGamepad, FaSpinner, FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { registerUser } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/game");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !displayName) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerUser(email, password, displayName);
      toast.success("Registration successful!");
      navigate("/game");
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Failed to register. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use. Please use a different email or login.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-6 px-6 flex items-center justify-center">
          <FaGamepad className="text-white text-4xl mr-3" />
          <h1 className="text-2xl font-bold text-white">Blockchain Treasure Hunt</h1>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Create Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserAlt className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your display name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                }
                transition-colors duration-200 text-white font-medium
              `}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
