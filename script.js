const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables de jeu
let gameOver = false;
let gameStarted = false;
let score = 0;
let baseSpeed, boostSpeed, currentSpeed;
let dirX = 1, dirY = 0;
let body, segments, thickness, size, food;

// --- INITIALISATION ---
function launchGame(vBase, vBoost) {
    baseSpeed = vBase;
    boostSpeed = vBoost;
    currentSpeed = vBase;
    
    body = { x: canvas.width / 2, y: canvas.height / 2 };
    segments = [];
    for (let i = 0; i < 25; i++) {
        segments.push({ x: body.x, y: body.y });
    }
    
    thickness = 6;
    size = 1;
    score = 0;
    dirX = 1; 
    dirY = 0;
    gameOver = false;
    
    spawnFood();
    menu.style.display = "none";
    gameStarted = true;
    animate(); 
}

// --- LIENS BOUTONS ---
document.getElementById("btn-lent").onclick = () => launchGame(1.4, 4.5);
document.getElementById("btn-moyen").onclick = () => launchGame(2.8, 7.0);
document.getElementById("btn-expert").onclick = () => launchGame(4.5, 11.0);

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width - 150) + 75),
        y: Math.floor(Math.random() * (canvas.height - 150) + 75),
        size: 10
    };
}

// --- CONTRÔLES ---
document.addEventListener("keydown", (e) => {
    if (!gameStarted || gameOver) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();

    const key = e.key;

    if (key === "ArrowLeft" || key === "q" || key === "Q") {
        if (dirX === -1) currentSpeed = boostSpeed;
        else if (dirX === 0) { dirX = -1; dirY = 0; currentSpeed = baseSpeed; }
    } 
    else if (key === "ArrowRight" || key === "d" || key === "D") {
        if (dirX === 1) currentSpeed = boostSpeed;
        else if (dirX === 0) { dirX = 1; dirY = 0; currentSpeed = baseSpeed; }
    } 
    else if (key === "ArrowUp" || key === "z" || key === "Z") {
        if (dirY === -1) currentSpeed = boostSpeed;
        else if (dirY === 0) { dirX = 0; dirY = -1; currentSpeed = baseSpeed; }
    } 
    else if (key === "ArrowDown" || key === "s" || key === "S") {
        if (dirY === 1) currentSpeed = boostSpeed;
        else if (dirY === 0) { dirX = 0; dirY = 1; currentSpeed = baseSpeed; }
    }
});

document.addEventListener("keyup", () => {
    currentSpeed = baseSpeed;
});

// --- BOUCLE D'ANIMATION ---
function animate() {
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#4ade80";
        ctx.textAlign = "center";
        ctx.font = "bold 40px Arial";
        ctx.fillText("SCORE FINAL : " + score, canvas.width/2, canvas.height/2);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("F5 pour changer de niveau", canvas.width/2, canvas.height/2 + 60);
        return; 
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    body.x += dirX * currentSpeed;
    body.y += dirY * currentSpeed;

    for (let i = segments.length - 1; i > 0; i--) {
        segments[i].x = segments[i - 1].x;
        segments[i].y = segments[i - 1].y;
    }
    segments[0].x = body.x;
    segments[0].y = body.y;

    if (food) {
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        ctx.fillStyle = "#facc15";
        ctx.fill();

        if (Math.hypot(food.x - body.x, food.y - body.y) < 20 * size) {
            score++;
            size += 0.05;
            thickness += 0.15;
            for(let i=0; i<3; i++) segments.push({x: segments[segments.length-1].x, y: segments[segments.length-1].y});
            food = null;
            setTimeout(spawnFood, 400);
        }
    }

    for (let i = segments.length - 1; i >= 0; i--) {
        ctx.beginPath();
        let currentT = thickness * (1 - i / (segments.length * 1.5));
        ctx.arc(segments[i].x, segments[i].y, currentT, 0, Math.PI * 2);
        ctx.fillStyle = "#16a34a";
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(body.x, body.y, 8 * size, 0, Math.PI * 2);
    ctx.fillStyle = "#4ade80";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Score: " + score, 30, 50);

    if (body.x < 0 || body.x > canvas.width || body.y < 0 || body.y > canvas.height) gameOver = true;

    requestAnimationFrame(animate);
}