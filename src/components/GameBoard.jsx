import { useState, useEffect } from "react";
import { FaUser, FaCoins, FaSpinner, FaFlag } from "react-icons/fa";
import { ethers } from "ethers";
import TreasureHuntABI from '../build/contracts/TreasureHunt.json';


const GameBoard = ({ playerPosition, hasJoined, onMove, isLoading, showTreasure = false }) => {
  const gridSize = 10;
  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  const [treasurePosition, setTreasurePosition] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [playerPositions, setPlayerPositions] = useState({});

  // For testing purposes only - fetch treasure position if enabled
  useEffect(() => {
    if (showTreasure && window.ethereum && window.TreasureHuntConfig) {
      const fetchTreasurePosition = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            window.TreasureHuntConfig.CONTRACT_ADDRESS,
            TreasureHuntABI,
            provider
          );
          
          // Check if contract is deployed
          const code = await provider.getCode(window.TreasureHuntConfig.CONTRACT_ADDRESS);
          if (code === '0x') {
            console.warn("Contract is not deployed, cannot fetch treasure position");
            return;
          }
          
          const position = await contract.treasurePosition();
          setTreasurePosition(position.toNumber());
        } catch (error) {
          console.error("Error fetching treasure position:", error);
        }
      };
      fetchTreasurePosition();
    }
  }, [showTreasure]);

  const handleCellClick = (cellIndex) => {
    if (!hasJoined || isLoading) return;
    
    const playerRow = Math.floor(playerPosition / gridSize);
    const playerCol = playerPosition % gridSize;
    const cellRow = Math.floor(cellIndex / gridSize);
    const cellCol = cellIndex % gridSize;
    
    // Check if the cell is adjacent (including diagonals)
    const rowDiff = Math.abs(playerRow - cellRow);
    const colDiff = Math.abs(playerCol - cellCol);
    
    if ((rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0)) {
      onMove(cellIndex);
    }
  };

  const isAdjacent = (cellIndex) => {
    if (!playerPosition && playerPosition !== 0) return false;
    
    const playerRow = Math.floor(playerPosition / gridSize);
    const playerCol = playerPosition % gridSize;
    const cellRow = Math.floor(cellIndex / gridSize);
    const cellCol = cellIndex % gridSize;
    
    const rowDiff = Math.abs(playerRow - cellRow);
    const colDiff = Math.abs(playerCol - cellCol);
    
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  const getCellClass = (cellIndex) => {
    let baseClass = "aspect-square flex items-center justify-center rounded-md transition-colors duration-200 relative";
    
    if (playerPosition === cellIndex) {
      return `${baseClass} bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg`;
    }
    
    if (showTreasure && treasurePosition === cellIndex) {
      return `${baseClass} bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-lg`;
    }
    
    if (!isLoading && hasJoined && isAdjacent(cellIndex)) {
      return `${baseClass} bg-gray-600 ${hoveredCell === cellIndex ? 'bg-gray-500 shadow-md' : 'hover:bg-gray-500'} cursor-pointer`;
    }
    
    // Add some visual variety to the board
    const row = Math.floor(cellIndex / gridSize);
    const col = cellIndex % gridSize;
    const isEvenCell = (row + col) % 2 === 0;
    
    return `${baseClass} ${isEvenCell ? 'bg-gray-700' : 'bg-gray-600'} ${isLoading ? 'opacity-50' : ''}`;
  };

  // Add some visual elements to make the board more interesting
  const getCellDecoration = (cellIndex) => {
    // Add random decorations to some cells
    const seed = cellIndex * 13 % 100;
    
    if (seed < 5) {
      return <div className="absolute w-2 h-2 bg-yellow-500 rounded-full opacity-30"></div>;
    } else if (seed < 10) {
      return <div className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"></div>;
    } else if (seed < 15) {
      return <div className="absolute w-3 h-3 border border-gray-500 rounded-full opacity-10"></div>;
    }
    
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center flex items-center justify-center">
        <FaFlag className="text-purple-400 mr-2" />
        Treasure Hunt Game Board
      </h2>
      
      <div className="grid grid-cols-10 gap-1 md:gap-2 p-2 bg-gray-800 rounded-lg shadow-inner">
        {cells.map((cellIndex) => (
          <div
            key={cellIndex}
            onClick={() => handleCellClick(cellIndex)}
            onMouseEnter={() => setHoveredCell(cellIndex)}
            onMouseLeave={() => setHoveredCell(null)}
            className={getCellClass(cellIndex)}
          >
            {playerPosition === cellIndex ? (
              <FaUser className="text-white text-lg z-10" />
            ) : showTreasure && treasurePosition === cellIndex ? (
              <FaCoins className="text-white text-lg z-10" />
            ) : (
              <>
                <span className="text-xs text-gray-400 opacity-50">{cellIndex}</span>
                {getCellDecoration(cellIndex)}
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
        {!hasJoined ? (
          <p className="flex items-center">
            <FaCoins className="text-yellow-400 mr-2" />
            Connect your wallet and join the game to start playing
          </p>
        ) : (
          <p className="flex items-center">
            <FaUser className="text-blue-400 mr-2" />
            Click on an adjacent cell to move your player
          </p>
        )}
      </div>
      
      {isLoading && (
        <div className="mt-3 flex items-center justify-center text-blue-300 bg-gray-800 p-3 rounded-lg">
          <FaSpinner className="animate-spin mr-2" />
          <span>Processing transaction...</span>
        </div>
      )}
      
      {showTreasure && treasurePosition !== null && (
        <div className="mt-3 p-3 bg-yellow-600 rounded-lg text-sm">
          <p className="font-bold flex items-center">
            <FaCoins className="text-yellow-300 mr-2" />
            Testing Mode: Treasure is visible at position {treasurePosition}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
