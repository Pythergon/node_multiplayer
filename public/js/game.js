const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");

// const socket = io();

keypress = {}
window.addEventListener("keydown", (event) => {
    keypress[event.key] = true;
});
window.addEventListener("keyup", (event) => {
    keypress[event.key] = false;
});

class Game {
    constructor() {
        this.players = []
    }

    update() {
        for (const player of this.players) {
            player.update() 
        }
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const player of this.players) {
            player.draw()
        }
    }
}

class Player {
    constructor(game, x , y) {
        game.players.push(this)
        this.x = x
        this.y = y

        this.x_vel = 0
        this.y_vel = 0
    }

    update() {
        // if (keypress['s']) {
        //     this.y_vel = -1;
        // } else if (keypress['w']) {
        //     this.y_vel = 1;
        // } else {
        //     this.y_vel = 0;
        // }

        // if (keypress['a']) {
        //     this.x_vel = -1;
        // } else if (keypress['d']) {
        //     this.x_vel = 1;
        // } else {
        //     this.x_vel = 0;
        // }

        socket.emit('keystate', keypress);

    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 100, 100);
    }
}

var myGame = new Game()
var myPlayer = new Player(myGame, 50, 50);

function gameloop() {
    myGame.update()
    myGame.render()
    requestAnimationFrame(gameloop)
}

requestAnimationFrame(gameloop)

