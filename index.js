// Pop Up Chat V1.0 by Gianni HUYNH - Server-side Script
// port var save port of the server & host save address of the server & onlineUsers for count users connected
let port;
let host;
let onlineUsers = 0;
let version = "1.0";


// Node.JS Input setup with readline
const readline = require('readline');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function called for generate random port
function randomPort() {
    return Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
}

// Function called for getting current time in format "hour:minutes:seconds"
function getDate(){
    const now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return hour + ":" + minutes + ":" + seconds;
}

// Function called for getting current time in format "day:month/hour:minutes:seconds"
function getFullDate(){
    const now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return day + "/" + month + " | " + hour + ":" + minutes + ":" + seconds;
}

// Setup of PopUp Chat
console.log("=========================================================================================================");
console.log("=                                         POP UP CHAT " + version + " SETUP                                         =");
console.log("=  Created by Gianni HUYNH - GitHub : https://github.com/GianniHuynh/PopUpChat - Twitter : @GianniHynh  =");
console.log("=========================================================================================================");

rl.question('Please enter port you want (Press enter for random generating) :  ', function (choosePort) {

    if (choosePort === ""){
        port = randomPort();
        choosePort = port;
    }

    else {
        port = choosePort;
    }


    rl.question('Then, please enter address you want (Press enter for localhost) : ', function (chooseAddr) {

        if (chooseAddr === ""){
            host = "localhost";
            chooseAddr = "localhost";

        }

        else {
            host = chooseAddr;

        }


        console.log(`Perfect ! PopUp chat is ready, use "http://${chooseAddr}:${choosePort}" in a web Browser 🤖`);
        console.log("=========================================================================================================");




        app.use(express.static(__dirname + "/public"));



        io.on("connection", (socket, nbUsers, appPort) => {
            onlineUsers++;
            nbUsers = onlineUsers;
            console.log('\x1b[32m%s\x1b[0m',"User connected ! (" + nbUsers + " users)");
            appPort = host + ":" + port;
            io.emit("userUpdate", nbUsers);
            io.emit("sendAddress", appPort);

            socket.on("chat message", (pseudo, msg) => { // <-- Chat message sent event

                const fullDate = getDate();
                const consoleFullDate = getFullDate();


                if (pseudo === "") {
                    io.emit("chat message", fullDate + " - " + "Anonymous" + " : " + msg );
                    console.log(consoleFullDate + " - " + "Anonymous" + " : " + msg);
                } else {
                    io.emit("chat message", fullDate + " - " + pseudo + " : " + msg );
                    console.log(consoleFullDate + " - " + pseudo + " : " + msg);
                }
            });

            socket.on("disconnect", () => {
                nbUsers = nbUsers - 1;
                onlineUsers = onlineUsers - 1;
                io.emit("userUpdate", nbUsers);
                console.log('\x1b[31m%s\x1b[0m',"User disconnected ! (" + nbUsers + " users)");

            });
        });

        server.listen(port, () => {
            console.log('\x1b[36m%s\x1b[0m',"PopUp Chat V1.0 is listening on port " + port + " 🚀");
        });

        rl.close();
    });
});













