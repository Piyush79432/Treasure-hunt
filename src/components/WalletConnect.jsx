import { FaWallet, FaSpinner, FaExclamationTriangle, FaEthereum } from "react-icons/fa";

const WalletConnect = ({ account, onConnect, isLoading, networkName }) => {
  // Format address to show only first 6 and last 4 characters
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaEthereum className="text-yellow-400 mr-2" />
        Wallet Connection
      </h2>

      {!account ? (
        <div>
          <button
            onClick={onConnect}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
              ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              }
              transition-colors duration-200
            `}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <FaWallet className="mr-2" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
          
          <div className="mt-3 text-xs text-gray-400 bg-gray-800 p-3 rounded-lg">
            <p>Connect your wallet to join the treasure hunt game</p>
            {networkName && (
              <p className="mt-1">Currently connected to: <span className="text-green-400">{networkName}</span></p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-green-800 to-teal-800 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-mono">{formatAddress(account)}</span>
            </div>
            <span className="text-xs text-green-400">Connected</span>
          </div>
          
          {networkName && networkName !== 'mainnet' && networkName !== 'homestead' && (
            <div className="mt-3 text-xs flex items-center text-yellow-300 bg-gray-800 p-3 rounded-lg">
              <FaExclamationTriangle className="mr-1" />
              <span>Connected to {networkName} (test network)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
