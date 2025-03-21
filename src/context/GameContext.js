import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAuth } from './AuthContext';
import { updateUserWallet, updateGameStats } from '../firebase/firebase';
import TreasureHuntABI from "../contracts/TreasureHuntABI";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [gameState, setGameState] = useState({
    playerPosition: null,
    hasMoved: false,
    hasJoined: false,
    winner: null,
    gameBalance: '0',
    isLoading: false,
    playerName: '',
    playerScore: 0
  });
  const [error, setError] = useState(null);

  // Contract configuration
  const CONTRACT_ADDRESS = window.TreasureHuntConfig?.CONTRACT_ADDRESS || "0x0881Ba8e0ac771359aFf201C00d06202aCe009b7";
  const JOIN_FEE = window.TreasureHuntConfig?.JOIN_FEE || "0.05";

  // Initialize ethers and contract
  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);

          const network = await web3Provider.getNetwork();
          setNetworkName(network.name === 'unknown' ? 'Local Network' : network.name);

          const treasureHuntContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            TreasureHuntABI,
            web3Provider
          );
          setContract(treasureHuntContract);

          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const signer = web3Provider.getSigner();
            setSigner(signer);

            if (currentUser && accounts[0]) {
              await updateUserWallet(currentUser.uid, accounts[0]);
            }

            const connectedContract = treasureHuntContract.connect(signer);
            setContract(connectedContract);

            try {
              await updateGameState(accounts[0], connectedContract);
            } catch (err) {
              console.warn("Initial game state error:", err);
            }
          }
        } catch (err) {
          console.error("Ethers initialization error:", err);
          setError("Blockchain connection failed. Please refresh.");
        }
      }
    };

    initializeEthers();
  }, [CONTRACT_ADDRESS, currentUser]);

  // Account change handler
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          if (currentUser && accounts[0]) {
            await updateUserWallet(currentUser.uid, accounts[0]);
          }
          if (provider && contract) {
            const signer = provider.getSigner();
            setSigner(signer);
            const connectedContract = contract.connect(signer);
            setContract(connectedContract);
            try {
              await updateGameState(accounts[0], connectedContract);
            } catch (err) {
              console.warn("Game state update error:", err);
            }
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, [provider, contract, account, currentUser]);

  const connectWallet = async () => {
    if (provider) {
      try {
        setGameState(prev => ({ ...prev, isLoading: true }));
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        if (currentUser && accounts[0]) {
          await updateUserWallet(currentUser.uid, accounts[0]);
        }

        const signer = provider.getSigner();
        setSigner(signer);
        const connectedContract = contract.connect(signer);
        setContract(connectedContract);

        await updateGameState(accounts[0], connectedContract);
        setGameState(prev => ({ ...prev, isLoading: false }));
      } catch (err) {
        console.error("Wallet connection error:", err);
        setError("Wallet connection failed. Please try again.");
        setGameState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const updateGameState = async (account, contract) => {
    try {
      const isDeployed = await isContractDeployed(CONTRACT_ADDRESS);
      if (!isDeployed) {
        console.warn("Contract not deployed");
        return;
      }

      const playerInfo = await contract.players(account);
      const winner = await contract.winner();
      const balance = await provider.getBalance(CONTRACT_ADDRESS);

      let playerName = '';
      let playerScore = 0;
      try {
        playerName = await contract.getPlayerName(account);
        playerScore = await contract.getPlayerScore(account);
      } catch (err) {
        console.warn("Player data error:", err);
      }

      setGameState({
        playerPosition: playerInfo.position.toNumber(),
        hasMoved: playerInfo.hasMoved,
        hasJoined: playerInfo.position.toNumber() !== 0 || playerInfo.hasMoved,
        winner: winner,
        gameBalance: ethers.utils.formatEther(balance),
        isLoading: false,
        playerName,
        playerScore: playerScore.toNumber()
      });

      if (currentUser) {
        await updateGameStats(currentUser.uid, {
          treasuresFound: playerScore.toNumber()
        });
      }
    } catch (err) {
      console.error("Game state update error:", err);
      setGameState(prev => ({ ...prev, isLoading: false }));
      throw err;
    }
  };

  const isContractDeployed = async (address) => {
    return provider && (await provider.getCode(address)) !== '0x';
  };
  const joinGame = async (playerName) => {
    if (contract && signer) {
      try {
        setGameState(prev => ({ ...prev, isLoading: true }));
  
        // Validate contract deployment
        if (!(await isContractDeployed(CONTRACT_ADDRESS))) {
          setError(`Contract not deployed at ${CONTRACT_ADDRESS}`);
          setGameState(prev => ({ ...prev, isLoading: false }));
          return;
        }
  
        // Parameter validation
        const name = playerName?.trim() || (currentUser?.displayName || "Player");
        if (!name) {
          setError("Player name required");
          setGameState(prev => ({ ...prev, isLoading: false }));
          return;
        }
  
        // Funds check (JOIN_FEE + gas buffer)
        const joinFeeWei = ethers.utils.parseEther(JOIN_FEE);
        const balance = await provider.getBalance(account);
        const requiredBalance = joinFeeWei.add(ethers.utils.parseEther("0.005"));
        
        if (balance.lt(requiredBalance)) {
          setError(`Need ${JOIN_FEE} ETH + 0.005 ETH for gas`);
          setGameState(prev => ({ ...prev, isLoading: false }));
          return;
        }
  
        // CORRECTED FUNCTION CALL - SINGLE ARGUMENT
        const tx = await contract.joinGame(name, { 
          value: joinFeeWei,
          gasLimit: 500000
        });
  
        // Transaction confirmation handling...
        await tx.wait();
        await updateGameState(account, contract);
  
      } catch (err) {
        console.error("Join error:", err);
        setError(err.reason || "Transaction failed. Check contract status.");
        setGameState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const movePlayer = async (newPosition) => {
    if (contract && signer) {
      try {
        setGameState(prev => ({ ...prev, isLoading: true }));
        
        const tx = await contract.move(newPosition, { gasLimit: 100000 });
        
        setError(null);
        setGameState(prev => ({ 
          ...prev, 
          isLoading: true, 
          statusMessage: "Moving..." 
        }));
        
        await tx.wait();
        await updateGameState(account, contract);
      } catch (err) {
        console.error("Move error:", err);
        setError(err.reason || "Move failed. Check position and turn status.");
        setGameState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const resetError = () => setError(null);

  const value = {
    provider,
    signer,
    contract,
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
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};