const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 500;


const keys = [];

const appleWidth = 75;
const appleHight = 20;
const padding = 10;
const marginTop = 50;
const marginLeft = 25;
const cols = 9;
let rows = 5;

let raquette = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 5,
    color: 'red',
    width: 100,
    height: 5,
    speed: 9,
    moving: false
}


let score = 0;
let difficulty = 1;
let choice = 0;
let win = false;

function Btn(x, y, width, height, name) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name


    this.handleOnClick = (level) => {

        switch (level) {
            case 0:
                choice = 1
                difficultyLevel(difficulty)
                break;
            case 1:
                difficultyLevel(level)
                break;

            case 2:
                difficultyLevel(level)
                break;

            case 3:
                difficultyLevel(level)
                break;
            case 4:
                choice = 0;
                score = 0;
                circle.reset();
                win = false;
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        apples[i][j].appearing = true;
                    }
                }
                raquette.x = (canvas.width / 2) - (raquette.width / 2)
                break;
        }
    }
}

function difficultyLevel(level) {
    switch (level) {
        case 1:
            // Easy
            handleDifficulty(2, 1, 2, 5, 85)
            break;

        case 2:
            // Medium
            handleDifficulty(3, 2, 3, 6, 75)
            break;

        case 3:
            // Hard
            handleDifficulty(5, 3, 4, 7, 65)
            break;
    }
}

function handleDifficulty(row, diff, speedCircle, speedRaquette, widthRaquette) {
    rows = row
    difficulty = diff
    circle.handleSpeed(speedCircle);
    raquette.speed = speedRaquette;
    raquette.width = widthRaquette;
}

let array_de_boutons = [
    new Btn(350, 300, 100, 50, 'Start'),
    new Btn(150, 200, 100, 50, 'Easy'),
    new Btn(350, 200, 100, 50, 'Medium'),
    new Btn(550, 200, 100, 50, 'Hard'),
    new Btn(350, 250, 100, 50, 'Over')
]

function Circle() {

    let initValues = [-2, 2];
    this.dx = initValues[Math.round(Math.random())];
    this.dy = 1;
    this.x = canvas.width / 2;
    this.y = 300;
    this.radius = 10

    let red = Math.random() * 255,
        green = Math.random() * 255,
        blue = Math.random() * 255;

    this.reset = () => {
        this.dx = initValues[Math.round(Math.random())];
        this.dy = 1;
        this.x = canvas.width / 2;
        this.y = 300;
    }

    this.handleSpeed = (s) => {
        let arr = [s, -s]
        this.dx = arr[Math.round(Math.random())];
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fill();
    }

    this.update = () => {

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
            this.dx = -this.dx;

        if (this.y - this.radius < 0)
            this.dy = -this.dy;

        if (this.y + this.radius >= raquette.y && this.y + this.radius < raquette.y + raquette.height &&
            this.x + this.radius >= raquette.x && this.x + this.radius < raquette.x + raquette.width / 2) {
            this.dy = -this.dy;
            (this.dx > 0) ? this.dx = -this.dx : this.dx = this.dx;
        }

        if (this.y + this.radius >= raquette.y && this.y + this.radius < raquette.y + raquette.height &&
            this.x + this.radius > raquette.x + raquette.width / 2 && this.x + this.radius <= raquette.x + raquette.width) {
            this.dy = -this.dy;
            (this.dx < 0) ? this.dx = -this.dx : this.dx = this.dx
        }

        if (this.y > canvas.height) {
            choice = 2;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }


}

let circle = new Circle()

function Apple(x, y) {
    this.img = new Image();
    this.img.src = 'apple.png';
    this.x = x;
    this.y = y;
    this.width = 75;
    this.height = 20;
    this.appearing = true;

    this.drawApple = () => {
        if (this.appearing) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    this.handleCollision = () => {
        if (this.appearing == true) {
            if (circle.x > this.x && circle.x < this.x + this.width && circle.y > this.y && circle.y < this.y + this.height) {
                circle.dy = -circle.dy;
                score++;
                this.appearing = false;
            }
        }
    }
}


let posX, posY;
let apples = [];
for (let i = 0; i < cols; i++) {
    apples[i] = [];
    for (let j = 0; j < rows; j++) {
        posX = (i * (appleWidth + padding)) + marginLeft;
        posY = (j * (appleHight + padding)) + marginTop;
        apples[i][j] = new Apple(posX, posY);
    }
}

function drawApples() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            apples[i][j].drawApple();
            apples[i][j].handleCollision();
        }
    }
}

function drawFirstFrame() {
    ctx.fillStyle = ("#808080");
    for (let i = 0; i < array_de_boutons.length; i++) {
        if (array_de_boutons[i].name != "Over")
            ctx.fillRect(
                array_de_boutons[i].x,
                array_de_boutons[i].y,
                array_de_boutons[i].width,
                array_de_boutons[i].height);
    }
}


function drawDifficultyText() {
    ctx.fillStyle = ("#000000");
    ctx.font = "16px Fantasy";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < array_de_boutons.length; i++) {
        if (array_de_boutons[i].name != "Over") ctx.fillText(array_de_boutons[i].name, array_de_boutons[i].x + 50, array_de_boutons[i].y + 25);
    }
    if (difficulty == 1) ctx.fillText("Difficulty: Easy", 400, 100);
    else if (difficulty == 2) ctx.fillText("Difficulty: Medium", 400, 100);
    else if (difficulty == 3) ctx.fillText("Difficulty: Hard", 400, 100);
}

function drawLastFrame() {
    ctx.fillStyle = ("#808080");
    ctx.fillRect(350, 250, 100, 50);
}

function drawEndStateText() {
    ctx.fillStyle = ("#000000");
    ctx.font = "16px Fantasy";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Reset", 350 + 50, 250 + 25);
    if (win) ctx.fillText("You Win !", 400, 100);
    else ctx.fillText("Game Over !", 400, 100);
    ctx.fillText("Score: " + score, 400, 200);

}

function checkScore() {
    if (difficulty == 1) {
        if (score == 18) {
            win = true;
            choice = 2;
        }
    }
    else if (difficulty == 2) {
        if (score == 27) {
            win = true;
            choice = 2;
        }
    }
    else if (difficulty == 3) {
        if (score >= 45) {
            win = true;
            choice = 2;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    if (choice == 0) {
        drawFirstFrame();
        drawDifficultyText();
    }
    else if (choice == 1) {
        circle.update();
        createRaquette();
        moveRaquette();
        drawApples();
        drawScoreText();
        checkScore();
    }
    else if (choice == 2) {
        drawLastFrame();
        drawEndStateText();
    }
}

animate();



function createRaquette() {
    ctx.fillStyle = raquette.color;
    ctx.fillRect(raquette.x, raquette.y, raquette.width, raquette.height);
}

function moveRaquette() {
    if (keys[37] && raquette.x > 0) {
        raquette.x -= raquette.speed;
    }

    if (keys[39] && raquette.x + raquette.width < canvas.width) {
        raquette.x += raquette.speed;
    }
}


function drawScoreText() {
    ctx.font = "16px Fantasy";
    ctx.fillStyle = "red";
    img = new Image();
    img.src = "apple.png";
    ctx.drawImage(img, 15, 8, 20, 20);
    ctx.fillText(score, 50, 20);
}

window.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
    raquette.moving = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
    raquette.moving = false;
});


window.addEventListener('click', (e) => {
    for (let i = 0; i < array_de_boutons.length; i++) {
        if (e.offsetX >= array_de_boutons[i].x && e.offsetX <= array_de_boutons[i].x + array_de_boutons[i].width &&
            e.offsetY >= array_de_boutons[i].y && e.offsetY <= array_de_boutons[i].y + array_de_boutons[i].height) {
            array_de_boutons[i].handleOnClick(i);
        }

    }

})