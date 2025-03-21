import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaWallet, FaTrophy, FaGamepad, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import Header from "../components/Header";

const ProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const { account, networkName } = useGame();
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      // Update Firestore document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header 
        networkName={networkName} 
        userName={currentUser?.displayName || "Player"}
        onLogout={() => {}}
        onProfileClick={() => {}}
        onLeaderboardClick={() => navigate("/leaderboard")}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate("/game")}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Game
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                  <FaUser className="text-white text-4xl" />
                </div>
                <h2 className="text-xl font-bold">{currentUser?.displayName || "Player"}</h2>
                <p className="text-gray-400 text-sm mt-1">{currentUser?.email}</p>
                
                {account && (
                  <div className="mt-4 bg-gray-800 p-3 rounded-lg w-full">
                    <div className="flex items-center">
                      <FaWallet className="text-purple-400 mr-2" />
                      <span className="text-xs font-mono overflow-hidden overflow-ellipsis">
                        {account}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Game Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                    <div className="flex items-center">
                      <FaGamepad className="text-blue-400 mr-2" />
                      <span>Games Played</span>
                    </div>
                    <span className="font-bold">{userData?.gameStats?.gamesPlayed || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                    <div className="flex items-center">
                      <FaTrophy className="text-yellow-400 mr-2" />
                      <span>Treasures Found</span>
                    </div>
                    <span className="font-bold">{userData?.gameStats?.treasuresFound || 0}</span>
                  </div>
                  
                  {userData?.gameStats?.lastPlayed && (
                    <div className="text-xs text-gray-400 mt-2">
                      Last played: {new Date(userData.gameStats.lastPlayed.toDate()).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
              
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={account || ""}
                      disabled
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed font-mono text-xs"
                    />
                    <p className="text-xs text-gray-400 mt-1">Connect your wallet in the game to update this</p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`
                        w-full py-3 px-4 rounded-lg flex items-center justify-center
                        ${
                          isUpdating
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        }
                        transition-colors duration-200 text-white font-medium
                      `}
                    >
                      {isUpdating ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Update Profile</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
