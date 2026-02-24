const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let gameStarted = false;
let score = 0;
let currentSpeed;
let dirX = 1, dirY = 0;
let body, segments, thickness;

function launchGame(speed) {
    currentSpeed = speed;
    body = { x: canvas.width / 2, y: canvas.height / 2 };
    segments = [];
    for (let i = 0; i < 20; i++) segments.push({ x: body.x, y: body.y });
    thickness = 8;
    score = 0;
    dirX = 1; dirY = 0;
    gameOver = false;
    spawnFood();
    menu.style.display = "none";
    document.getElementById("controls").style.display = "flex";
    gameStarted = true;
    animate(); 
}

document.getElementById("btn-lent").onclick = () => launchGame(2);
document.getElementById("btn-moyen").onclick = () => launchGame(4);
document.getElementById("btn-expert").onclick = () => launchGame(6);

let food = null;
function spawnFood() {
    food = {
        x: Math.random() * (canvas.width - 50) + 25,
        y: Math.random() * (canvas.height - 50) + 25
    };
}

function setDir(x, y) {
    if (!gameStarted || gameOver) return;
    if ((x !== 0 && dirX === 0) || (y !== 0 && dirY === 0)) {
        dirX = x; dirY = y;
    }
}

// Événements pour les boutons Android
document.getElementById("up").onclick = (e) => { e.preventDefault(); setDir(0, -1); };
document.getElementById("down").onclick = (e) => { e.preventDefault(); setDir(0, 1); };
document.getElementById("left").onclick = (e) => { e.preventDefault(); setDir(-1, 0); };
document.getElementById("right").onclick = (e) => { e.preventDefault(); setDir(1, 0); };

// Clavier PC
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "z") setDir(0, -1);
    if (e.key === "ArrowDown" || e.key === "s") setDir(0, 1);
    if (e.key === "ArrowLeft" || e.key === "q") setDir(-1, 0);
    if (e.key === "ArrowRight" || e.key === "d") setDir(1, 0);
});

function animate() {
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff69b4";
        ctx.textAlign = "center";
        ctx.font = "bold 25px Arial";
        // Message spécial demandé
        ctx.fillText("Bravo ton score est " + score, canvas.width/2, canvas.height/2);
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Appuyer pour recommencer", canvas.width/2, canvas.height/2 + 50);
        
        document.getElementById("controls").style.display = "none";
        canvas.onclick = () => location.reload(); 
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
        ctx.arc(food.x, food.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#ff1493";
        ctx.fill();
        if (Math.hypot(food.x - body.x, food.y - body.y) < 20) {
            score++;
            for(let i=0; i<5; i++) segments.push({x: segments[segments.length-1].x, y: segments[segments.length-1].y});
            spawnFood();
        }
    }

    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.arc(segments[i].x, segments[i].y, thickness * (1 - i/segments.length), 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#ff69b4" : "#da70d6";
        ctx.fill();
    }

    if (body.x < 0 || body.x > canvas.width || body.y < 0 || body.y > canvas.height) gameOver = true;
    requestAnimationFrame(animate);
}
