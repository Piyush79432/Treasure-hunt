import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaMedal, FaUser } from "react-icons/fa";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import Header from "../components/Header";

const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const { networkName } = useGame();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          orderBy("gameStats.treasuresFound", "desc"),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const leaderboardData = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          leaderboardData.push({
            id: doc.id,
            displayName: userData.displayName,
            treasuresFound: userData.gameStats?.treasuresFound || 0,
            gamesPlayed: userData.gameStats?.gamesPlayed || 0,
            isCurrentUser: doc.id === currentUser?.uid
          });
        });
        
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [currentUser]);

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-400"; // Gold
      case 1:
        return "text-gray-300"; // Silver
      case 2:
        return "text-yellow-600"; // Bronze
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header 
        networkName={networkName} 
        userName={currentUser?.displayName || "Player"}
        onLogout={() => {}}
        onProfileClick={() => navigate("/profile")}
        onLeaderboardClick={() => {}}
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
        
        <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <div className="flex items-center justify-center">
              <FaTrophy className="text-yellow-300 text-3xl mr-3" />
              <h1 className="text-2xl font-bold text-white">Treasure Hunt Leaderboard</h1>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="p-6">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No players have found treasures yet. Be the first!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-600">
                        <th className="pb-3 pl-4">Rank</th>
                        <th className="pb-3">Player</th>
                        <th className="pb-3">Treasures Found</th>
                        <th className="pb-3">Games Played</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((player, index) => (
                        <tr 
                          key={player.id} 
                          className={`
                            border-b border-gray-600 last:border-0
                            ${player.isCurrentUser ? 'bg-purple-900 bg-opacity-30' : ''}
                          `}
                        >
                          <td className="py-4 pl-4 flex items-center">
                            {index < 3 ? (
                              <FaMedal className={`mr-2 ${getMedalColor(index)}`} />
                            ) : (
                              <span className="w-6 text-center">{index + 1}</span>
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                <FaUser className="text-gray-300" />
                              </div>
                              <span className={player.isCurrentUser ? 'font-bold' : ''}>
                                {player.displayName}
                                {player.isCurrentUser && ' (You)'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 font-bold">{player.treasuresFound}</td>
                          <td className="py-4">{player.gamesPlayed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
