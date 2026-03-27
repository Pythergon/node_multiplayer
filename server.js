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

io.on('connection', (socket) => {
    socket.on('keystate', (data) => {
        console.log(data);
    })
    console.log('user A connected')
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000")
});

