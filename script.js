const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas dynamically
canvas.width = Math.min(window.innerWidth, 400);
canvas.height = Math.min(window.innerHeight, 400);

// Constants
const tileSize = canvas.width / 20;
const rows = Math.floor(canvas.height / tileSize);
const cols = Math.floor(canvas.width / tileSize);

// Game variables
let pacman = { x: 1, y: 1, dx: 0, dy: 0 };
let ghosts = [
  { x: 8, y: 8, dx: 1, dy: 0 },
  { x: 10, y: 10, dx: 0, dy: 1 },
];
let maze = [];
let dots = [];
let score = 0;
let level = 1;

// Generate maze: 1 for walls, 0 for paths
const mazeTemplate = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Initialize maze and dots
function initializeMaze() {
  maze = [];
  dots = [];
  mazeTemplate.forEach((row, r) => {
    maze.push([...row]);
    row.forEach((cell, c) => {
      if (cell === 0) dots.push({ x: c, y: r });
    });
  });
}

initializeMaze();

// Draw maze, dots, Pac-Man, ghosts, and score
// Functions from original script remain unchanged

// Touch input handling
let startX, startY;
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

canvas.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    pacman.dx = dx > 0 ? 1 : -1;
    pacman.dy = 0;
  } else {
    pacman.dy = dy > 0 ? 1 : -1;
    pacman.dx = 0;
  }
});

// Optimize rendering performance
let frameCount = 0;
function gameLoop() {
  frameCount++;
  if (frameCount % 2 === 0) { // Render every other frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawDots();
    drawPacman();
    drawGhosts();
    drawScore();
    updatePacman();
    updateGhosts();
    checkCollision();
  }
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
