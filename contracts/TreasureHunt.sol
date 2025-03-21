// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TreasureHunt {
    struct Player {
        uint256 position;
        bool hasMoved;
        string name;
        uint256 score;
        uint256 lastMoveTime;
    }

    mapping(address => Player) public players;
    address[] public playerAddresses;
    uint256 public treasurePosition;
    address public winner;
    uint256 public joinFee;
    uint256 public gridSize;
    uint256 public turnDuration;
    uint256 public lastResetTime;
    
    event PlayerJoined(address player, string name);
    event PlayerMoved(address player, uint256 newPosition);
    event TreasureFound(address winner, uint256 reward);
    event GameReset(uint256 newTreasurePosition);

    constructor(uint256 _joinFee, uint256 _gridSize, uint256 _turnDuration) {
        joinFee = _joinFee;
        gridSize = _gridSize;
        turnDuration = _turnDuration;
        resetGame();
    }

    function resetGame() internal {
        // Generate a new random treasure position
        uint256 newTreasurePosition = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % (gridSize * gridSize);
        treasurePosition = newTreasurePosition;
        winner = address(0);
        lastResetTime = block.timestamp;
        
        // Reset all players' move status
        for (uint i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]].hasMoved = false;
        }
        
        emit GameReset(treasurePosition);
    }

    function joinGame(string memory playerName) external payable {
        require(msg.value >= joinFee, "Insufficient fee to join the game");
        require(players[msg.sender].position == 0, "Already joined");
        
        // Generate a random starting position
        uint256 startPosition = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % (gridSize * gridSize);
        
        // Make sure it's not the treasure position
        if (startPosition == treasurePosition) {
            startPosition = (startPosition + 1) % (gridSize * gridSize);
        }
        
        players[msg.sender] = Player({
            position: startPosition,
            hasMoved: false,
            name: playerName,
            score: 0,
            lastMoveTime: block.timestamp
        });
        
        playerAddresses.push(msg.sender);
        
        emit PlayerJoined(msg.sender, playerName);
    }

    function move(uint256 newPosition) external {
        require(players[msg.sender].position > 0, "Not joined");
        require(!players[msg.sender].hasMoved, "Already moved this turn");
        require(isValidMove(players[msg.sender].position, newPosition), "Invalid move");
        
        players[msg.sender].position = newPosition;
        players[msg.sender].hasMoved = true;
        players[msg.sender].lastMoveTime = block.timestamp;
        
        emit PlayerMoved(msg.sender, newPosition);
        
        // Check if player found the treasure
        if (newPosition == treasurePosition && winner == address(0)) {
            winner = msg.sender;
            players[msg.sender].score += 1;
            
            uint256 reward = address(this).balance;
            payable(msg.sender).transfer(reward);
            
            emit TreasureFound(msg.sender, reward);
            
            // Reset the game for a new round
            resetGame();
        }
    }
    
    function resetTurn() external {
        require(block.timestamp > lastResetTime + turnDuration, "Turn duration not passed yet");
        
        // Reset all players' move status
        for (uint i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]].hasMoved = false;
        }
        
        lastResetTime = block.timestamp;
    }
    
    function getPlayerName(address playerAddress) external view returns (string memory) {
        return players[playerAddress].name;
    }
    
    function getPlayerScore(address playerAddress) external view returns (uint256) {
        return players[playerAddress].score;
    }
    
    function getPlayerCount() external view returns (uint256) {
        return playerAddresses.length;
    }
    
    function isValidMove(uint256 currentPosition, uint256 newPosition) internal view returns (bool) {
        if (newPosition >= gridSize * gridSize) {
            return false;
        }
        
        uint256 currentRow = currentPosition / gridSize;
        uint256 currentCol = currentPosition % gridSize;
        uint256 newRow = newPosition / gridSize;
        uint256 newCol = newPosition % gridSize;
        
        // Check if the move is to an adjacent cell (including diagonals)
        int256 rowDiff = int256(newRow) - int256(currentRow);
        int256 colDiff = int256(newCol) - int256(currentCol);
        
        return (rowDiff >= -1 && rowDiff <= 1 && colDiff >= -1 && colDiff <= 1) && 
               !(rowDiff == 0 && colDiff == 0);
    }
}
