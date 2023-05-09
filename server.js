const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handling deployment
// app.use(express.static('build'));
// app.use((req, res, next)=>{
//     res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })



const userSocketMap = {};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userName: userSocketMap[socketId]
        }
    });
}

io.on('connection', (socket) => {
    socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                userName: userName,
                socketId: socket.id
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
            code
        });
    });


    socket.on(ACTIONS.SYNC_CODE, ({code, socketId}) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
            code
        });
    });
    
    socket.on('disconnecting', ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                userName: userSocketMap[socket.id],
                socketId: socket.id
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {})