const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas based on window size
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth, 600); // Max width 600px for desktop
  canvas.height = Math.min(window.innerHeight, 600); // Max height 600px for desktop

  // Recalculate tile size based on canvas size
  tileSize = Math.floor(canvas.width / 20);
  rows = Math.floor(canvas.height / tileSize);
  cols = Math.floor(canvas.width / tileSize);
}

resizeCanvas(); // Initialize canvas size

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

// Maze layout: 1 for walls, 0 for paths
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

// Drawing functions (maze, Pac-Man, dots, ghosts, score) remain unchanged

// Handle keyboard input (desktop)
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

// Handle touch input (mobile)
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

// Resize canvas on window resize
window.addEventListener("resize", () => {
  resizeCanvas();
  initializeMaze();
});

// Main game loop
let frameCount = 0;
function gameLoop() {
  frameCount++;
  if (frameCount % 2 === 0) { // Skip every other frame for performance
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

gameLoop();
