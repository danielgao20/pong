// get canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// paddle dimensions
const paddleWidth = 10;
const paddleHeight = 60;
const paddleSpeed = 10;

// ball dimensions
const ballSize = 10;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

// paddle positions
let paddleAY;
let paddleBY;

// score
let scoreA = 0;
let scoreB = 0;

// initialize game state
function resetGame() {
    // set initial paddle positions
    paddleAY = canvas.height / 2 - paddleHeight / 2;
    paddleBY = canvas.height / 2 - paddleHeight / 2;

    // set initial ball position and speed
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;

    scoreA = 0;
    scoreB = 0;
}

// function to reset ball position and speed
function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = -ballSpeedX; // Reverse ball's horizontal direction
    ballSpeedY = -ballSpeedY; // Reverse ball's vertical direction
}

// draw the game
function drawGame() {
    // paddles
    ctx.fillStyle = 'black';
    ctx.fillRect(5, paddleAY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth - 5, paddleBY, paddleWidth, paddleHeight);

    // ball
    ctx.fillStyle = 'gray';
    // ctx.fillRect(ballX, ballY, ballSize, ballSize);
    ctx.beginPath();
    ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();


    // score
    ctx.fillStyle = 'black';
    ctx.font = '20px Verdana';
    ctx.fillText(`Player A: ${scoreA}`, canvas.width / 2 - 200, 30);
    ctx.fillText(`Player B: ${scoreB}`, canvas.width / 2 + 90, 30);
}

// update game state
function updateGame() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the game
    drawGame();

    // update paddle A position
    if(upA && paddleAY > 0) {
        paddleAY -= paddleSpeed;
    }
    if(downA && paddleAY + paddleHeight < canvas.height) {
        paddleAY += paddleSpeed;
    }

    // update paddle B position
    if(upB && paddleBY > 0) {
        paddleBY -= paddleSpeed;
    }
    if(downB && paddleBY + paddleHeight < canvas.height) {
        paddleBY += paddleSpeed;
    }

    // update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // check collision with paddles
    if(ballX < paddleWidth && ballY > paddleAY && ballY < paddleAY + paddleHeight) {
        ballSpeedX = Math.abs(ballSpeedX);
    }
    if(ballX + ballSize > canvas.width - paddleWidth && ballY > paddleBY && ballY < paddleBY + paddleHeight) {
        ballSpeedX = -Math.abs(ballSpeedX);
    }
    // if(ballX < 0 && ballY > paddleAY && ballY < paddleAY + paddleHeight) {
    //     ballSpeedX = Math.abs(ballSpeedX);
    // }
    // if(ballX > canvas.width && ballY > paddleBY && ballY < paddleBY + paddleHeight) {
    //     ballSpeedX = -Math.abs(ballSpeedX);
    // }

    // check collision with walls
    if(ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    
    // check for game over
    if(ballX < 0 || ballX > canvas.width) {
        // increment score for the side that scored
        if(ballX < 0) {
            scoreB++;
        } else {
            scoreA++;
        }

        // pause the game for 1 second before resetting
        setTimeout(() => {
            resetBall();
            updateGame();
        }, 1000);
        return; // return early to prevent further game updates during the delay
    }

    // request next frame
    requestAnimationFrame(updateGame);
}

// add event listeners for paddle controls
let upA = false;
let downA = false;
let upB = false;
let downB = false;

window.addEventListener('keydown', (event) => {
    if(event.key === 'w') {
        upA = true;
    }
    if(event.key === 's') {
        downA = true
    }
    if(event.key === 'ArrowUp') {
        upB = true;
    }
    if(event.key === 'ArrowDown') {
        downB = true;
    }
});

window.addEventListener('keyup', (event) => {
    if(event.key === 'w') {
        upA = false;
    }
    if(event.key === 's') {
        downA = false;
    }
    if(event.key === 'ArrowUp') {
        upB = false;
    }
    if(event.key === 'ArrowDown') {
        downB = false;
    }
});

// handle restart button click
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', () => {
    resetGame();
});

// start the game
resetGame();
updateGame();
