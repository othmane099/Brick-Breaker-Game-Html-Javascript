const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 500;


const keys = [];

const raquette = {
    x: 100,
    y: canvas.height - 5,
    color: 'red',
    width: 100,
    height: 5,
    speed: 9,
    moving: false
}

const imgWidth = 75;
const imgHeight = 20;
const imgPadding = 10;
const imgMarginTop = 50;
const imgMarginLeft = 25;
const imgRowCount = 5;
const imgColumnCount = 9;

var score = 0;

var apples = [];
for (var i = 0; i < imgColumnCount; i++) {
    apples[i] = [];
    for (var j = 0; j < imgRowCount; j++) {
        apples[i][j] = { x: 0, y: 0, status: 1 };
    }
}

function Circle() {

    var initValues = [-2,-1,1,2];
    this.dx = initValues[Math.round(Math.random()*2)];
    this.dy = Math.random()*2;
    this.x = canvas.width/2;
    this.y = 300;
    this.radius = 10

    var red = Math.random() * 255,
        green = Math.random() * 255,
        blue = Math.random() * 255;


    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fill();
    }

    this.update = function () {

        // Rebon avec les mures
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
            this.dx = -this.dx;

        // Rebon avec le plafond
        if (this.y - this.radius < 0)
            this.dy = -this.dy;

        // Rattraper la ball avec le cote gauche de la raquette
        if (this.y + this.radius >= raquette.y && this.y + this.radius < raquette.y + raquette.height &&
            Math.abs(this.x) + this.radius >= raquette.x && Math.abs(this.x) + this.radius < raquette.x + raquette.width / 2) {
            this.dy = -this.dy;
            (this.dx > 0) ? this.dx = -this.dx : this.dx = this.dx;
        }

        // Rattraper la ball avec le cote groit de la raquette
        if (this.y + this.radius >= raquette.y && this.y + this.radius < raquette.y + raquette.height &&
            Math.abs(this.x) + this.radius > raquette.x + raquette.width / 2 && Math.abs(this.x) + this.radius <= raquette.x + raquette.width) {
            this.dy = -this.dy;
            (this.dx < 0) ? this.dx = -this.dx : this.dx = this.dx
        }

        // Si la ball depasse la raquette
        if (this.y > canvas.height) {
            this.dx = this.dy = 0;
            console.log('Game Over !!')
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}


var circle = new Circle()


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circle.update();
    createRaquette();
    moveRaquette();

    drawApples();
    collisionDetection();
    drawScoreText();

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

function drawApples() {
    for (var i = 0; i < imgColumnCount; i++) {
        for (var j = 0; j < imgRowCount; j++) {
            if (apples[i][j].status == 1) {
                var imgX = (i * (imgWidth + imgPadding)) + imgMarginLeft;
                var imgY = (j * (imgHeight + imgPadding)) + imgMarginTop;
                apples[i][j].x = imgX;
                apples[i][j].y = imgY;

                var img = new Image();
                img.src = 'apple.png';
                ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            }
        }
    }
}

function collisionDetection() {
    for (var i = 0; i < imgColumnCount; i++) {
        for (var j = 0; j < imgRowCount; j++) {
            var apple = apples[i][j];
            if (apple.status == 1) {
                if (circle.x > apple.x && circle.x < apple.x + imgWidth && circle.y > apple.y && circle.y < apple.y + imgHeight) {
                    circle.dy = -circle.dy;
                    score++;
                    apple.status = 0;
                }
            }
        }
    }
}

function drawScoreText(){
    ctx.font = "16px Fantasy";
    ctx.fillStyle = "red";
    ctx.fillText("Score: "+score, 8, 20);
}

window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true;
    raquette.moving = true;
});

window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = false;
    raquette.moving = false;
});