const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 500;


const keys = [];

const raquette = {
    x: 100,
    y: canvas.height-5,
    color: 'red',
    width: 100,
    height: 5,
    speed: 9,
    moving: false
}

function Circle(x, y, radius) {

    var dx = Math.random() * 2, dy = Math.random() * 2;
    this.x = x;
    this.y = y;

    var red = Math.random() * 255,
        green = Math.random() * 255,
        blue = Math.random() * 255;


    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fill();
    }

    this.update = function () {

        // Rebon avec les mures
        if (this.x + radius > canvas.width || this.x - radius < 0)
            dx = -dx;

        // Rebon avec le plafond
        if (this.y - radius < 0)
            dy = -dy;

        // Rattraper la ball avec le cote gauche de la raquette
        if (this.y + radius >= raquette.y && this.y + radius < raquette.y + raquette.height &&
            Math.abs(this.x) + radius >= raquette.x && Math.abs(this.x) + radius < raquette.x + raquette.width/2) {
            dy = -dy;
            (dx>0) ? dx = -dx : dx = dx;
        }

        // Rattraper la ball avec le cote groit de la raquette
        if (this.y + radius >= raquette.y && this.y + radius < raquette.y + raquette.height &&
            Math.abs(this.x) + radius > raquette.x + raquette.width/2 && Math.abs(this.x) + radius <= raquette.x + raquette.width) {
            dy = -dy;
            (dx<0) ? dx = -dx : dx = dx
        }

        // Si la ball depasse la raquette
        if (this.y > canvas.height) {
            dx = dy = 0;
            console.log('Game Over !!')
        }

        this.x += dx;
        this.y += dy;
        
        this.draw();
    }
}


var circle = new Circle(700, 300, 10)


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circle.update();
    createRaquette();
    moveRaquette();
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

window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true;
    raquette.moving = true;
});

window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = false;
    raquette.moving = false;
});