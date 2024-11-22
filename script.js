const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 400;
canvas.height = 400;

// Constants
const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

// Game variables
let pacman = { x: 1, y: 1, dx: 1, dy: 0 };
let dots = [];

// Initialize dots
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    if (row === 1 && col === 1) continue; // Avoid starting position
    dots.push({ x: col, y: row });
  }
}

// Draw Pac-Man
function drawPacman() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    pacman.x * tileSize + tileSize / 2,
    pacman.y * tileSize + tileSize / 2,
    tileSize / 2 - 2,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
  ctx.fill();
}

// Draw dots
function drawDots() {
  ctx.fillStyle = "white";
  dots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(
      dot.x * tileSize + tileSize / 2,
      dot.y * tileSize + tileSize / 2,
      4,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
}

// Update game state
function update() {
  pacman.x += pacman.dx;
  pacman.y += pacman.dy;

  // Wrap around the edges
  if (pacman.x < 0) pacman.x = cols - 1;
  if (pacman.y < 0) pacman.y = rows - 1;
  if (pacman.x >= cols) pacman.x = 0;
  if (pacman.y >= rows) pacman.y = 0;

  // Eat dots
  dots = dots.filter((dot) => dot.x !== pacman.x || dot.y !== pacman.y);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
  drawPacman();
}

// Handle keyboard input
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

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
