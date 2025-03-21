import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaGamepad, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginUser } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await loginUser(email, password);
      toast.success("Login successful!");
      navigate("/game");
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Failed to login. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your email or register.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
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
          <h2 className="text-xl font-bold text-white mb-6 text-center">Login to Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-400 hover:text-purple-300">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
