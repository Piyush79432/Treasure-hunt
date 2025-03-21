import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTrophy, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { logoutUser } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

import GameBoard from "../components/GameBoard";
import GameControls from "../components/GameControls";
import GameInfo from "../components/GameInfo";
import WalletConnect from "../components/WalletConnect";
import Header from "../components/Header";

const GamePage = () => {
  const { currentUser } = useAuth();
  const { 
    account, 
    networkName, 
    gameState, 
    error, 
    connectWallet, 
    joinGame, 
    movePlayer, 
    resetError,
    CONTRACT_ADDRESS,
    JOIN_FEE
  } = useGame();
  const [playerNameInput, setPlayerNameInput] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleJoinGame = () => {
    // Use the input name or fall back to the user's display name
    const playerName = playerNameInput.trim() || currentUser?.displayName || "Player";
    joinGame(playerName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header 
        networkName={networkName} 
        userName={currentUser?.displayName || "Player"}
        onLogout={handleLogout}
        onProfileClick={() => navigate("/profile")}
        onLeaderboardClick={() => navigate("/leaderboard")}
      />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-6 rounded-lg flex justify-between">
            <p>{error}</p>
            <button onClick={resetError} className="font-bold">×</button>
          </div>
        )}
        
        {CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000" && (
          <div className="bg-yellow-600 text-white p-4 mb-6 rounded-lg">
            <p className="font-bold">⚠️ Using default contract address</p>
            <p className="text-sm mt-1">
              Update the CONTRACT_ADDRESS in public/config.js with your deployed contract address.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GameBoard 
              playerPosition={gameState.playerPosition} 
              hasJoined={gameState.hasJoined}
              onMove={movePlayer}
              isLoading={gameState.isLoading}
              showTreasure={window.TreasureHuntConfig?.SHOW_TREASURE_POSITION_FOR_TESTING}
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaUserCircle className="text-purple-400 text-2xl mr-2" />
                  <div>
                    <h3 className="font-medium">{currentUser?.displayName || "Player"}</h3>
                    <p className="text-xs text-gray-400">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate("/profile")}
                    className="p-2 bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"
                    title="Profile"
                  >
                    <FaUser className="text-gray-300" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
                    title="Logout"
                  >
                    <FaSignOutAlt className="text-white" />
                  </button>
                </div>
              </div>
              
              {gameState.playerScore > 0 && (
                <div className="flex items-center mt-2 bg-yellow-600 p-2 rounded">
                  <FaTrophy className="text-yellow-300 mr-2" />
                  <span>Treasures Found: {gameState.playerScore}</span>
                </div>
              )}
            </div>
            
            <WalletConnect 
              account={account} 
              onConnect={connectWallet} 
              isLoading={gameState.isLoading}
              networkName={networkName}
            />
            
            <GameInfo 
              hasJoined={gameState.hasJoined}
              playerPosition={gameState.playerPosition}
              hasMoved={gameState.hasMoved}
              winner={gameState.winner}
              gameBalance={gameState.gameBalance}
              account={account}
              contractAddress={CONTRACT_ADDRESS}
              playerName={gameState.playerName}
            />
            
            <GameControls 
              hasJoined={gameState.hasJoined}
              onJoin={handleJoinGame}
              isLoading={gameState.isLoading}
              account={account}
              joinFee={JOIN_FEE}
              statusMessage={gameState.statusMessage}
              playerNameInput={playerNameInput}
              setPlayerNameInput={setPlayerNameInput}
              defaultName={currentUser?.displayName || "Player"}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
