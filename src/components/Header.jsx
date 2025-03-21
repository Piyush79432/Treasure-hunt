import React, { useState } from "react";
import { FaCoins, FaUser, FaSignOutAlt, FaTrophy, FaBars, FaTimes } from "react-icons/fa";

const Header = ({ networkName, userName, onLogout, onProfileClick, onLeaderboardClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 shadow-lg py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaCoins className="text-yellow-400 text-2xl" />
          <h1 className="text-2xl font-bold text-white">Blockchain Treasure Hunt</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {networkName && (
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              <span className="text-gray-300">Network: </span>
              <span className="text-green-400 font-medium">{networkName}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={onLeaderboardClick}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              title="Leaderboard"
            >
              <FaTrophy className="text-yellow-400 mr-2" />
              <span>Leaderboard</span>
            </button>
            
            <button 
              onClick={onProfileClick}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              title="Profile"
            >
              <FaUser className="text-purple-400 mr-2" />
              <span>{userName}</span>
            </button>
            
            <button 
              onClick={onLogout}
              className="px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              title="Logout"
            >
              <FaSignOutAlt className="text-white mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 mt-2 py-2 px-4">
          <div className="flex flex-col space-y-2">
            {networkName && (
              <div className="bg-gray-800 px-3 py-2 rounded-lg text-sm">
                <span className="text-gray-300">Network: </span>
                <span className="text-green-400 font-medium">{networkName}</span>
              </div>
            )}
            
            <div className="bg-gray-800 px-3 py-2 rounded-lg flex items-center">
              <FaUser className="text-purple-400 mr-2" />
              <span>{userName}</span>
            </div>
            
            <button 
              onClick={onLeaderboardClick}
              className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <FaTrophy className="text-yellow-400 mr-2" />
              <span>Leaderboard</span>
            </button>
            
            <button 
              onClick={onProfileClick}
              className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <FaUser className="text-gray-300 mr-2" />
              <span>Profile</span>
            </button>
            
            <button 
              onClick={onLogout}
              className="bg-red-800 px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <FaSignOutAlt className="text-white mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
