const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas dynamically based on window size
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth, 600);  // Max width 600px for desktop
  canvas.height = Math.min(window.innerHeight, 600);  // Max height 600px for desktop

  // Recalculate tile size based on canvas size
  const tileSize = Math.floor(canvas.width / 20);
  const rows = Math.floor(canvas.height / tileSize);
  const cols = Math.floor(canvas.width / tileSize);

  return { tileSize, rows, cols };
}

let { tileSize, rows, cols } = resizeCanvas();

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

// Maze and dot initialization
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

// Functions to draw maze, dots, Pac-Man, ghosts, etc., remain the same

// Handle keyboard input for desktop
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    pacman.dx = 0;
    pacman.dy = -1;
  } else if (e.key === "ArrowDown") {
    pacman.dx = 0;
    pacman.dy = 1;
  } else if (e.key === "ArrowLeft") {
    pacman.dx = -1;
    pacman.dy = 0;
  } else if (e.key === "ArrowRight") {
    pacman.dx = 1;
    pacman.dy = 0;
  }
});

// Resize canvas on window resize
window.addEventListener("resize", () => {
  ({ tileSize, rows, cols } = resizeCanvas());
  initializeMaze();
});

// Touch input handling for mobile devices
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

// Game loop for rendering
let frameCount = 0;
function gameLoop() {
  frameCount++;
  if (frameCount % 2 === 0) { // Skip every other frame to improve performance
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
