const _ = require("lodash");
const express = require('express');
const app = express();
const port = 3000; // define your port
const server = app.listen(port, () => {
  console.log(`We are Listening on port ${port}...`);
});

const io = require('socket.io')(server, {
    path: "/pathToConnection"
});
let users = {};
io.on('connection', (socket) => {

  let userId = socket.handshake.query.userId; // GET USER ID
  
  // CHECK IS USER EXHIST 
  if (!users[userId]) users[userId] = [];
  
  // PUSH SOCKET ID FOR PARTICULAR USER ID
  users[userId].push(socket.id);
   
  // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
  io.sockets.emit("online", userId);
  console.log(userId, "Is Online!", socket.id);

  // DISCONNECT EVENT
  socket.on('disconnect', (reason) => {

    // REMOVE FROM SOCKET USERS
    _.remove(users[userId], (u) => u === socket.id);
    if (users[userId].length === 0) {
      // ISER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
      io.sockets.emit("offline", userId);
      // REMOVE OBJECT
      delete users[userId];
    }
   
    socket.disconnect(); // DISCONNECT SOCKET

    console.log(userId, "Is Offline!", socket.id);

  });

});