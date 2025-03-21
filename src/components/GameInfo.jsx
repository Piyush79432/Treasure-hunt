import { FaEthereum, FaTrophy, FaMapMarkerAlt, FaHourglassHalf, FaExternalLinkAlt, FaUser } from "react-icons/fa";

const GameInfo = ({ 
  hasJoined, 
  playerPosition, 
  hasMoved, 
  winner, 
  gameBalance, 
  account, 
  contractAddress,
  playerName
}) => {
  // Get block explorer URL based on network
  const getExplorerUrl = () => {
    // This is a simplified version - in production you'd want to detect the network
    // and use the appropriate explorer
    if (window.ethereum && window.ethereum.networkVersion) {
      const networkId = window.ethereum.networkVersion;
      
      const explorers = {
        '1': 'https://etherscan.io',
        '5': 'https://goerli.etherscan.io',
        '11155111': 'https://sepolia.etherscan.io',
        '137': 'https://polygonscan.com',
        '80001': 'https://mumbai.polygonscan.com',
        '42161': 'https://arbiscan.io',
        '421613': 'https://goerli.arbiscan.io'
      };
      
      const baseUrl = explorers[networkId] || 'https://etherscan.io';
      return `${baseUrl}/address/${contractAddress}`;
    }
    
    return `https://etherscan.io/address/${contractAddress}`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaMapMarkerAlt className="text-blue-400 mr-2" />
        Game Information
      </h2>

      {!account ? (
        <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">Connect your wallet to see game information</p>
      ) : !hasJoined ? (
        <div>
          <p className="text-gray-300 mb-3 bg-gray-800 p-3 rounded-lg">Join the game to start playing</p>
          
          <div className="flex items-center space-x-2 mb-3 bg-gray-800 p-3 rounded-lg">
            <FaEthereum className="text-yellow-400" />
            <span>
              Prize Pool: <span className="font-mono">{gameBalance} ETH</span>
            </span>
          </div>
          
          <div className="text-xs text-gray-400 flex items-center bg-gray-800 p-3 rounded-lg">
            <span className="mr-1">Contract:</span>
            <a 
              href={getExplorerUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              {contractAddress.substring(0, 6)}...{contractAddress.substring(contractAddress.length - 4)}
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {playerName && (
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
              <FaUser className="text-purple-400" />
              <span>
                Player Name: <span className="font-medium">{playerName}</span>
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
            <FaMapMarkerAlt className="text-blue-400" />
            <span>
              Your Position: <span className="font-mono">{playerPosition}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
            <FaHourglassHalf className={hasMoved ? "text-red-400" : "text-green-400"} />
            <span>Move Status: {hasMoved ? "Already moved this turn" : "Ready to move"}</span>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
            <FaEthereum className="text-yellow-400" />
            <span>
              Prize Pool: <span className="font-mono">{gameBalance} ETH</span>
            </span>
          </div>

          <div className="text-xs text-gray-400 flex items-center bg-gray-800 p-3 rounded-lg">
            <span className="mr-1">Contract:</span>
            <a 
              href={getExplorerUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              View on Explorer
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>

          {winner && winner !== "0x0000000000000000000000000000000000000000" && (
            <div className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg flex items-center space-x-2">
              <FaTrophy className="text-yellow-300" />
              <div>
                <p className="font-bold">Winner!</p>
                <p className="text-xs">{winner === account ? "You won the treasure!" : `Address: ${winner}`}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameInfo;
