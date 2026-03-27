const express = require('express')
const path = require('path');
const { Server } = require("socket.io");
const { createServer } = require("node:http")

const app = express()
const server = createServer(app)
const io = new Server(server)

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    console.log('Here')
    res.render('canvas')
    // res.render('home')
});

const players = {};
const bullets = [];

io.on('connection', (socket) => {
    // Set-up player based on socket iD
    players[socket.id] = {
        x: 300,
        x_vel: 0,
        y: 200,
        y_vel: 0,
        name: 'User',
        keys: { a: false, d: false, w: false, s: false }
    }

    socket.on('name_change', (name) => {
        if (players[socket.id]) {
            players[socket.id].name = name;
        }
    });

    // Collect player data
    socket.on('keystate', (clientKeyState) => {
        if (players[socket.id]) {
            players[socket.id].keys = clientKeyState;
        }
    });

    // disconnect
    socket.on('disconnect', () => {
        delete players[socket.id];
    });
});

// Logic and Response
setInterval(() => {
    for (const id in players) {
        const player = players[id];

        if (player.keys.ArrowRight) {
            const newBullet = {
                x: player.x + 25,
                y: player.y + 25,
                x_vel: 1
            }
            bullets.push(newBullet)
        }

        // Vertical movement
        if (player.keys.w) {
            player.y_vel = 1;
        } else if (player.keys.s) {
            player.y_vel = -1;
        } else {
            player.y_vel = 0;
        }

        // Horizontal movement
        if (player.keys.a) {
            player.x_vel = -1;
        } else if (player.keys.d) {
            player.x_vel = 1;
        } else {
            player.x_vel = 0;
        }

        for (const bullet of bullets) {
            bullet.x += bullet.x_vel
        }

        player.x += player.x_vel
        player.y -= player.y_vel
    }

    io.emit('state_update', { players, bullets });
}, 15);


server.listen(3000, '0.0.0.0', () => {
    console.log("server running at http://localhost:3000")
});

