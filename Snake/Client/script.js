let GRID_SIZE = 50;
let GRID_WIDTH;
let GRID_HEIGHT;
let fruit;
let snake;
let retroFont;
let hasLocalStorage;
let gameRunning = "name";
let gameBeginCount;
let score = {
    total: 0,
    current: 30,
    timer: undefined,
    reset: function () {
        this.current = 30;
        this.timer.restart();
    }
};
let highscore = 0;
let network;
let name = "";
let leaderboard;

function preload() {
    retroFont = loadFont('retro.ttf');
}

function setup()
{
    createCanvas(650, 550);
    GRID_WIDTH = width/GRID_SIZE;
    GRID_HEIGHT = (height-50)/GRID_SIZE;
    textFont(retroFont);
    network = new Network("https://micahwarsnake.herokuapp.com/");
    
    // initialises the score timer so that the score you obtain for collecting a fruit
    // decreases by 5, from 25, each second, down to a minimum of 5
    score.timer = new Counter(5000, 1000, () => {
        score.current -= 5;
    }, () => {
        score.current = 5;
    });
    gameRunning = "name";
}

function draw()
{
    // drawing of all the sprites and text on the screen.

    background(51);
    if (!(gameRunning == "name"))
    {
        rectMode(CORNER);
        fruit.show();
        snake.show();
    }
    
    if (gameRunning == true)
    {
        if (frameCount % 8 == 1) {
            snake.update();
        }
    } else if (gameRunning == "starting")
    {
        fill(255);
        textAlign(CENTER);
        textSize(45);
        text(gameBeginCount, width/2, height/2);
    } else if (gameRunning == "name")
    {
        rectMode(CENTER);
        textAlign(CENTER);
        textSize(25);
        text("Name: ", width/2+15, height/2-50);
        textSize(10);
        text("click anywhere to begin...", width/2, height/2+45)
        rect(width/2, height/2, 300, 50);
        stroke(51);
        fill(51);
        //textAlign(LEFT);
        textSize(25);
        text(name, width/2, height/2+6);
        
    } else
    {
        fill(255);
        textAlign(CENTER);
        textSize(45);
        text("HIGH SCORES", width/2, 130);
        textSize(25);
        if (leaderboard)
        {
            for (let i = 0; i < leaderboard.length; i ++)
            {
                textAlign(LEFT);
                text((i+1) + ":" + leaderboard[i][0], width/2-250-(textWidth("1")*floor(i/9)), 180+25*i);
                textAlign(RIGHT);
                text(leaderboard[i][1], width/2+250, 180+25*i)
            }
        }
        
    }
    stroke(255);
    fill(255);
    line(0, 500, width, 500);
    textSize(20);
    textAlign(LEFT);
    text("Score: " + score.total, 25, height-20);
    textAlign(RIGHT);
    text("Best: " + highscore, width-25, height-20)
    
}

function gameOver()
{
    network.submitScore(score.total, true);
    
    gameRunning = false;
    snake.speed = createVector(0, 0);
    snake.state = 1 - snake.state;
    fruit.state = 1 - fruit.state;
    if (score.total > highscore)
    {
        highscore = score.total;
    }
    
}

function onGameStart()
{
    gameRunning = true;
    gameBeginCount = "GO!";
    snake.state = 1 - snake.state;
    fruit.state = 1 - fruit.state;
    score.reset();
}

function beginGame()
{
    gameRunning = "starting";
    snake = new Snake(5, 5);
    fruit = new Fruit();
    
    score.total = 0;
    gameBeginCount = 3;
    
    // timer for the start of game countdown 

    let c = new Counter(1800, 600, () => {
        gameBeginCount --;
        console.log(gameBeginCount);
    }, onGameStart);
    c.start();
}

function mouseReleased()
{
    if (mouseButton === LEFT && !(gameRunning == "starting") && !(gameRunning == "name")) {
        beginGame();
    } else if (mouseButton === LEFT && gameRunning == "name" && name.length > 0)
    {
        network.submitScore();
        beginGame();
        
    }
}

function keyPressed() {
    if (!(gameRunning == "name") && !(snake.moveLocked))
    {
        switch (keyCode) {
            case LEFT_ARROW:
                snake.face(createVector(-1, 0));
                break;
            case RIGHT_ARROW:
                snake.face(createVector(1, 0));
                break;
            case DOWN_ARROW:
                snake.face(createVector(0, 1));
                break;
            case UP_ARROW:
                snake.face(createVector(0, -1));
                break;
        }
    } else if (gameRunning == "name")
    {
        // sanitises name input, even though the user can bluff the server
        // by sending their own custom name through score submition
        if (keyCode >= 65 && keyCode <= 90 && name.length < 8)
        {
            name += char(keyCode);
        } else if ((keyCode == LEFT_ARROW || keyCode == BACKSPACE) && name.length > 0)
        {
            name = name.substring(0, name.length-1);
        }
    }
}

// extension of Array.IndexOf method for vectors
Array.prototype.vectorIndexOf = function(e)
{
    for (let i = 0; i < this.length; i++)
    {
        if (this[i].equals(e))
        {
            return i;
        }
    }
}