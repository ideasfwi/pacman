const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Initialize canvas size based on window size
function resizeCanvas() {
  // Set the canvas size to be at most 600px wide and 600px high
  canvas.width = Math.min(window.innerWidth, 600);
  canvas.height = Math.min(window.innerHeight, 600);

  // Recalculate tile size dynamically based on canvas size
  tileSize = Math.floor(canvas.width / 20);
  rows = Math.floor(canvas.height / tileSize);
  cols = Math.floor(canvas.width / tileSize);
}

resizeCanvas(); // Initialize the canvas size

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

// Initialize the maze and the dots
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

// Function to draw the maze (walls)
function drawMaze() {
  ctx.fillStyle = "blue";
  maze.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 1) {
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize); // Wall
      }
    });
  });
}

// Function to draw Pac-Man
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

// Function to draw the dots
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

// Function to draw ghosts (for now just blocks)
function drawGhosts() {
  ctx.fillStyle = "red";
  ghosts.forEach((ghost) => {
    ctx.fillRect(ghost.x * tileSize, ghost.y * tileSize, tileSize, tileSize);
  });
}

// Function to draw the score and level
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
  ctx.fillText(`Level: ${level}`, canvas.width - 80, canvas.height - 10);
}

// Update Pac-Man's position
function updatePacman() {
  let newX = pacman.x + pacman.dx;
  let newY = pacman.y + pacman.dy;

  // Check for walls and update position
  if (maze[newY] && maze[newY][newX] === 0) {
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

// Update ghost positions
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
    if (maze[newY] && maze[newY][newX] === 0) {
      ghost.x = newX;
      ghost.y = newY;
    }
  });
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

// Event listener for keyboard input (for desktop)
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
