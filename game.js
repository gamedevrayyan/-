const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ================= IMAGES =================
const playerImg = new Image();
playerImg.src = "assets/player1.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.jpg";

// ================= SOUNDS =================
const jumpSound = new Audio("assets/Recording.m4a");
const gameOverSound = new Audio("assets/titanic.mp3");

jumpSound.volume = 0.6;
gameOverSound.volume = 0.7;

// ================= GAME STATE =================
let gameRunning = true;

// ================= OVERLAY ELEMENTS =================
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const gamesound = document.getElementById('game-sound');

// ================= PLAYER =================
const player = {
  x: 50,
  y: 10,
  width: 60,
  height: 60,
  velocity: 0,
  gravity: 0.5,
  jump: -8,
};

// ================= OBSTACLES =================
let obstacles = [];
const obstacleWidth = 60;
const gap = 150;
let frame = 0;
let score = 0;

// ================= INPUT =================
function jump() {
  if (!gameRunning) return;
  player.velocity = player.jump;
  jumpSound.currentTime = 0;
  jumpSound.play();
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.addEventListener("click", jump);

// ✅ MOBILE TOUCH SUPPORT (ADDED)
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  jump();
}, { passive: false });

// ================= COLLISION =================
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ================= GAME OVER =================
function gameOver() {
  if (!gameRunning) return;

  gameRunning = false;
  gameOverSound.currentTime = 0;
  gameOverSound.play();
  gamesound.pause();

  finalScoreText.textContent = "Score: " + score;
  gameOverScreen.classList.remove("hidden");
}

// ================= RESTART =================
restartBtn.addEventListener("click", () => {
  location.reload();
});

// ================= GAME LOOP =================
function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  player.velocity += player.gravity;
  player.y += player.velocity;
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Create obstacles
  if (frame % 90 === 0) {
    const topHeight = Math.random() * 200 + 50;

    obstacles.push({
      x: canvas.width,
      y: topHeight - 400,
      width: obstacleWidth,
      height: 400,
      passed: false
    });

    obstacles.push({
      x: canvas.width,
      y: topHeight + gap,
      width: obstacleWidth,
      height: 400,
      passed: false
    });
  }

  // Obstacles update
  obstacles.forEach(ob => {
    ob.x -= 2;
    ctx.drawImage(obstacleImg, ob.x, ob.y, ob.width, ob.height);

    if (isColliding(player, ob)) {
      gameOver();
    }

    if (!ob.passed && ob.x + ob.width < player.x) {
      ob.passed = true;
      score++;
    }
  });

  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  // Ground / ceiling collision
  if (player.y + player.height > canvas.height || player.y < 0) {
    gameOver();
  }

  // Score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  frame++;
  requestAnimationFrame(update);
}

update();



