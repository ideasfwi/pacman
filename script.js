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
let pacman = { x: 1, y: 1, dx: 0, dy: 0 };
let ghosts = [
  { x: 8, y: 8, dx: 1, dy: 0 },
  { x: 10, y: 10, dx: 0, dy: 1 },
];
let maze = [];
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

// Copy the maze for dots
let dots = [];
for (let r = 0; r < mazeTemplate.length; r++) {
  maze.push([...mazeTemplate[r]]);
  for (let c = 0; c < mazeTemplate[r].length; c++) {
    if (mazeTemplate[r][c] === 0) {
      dots.push({ x: c, y: r });
    }
  }
}

// Draw walls
function drawMaze() {
  ctx.fillStyle = "blue";
  maze.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 1) {
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
      }
    });
  });
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

// Draw ghosts
function drawGhosts() {
  ctx.fillStyle = "red";
  ghosts.forEach((ghost) => {
    ctx.fillRect(ghost.x * tileSize, ghost.y * tileSize, tileSize, tileSize);
  });
}

// Update ghosts' positions
function updateGhosts() {
  ghosts.forEach((ghost) => {
    let directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];
    let move = directions[Math.floor(Math.random() * directions.length)];
    let newX = ghost.x + move.dx;
    let newY = ghost.y + move.dy;

    // Check for walls
    if (maze[newY][newX] === 0) {
      ghost.x = newX;
      ghost.y = newY;
    }
  });
}

// Update Pac-Man
function updatePacman() {
  let newX = pacman.x + pacman.dx;
  let newY = pacman.y + pacman.dy;

  // Check for walls
  if (maze[newY][newX] === 0) {
    pacman.x = newX;
    pacman.y = newY;
  }

  // Eat dots
  dots = dots.filter((dot) => {
    if (dot.x === pacman.x && dot.y === pacman.y) {
      score += 10;
      return false;
    }
    return true;
  });

  // Check for level completion
  if (dots.length === 0) {
    level++;
    pacman = { x: 1, y: 1, dx: 0, dy: 0 };
    dots = [];
    mazeTemplate.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) dots.push({ x: c, y: r });
      })
    );
  }
}

// Check for collision with ghosts
function checkCollision() {
  ghosts.forEach((ghost) => {
    if (ghost.x === pacman.x && ghost.y === pacman.y) {
      alert(`Game Over! Final Score: ${score}`);
      location.reload();
    }
  });
}

// Draw the score and level
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
  ctx.fillText(`Level: ${level}`, canvas.width - 80, canvas.height - 10);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawDots();
  drawPacman();
  drawGhosts();
  drawScore();
  updatePacman();
  updateGhosts();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
