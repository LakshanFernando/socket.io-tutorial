let express = require('express');
let socket = require('socket.io');

let cors = require('cors');

let app = express();

app.use(cors(  ));

let server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

let io = socket(server,{cors: {origin: 'http://localhost:4200'}});

io.on('connection', (socket) => {
    console.log('socket connection made', socket.id);

    const msg = 'A new user has joined the chat' + socket.id;
    io.sockets.emit('notifications', msg);

    socket.on('message', (data) => {
        console.log(data);
        io.sockets.emit('message', data);
    });

    socket.on('notifications', (data) => {
        console.log(data);
        socket.broadcast.emit('notifications', data);
    });

    socket.on('room', (message, room) => {
        console.log(message, room);
        if(room === 'roomA'){
            socket.to(room).emit('room-A-received', message);
        }
        if(room === 'roomB'){
            socket.to(room).emit('room-B-received', message);
        }
    });

    socket.on('join-room', (room) => {
        console.log('joined room', room);
        socket.join(room);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        const msg = 'A user has left the chat' + socket.id;
        io.sockets.emit('notifications', msg);
        socket.disconnect();
    });
});
