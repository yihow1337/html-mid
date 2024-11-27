const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 30;
const rows = 20;
const cols = 10;
let gameInterval;
let speed = 1000;
const deadBlocks = Array.from({ length: rows }, () => Array(cols).fill(0));
let selectedBlock = null;

// Define Tetris Blocks
const blocks = [
    [[1, 1], [1, 1]], // Square block
    [[1, 1, 1, 1]], // I block
    [[1, 1, 1], [0, 1, 0]], // T block
    [[1, 1, 0], [0, 1, 1]], // S block
    [[0, 1, 1], [1, 1, 0]], // Z block
];

// Current Block Data
let currentBlock = {
    shape: [],
    x: 4,
    y: 0,
    gradient: null,
};

// Start Game
function startGame() {
    if (!gameInterval) {
        openingAnimation();
        setTimeout(() => {
            createNewBlock();
            gameInterval = setInterval(moveDown, speed);
        }, 2000);
    }
}

// Pause Game
function pauseGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    } else {
        gameInterval = setInterval(moveDown, speed);
    }
}

// Reset Game
function resetGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    deadBlocks.forEach(row => row.fill(0));
    currentBlock = {
        shape: [],
        x: 4,
        y: 0,
        gradient: null,
    };
    selectedBlock = null;
}

// Opening Animation: Flying 2024
function openingAnimation() {
    let x = -200;
    let y = canvas.height / 2;
    const animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawText2024(x, y);
        x += 10;
        if (x > canvas.width) {
            clearInterval(animationInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, 50);
}

// Draw 2024 Text
function drawText2024(x, y) {
    ctx.font = '48px serif';
    ctx.fillStyle = getRandomGradient();
    ctx.fillText('2024', x, y);
}

// Create New Block
function createNewBlock() {
    const randomIndex = Math.floor(Math.random() * blocks.length);
    currentBlock.shape = blocks[randomIndex];
    currentBlock.x = 4;
    currentBlock.y = -1; // Start the block slightly above the canvas
    currentBlock.gradient = getRandomGradient();
    if (detectCollision()) {
        gameOver();
    } else {
        drawBlock();
    }
}

// Draw Block
function drawBlock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDeadBlocks();
    for (let row = 0; row < currentBlock.shape.length; row++) {
        for (let col = 0; col < currentBlock.shape[row].length; col++) {
            if (currentBlock.shape[row][col]) {
                const x = (currentBlock.x + col) * blockSize;
                const y = (currentBlock.y + row) * blockSize;
                if (y >= 0) { // Only draw if within canvas
                    ctx.fillStyle = currentBlock.gradient;
                    ctx.fillRect(x, y, blockSize, blockSize);
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, blockSize, blockSize);
                }
            }
        }
    }
}

// Draw Dead Blocks
function drawDeadBlocks() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (deadBlocks[row][col]) {
                const x = col * blockSize;
                const y = row * blockSize;
                ctx.fillStyle = '#888';
                ctx.fillRect(x, y, blockSize, blockSize);
                ctx.strokeRect(x, y, blockSize, blockSize);
            }
        }
    }
}

// Get Random Gradient
function getRandomGradient(x = 0, y = 0, width = blockSize, height = blockSize) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, randomColor());
    gradient.addColorStop(1, randomColor());
    return gradient;
}

// Get Random Color
function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Move Block Down
function moveDown() {
    currentBlock.y++;
    if (detectCollision()) {
        currentBlock.y--;
        setBlockToDead();
        clearFullRows();
        createNewBlock();
    } else {
        drawBlock();
    }
}

// Move Left
function moveLeft() {
    currentBlock.x--;
    if (detectCollision()) {
        currentBlock.x++;
    }
    drawBlock();
}

// Move Right
function moveRight() {
    currentBlock.x++;
    if (detectCollision()) {
        currentBlock.x--;
    }
    drawBlock();
}

// Rotate Block
function rotateBlock() {
    const newShape = currentBlock.shape[0].map((_, i) => currentBlock.shape.map(row => row[i]).reverse());
    const previousShape = currentBlock.shape;
    currentBlock.shape = newShape;
    if (detectCollision()) {
        currentBlock.shape = previousShape;
    }
    drawBlock();
}

// Detect Collision
function detectCollision() {
    for (let row = 0; row < currentBlock.shape.length; row++) {
        for (let col = 0; col < currentBlock.shape[row].length; col++) {
            if (currentBlock.shape[row][col]) {
                const newX = currentBlock.x + col;
                const newY = currentBlock.y + row;
                if (newX < 0 || newX >= cols || newY >= rows || (newY >= 0 && newY < rows && deadBlocks[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Set Block to Dead
function setBlockToDead() {
    for (let row = 0; row < currentBlock.shape.length; row++) {
        for (let col = 0; col < currentBlock.shape[row].length; col++) {
            if (currentBlock.shape[row][col]) {
                const newX = currentBlock.x + col;
                const newY = currentBlock.y + row;
                if (newY >= 0) { // Only set if within bounds
                    deadBlocks[newY][newX] = 1;
                }
            }
        }
    }
}

// Clear Full Rows
function clearFullRows() {
    for (let row = 0; row < rows; row++) {
        if (deadBlocks[row].every(cell => cell === 1)) {
            deadBlocks.splice(row, 1);
            deadBlocks.unshift(Array(cols).fill(0));
        }
    }
}

// Increase Speed
function increaseSpeed() {
    if (speed > 200) {
        speed -= 200;
        clearInterval(gameInterval);
        gameInterval = setInterval(moveDown, speed);
    }
}

// Decrease Speed
function decreaseSpeed() {
    speed += 200;
    clearInterval(gameInterval);
    gameInterval = setInterval(moveDown, speed);
}

// Move Block Down Manually
function moveDownManually() {
    moveDown();
}

// Game Over
function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;
    ctx.font = '48px serif';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', 50, canvas.height / 2);
}

// Mouse Events for Selecting and Dragging Block
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    if (isMouseInsideBlock(mouseX, mouseY)) {
        selectedBlock = { ...currentBlock };
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedBlock) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const proposedX = Math.floor(mouseX / blockSize);
        const proposedY = Math.floor(mouseY / blockSize);

        if (!isOverlapWithDeadBlocks(proposedX, proposedY, selectedBlock.shape)) {
            selectedBlock.x = proposedX;
            selectedBlock.y = proposedY;
        }
        drawSelectedBlock();
    }
});

canvas.addEventListener('mouseup', () => {
    if (selectedBlock) {
        currentBlock = { ...selectedBlock };
        selectedBlock = null;
        drawBlock();
    }
});

function isMouseInsideBlock(mouseX, mouseY) {
    const blockX = currentBlock.x * blockSize;
    const blockY = currentBlock.y * blockSize;
    const blockWidth = currentBlock.shape[0].length * blockSize;
    const blockHeight = currentBlock.shape.length * blockSize;
    return mouseX >= blockX && mouseX <= blockX + blockWidth && mouseY >= blockY && mouseY <= blockY + blockHeight;
}

function isOverlapWithDeadBlocks(proposedX, proposedY, shape) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = proposedX + col;
                const newY = proposedY + row;
                if (newX < 0 || newX >= cols || newY >= rows || (newY >= 0 && deadBlocks[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function drawSelectedBlock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDeadBlocks();
    drawBlock(); // Draw the normal block state for all blocks except the selected one
    for (let row = 0; row < selectedBlock.shape.length; row++) {
        for (let col = 0; col < selectedBlock.shape[row].length; col++) {
            if (selectedBlock.shape[row][col]) {
                const x = (selectedBlock.x + col) * blockSize;
                const y = (selectedBlock.y + row) * blockSize;
                ctx.fillStyle = selectedBlock.gradient;
                ctx.fillRect(x, y, blockSize, blockSize);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, blockSize, blockSize);
            }
        }
    }
}