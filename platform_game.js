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
    { x: 200, y: 0, width: 20, height: 20 },
    { x: 400, y: 0, width: 20, height: 20 },
    { x: 600, y: 0, width: 20, height: 20 }
];

const platforms = [
    { x: 0, y: 370, width: 800, height: 30 },
    { x: 150, y: 300, width: 100, height: 10 },
    { x: 350, y: 250, width: 100, height: 10 },
    { x: 550, y: 200, width: 100, height: 10 }
];

let score = 0;
const coinSound = new Audio('coin-sound.mp3');

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'brown';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function drawCoins() {
    ctx.fillStyle = 'gold';
    coins.forEach(coin => {
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
        let onPlatform = false;

        platforms.forEach(platform => {
            if (coin.x < platform.x + platform.width &&
                coin.x + coin.width > platform.x &&
                coin.y + coin.height <= platform.y &&
                coin.y + coin.height + 2 >= platform.y) {
                onPlatform = true;
            }
        });

        if (!onPlatform) {
            coin.y += 2; // Move coins downwards

            // Reset coin to top if it falls off the canvas
            if (coin.y > canvas.height) {
                coin.y = 0;
                coin.x = Math.random() * (canvas.width - coin.width);
            }
        }
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    let onPlatform = false;

    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height <= platform.y &&
            player.y + player.height + player.dy >= platform.y) {
            player.dy = 0;
            player.jumping = false;
            onPlatform = true;
        }
    });

    if (!onPlatform) {
        if (player.y + player.height < canvas.height) {
            player.dy += 1; // gravity
        } else {
            player.dy = 0;
            player.jumping = false;
        }
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
            coinSound.play();
        }
    });
}

function update() {
    clear();
    drawPlayer();
    drawCoins();
    drawPlatforms();
    drawScore();
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
