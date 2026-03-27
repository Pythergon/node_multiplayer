const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");

const VIRTUAL_WIDTH = 1000;
let s = 1; // Default scale

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    s = canvas.width / VIRTUAL_WIDTH; // Update the scale factor
}

window.addEventListener('resize', resize);
resize(); // Call it once at the start

keypress = {}
window.addEventListener("keydown", (event) => {
    keypress[event.key] = true;
});
window.addEventListener("keyup", (event) => {
    keypress[event.key] = false;
});

function gameloop() {
    socket.emit('keystate', keypress);
    requestAnimationFrame(gameloop)
}

requestAnimationFrame(gameloop)

function setUsername() {
    const input = document.getElementById('username')
    socket.emit('name_change', input.value)
}

socket.on('state_update', (data) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Wipe the board
    ctx.save();
    ctx.scale(s, s);

    for (const id in data.players) {
        const p = data.players[id];
        
        ctx.fillStyle = (id === socket.id) ? "blue" : "red"; // Make yourself blue!
        ctx.fillRect(p.x, p.y, 50, 50);
        ctx.font = "20px Arial";
        ctx.fillText(p.name, p.x, p.y)
    }

    ctx.fillStyle = 'yellow';
    data.bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, 10, 5);
    });

    ctx.restore();
});
