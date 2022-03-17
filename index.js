
const express = require('express')
const app = express()
const port = 7500;
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + '/public'));

var onlineUsers = 0;

io.on("connection", (socket, nbUsers) => {
  onlineUsers++;
  nbUsers = onlineUsers;
  console.log("New user connected ! (" + nbUsers + " users)");

  io.emit(nbUsers);
  

  socket.on("chat message", (pseudo, msg) => {
    var now = new Date();
    var fullDate;
    var jour = now.getDate();
    var mois = now.getMonth() + 1;
    var heure = now.getHours();
    var minute = now.getMinutes();
    var secondes = now.getSeconds();
    var annee = now.getFullYear();

    if (mois < 10) {
      mois = "0" + mois;
    }

    if (heure < 10) {
      heure = "0" + heure;
    }

    if (minute < 10) {
      minute = "0" + minute;
    }

    if (secondes < 10){
        secondes = "0" + secondes;
    }

    var fullDate = heure + ":" + minute + ":" + secondes;

    if (pseudo == "") {
      io.emit(
        "chat message",
        fullDate + " - " + "Anonymous" + " : " + msg
      );
      console.log(
        fullDate + " - " + "Anonymous" + " : " + msg
      );
    } else {
      io.emit(
        "chat message",
        fullDate + " - " + pseudo + " : " + msg
      );
      console.log(
        fullDate + " - " + pseudo + " : " + msg
      );
    }
  });
});

server.listen(port, () => {
  console.log("listening on port " + port);
});
