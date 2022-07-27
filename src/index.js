const express = require("express");
const http = require('http');
const path = require("path");
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryFile = path.join(__dirname, "../public");

// Setup static directory to server
app.use(express.static(publicDirectoryFile));

io.on('connection', (socket) => {
  debugger;
  console.log("New web socket connection");

  socket.on('join', ({ username, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return cb(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
    debugger;
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
      usersCount: user.usersCount
    })

    cb();
  })

  socket.on('sendMessage', (message, cb) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed");
    }
    io.to(user.room).emit('message', generateMessage(user.username, message));
    cb();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
        usersCount: user.usersCount
      })
    }
  })

  socket.on('sendLocation', (coords, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`, coords.latitude, coords.longitude));
    cb('Shared');
  });
})

server.listen(port, () => {
  console.log("Server is up on " + port);
});