const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Handle chat history
    socket.on("chat", (chats) => {
        io.emit("chat", chats);
    });

    // Handle new messages
    socket.on('newMessage', (msg) => {
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3002, () => {
    console.log('server is running on port 3002');
});
