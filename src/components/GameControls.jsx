import { FaEthereum, FaSpinner, FaGamepad, FaUser } from "react-icons/fa";

const GameControls = ({ 
  hasJoined, 
  onJoin, 
  isLoading, 
  account, 
  joinFee = "0.001", 
  statusMessage,
  playerNameInput,
  setPlayerNameInput,
  defaultName
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaGamepad className="text-purple-400 mr-2" />
        Game Controls
      </h2>

      {!account ? (
        <p className="text-yellow-300 mb-4 bg-gray-800 p-3 rounded-lg">Connect your wallet to play</p>
      ) : !hasJoined ? (
        <div>
          <p className="mb-4 bg-gray-800 p-3 rounded-lg">Join the game by sending {joinFee} ETH to start playing</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Player Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-500" />
              </div>
              <input
                type="text"
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                placeholder={defaultName || "Enter your name"}
                className="bg-gray-800 text-white placeholder-gray-500 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <button
            onClick={onJoin}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
              ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              }
              transition-colors duration-200
            `}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaEthereum className="mr-2" />
                <span>Join Game ({joinFee} ETH)</span>
              </>
            )}
          </button>
          
          {statusMessage && (
            <p className="mt-3 text-sm text-blue-300">{statusMessage}</p>
          )}
          
          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
            <p className="text-gray-300">Make sure you have enough ETH in your wallet:</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-400">
              <li>{joinFee} ETH to join the game</li>
              <li>Additional ETH for gas fees</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-lg mb-3">
            <p className="font-bold">You've joined the game!</p>
            <p className="text-sm mt-1">Click on adjacent cells on the game board to move your player</p>
          </div>
          
          {statusMessage && (
            <p className="mt-3 text-sm text-blue-300 bg-gray-800 p-3 rounded-lg">{statusMessage}</p>
          )}
          
          <p className="mt-4 text-yellow-300 bg-gray-800 p-3 rounded-lg flex items-center">
            <FaEthereum className="mr-2" />
            Find the hidden treasure to win the pot!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameControls;
