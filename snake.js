const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const appleBite = document.getElementById('appleBite');
const loseMusic = document.getElementById('loseMusic');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const resumeButton = document.getElementById('resumeButton'); 


appleBite.onerror = () => console.error('Apple bite sound not found or could not be loaded.');
loseMusic.onerror = () => console.error('Game over sound not found or could not be loaded.');


const boxSize = 20;
const canvasSizeX = Math.floor(canvas.width / boxSize);
const canvasSizeY = Math.floor(canvas.height / boxSize);

// Snake
let snake = [];
snake[0] = { x: Math.floor(canvasSizeX / 2) * boxSize, y: Math.floor(canvasSizeY / 2) * boxSize };


let food = {
    x: Math.floor(Math.random() * canvasSizeX) * boxSize,
    y: Math.floor(Math.random() * canvasSizeY) * boxSize
};


let score = 0;
let game; 
let gameOver = false; 
let isPaused = false; 


let direction = 'RIGHT';
document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode == 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode == 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode == 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode == 40 && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.keyCode == 32) { // Spacebar for pause/resume
        if (gameOver || !game) return; // Only pause/resume if the game is already started
        togglePause();
    }
}


function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function pauseGame() {
    clearInterval(game); 
    isPaused = true; 
    resumeButton.style.display = 'block'; 
}

function resumeGame() {
    game = setInterval(draw, 100); 
    isPaused = false; 
    resumeButton.style.display = 'none'; 
}


function checkCollision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }
    return false;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'lime' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Move the snake head
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= boxSize;
    if (direction === 'UP') snakeY -= boxSize;
    if (direction === 'RIGHT') snakeX += boxSize;
    if (direction === 'DOWN') snakeY += boxSize;

    // New head position
    let newHead = { x: snakeX, y: snakeY };

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        appleBite.play().catch(error => console.error('Error playing apple bite sound:', error)); 
        food = {
            x: Math.floor(Math.random() * canvasSizeX) * boxSize,
            y: Math.floor(Math.random() * canvasSizeY) * boxSize
        };
    } else {
        snake.pop(); // Remove tail if no food is eaten
    }

   
    if (checkCollision(newHead, snake)) {
        clearInterval(game); 
        loseMusic.play().catch(error => console.error('Error playing game over sound:', error)); 
        gameOver = true;
        displayGameOver(); 
        return;
    }

    // Add new head
    snake.unshift(newHead);

    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText("Score: " + score, 100, 30);
}


function displayGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
    
   
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2);

    
    restartButton.style.display = 'block';
    centerButtonBelowMessage(restartButton); 
}
    

function centerButtonBelowMessage(button) {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    
    button.style.left = `${canvasRect.left + canvasRect.width / 2 - buttonRect.width / 2}px`;
    button.style.top = `${canvasRect.top + canvasRect.height / 2 + 50}px`; 
}


function centerButton(button) {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    button.style.left = `${canvasRect.left + canvasRect.width / 2 - buttonRect.width / 2}px`;
    button.style.top = `${canvasRect.top + canvasRect.height / 2 - 150}px`; 
}

// Start the game on button click
startButton.addEventListener('click', function() {
    startButton.style.display = 'none'; 
    restartButton.style.display = 'none'; 
    resumeButton.style.display = 'none'; 
    gameOver = false; 
    score = 0; 
    snake = [{ x: Math.floor(canvasSizeX / 2) * boxSize, y: Math.floor(canvasSizeY / 2) * boxSize }]; 
    food = {
        x: Math.floor(Math.random() * canvasSizeX) * boxSize,
        y: Math.floor(Math.random() * canvasSizeY) * boxSize
    }; // Reposition food
    direction = 'RIGHT'; // Reset direction
    game = setInterval(draw, 100); 
});

restartButton.addEventListener('click', function() {
    restartButton.style.display = 'none'; 
    resumeButton.style.display = 'none'; 
    gameOver = false; 
    score = 0; 
    snake = [{ x: Math.floor(canvasSizeX / 2) * boxSize, y: Math.floor(canvasSizeY / 2) * boxSize }]; 
    food = {
        x: Math.floor(Math.random() * canvasSizeX) * boxSize,
        y: Math.floor(Math.random() * canvasSizeY) * boxSize
    }; // Reposition food
    direction = 'RIGHT'; 
    game = setInterval(draw, 100); // Start the game loop
});


resumeButton.addEventListener('click', resumeGame);


window.onload = function() {
    startButton.style.display = 'block'; 
    centerButton(startButton);
    
 
    centerButton(resumeButton);
    resumeButton.style.display = 'none'; 
};


function centerResumeButton() {
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRect = resumeButton.getBoundingClientRect();
    
  
    resumeButton.style.left = `${canvasRect.left + canvasRect.width / 2 - buttonRect.width / 2}px`;
    resumeButton.style.top = `${canvasRect.top + canvasRect.height / 2 - buttonRect.height / 2}px`; 
}
