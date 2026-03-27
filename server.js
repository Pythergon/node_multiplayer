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

io.on('connection', (socket) => {
    /*
    socket.on('keystate', (data) => {
        console.log(data);
    })
    console.log('user A connected')
    */

    // Set-up player based on socket iD
    players[socket.id] = {
        x: 300,
        x_vel: 0,
        y: 200,
        y_vel: 0,
        keys: { a: false, d: false, w: false, s: false }
    }

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

    // Logic and Response
    setInterval(() => {
       for (const id in players) {
        const player = players[id];

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

        player.x += player.x_vel
        player.y -= player.y_vel
    } 

    io.emit('state_update', players);
    }, 33);

});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000")
});

