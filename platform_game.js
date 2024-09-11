const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false
};

const coins = [
    { x: 200, y: 350, width: 20, height: 20 },
    { x: 400, y: 350, width: 20, height: 20 },
    { x: 600, y: 350, width: 20, height: 20 }
];

let score = 0;

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawCoins() {
    ctx.fillStyle = 'gold';
    coins.forEach(coin => {
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.y + player.height < canvas.height) {
        player.dy += 1; // gravity
    } else {
        player.dy = 0;
        player.jumping = false;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function collectCoins() {
    coins.forEach((coin, index) => {
        if (player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            coins.splice(index, 1);
            score += 10;
        }
    });
}

function update() {
    clear();
    drawPlayer();
    drawCoins();
    newPos();
    collectCoins();
    requestAnimationFrame(update);
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function jump() {
    if (!player.jumping) {
        player.dy = -15;
        player.jumping = true;
    }
}

function keyDown(e) {
    if (e.key === 'ArrowRight') {
        moveRight();
    } else if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowUp') {
        jump();
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
