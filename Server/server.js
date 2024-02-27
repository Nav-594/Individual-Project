const express = require('express');
var http = require('http');
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const mongoose = require('mongoose');
//console.log(mongoose.connection.readyState);

const Room = require('./models/Room');
const getWord = require('./api/getWord');

var io = require('socket.io')(server);

//middleware
app.use(express.json());

//connect to Mongodb
const DB = 'mongodb+srv://190114871:Aba3kart222@cluster0.0zi29.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(DB).then(() => {
    console.log('Connection Successful!')
}).catch((e) =>{
    console.log(e);
});

io.on('connection', (socket) => {
    console.log('connected');
    // CREATE GAME CALLBACK
    socket.on('create-game', async({nickname, name, occupancy, maxRounds}) => {
        try{
            const existingRoom = await Room.findOne({name});
            if(existingRoom){
                socket.emit('notCorrectGame', 'Room with this name already exists')
                return;
            }
            var room = new Room();
            const word = getWord();
            room.word = word;
            room.name = name;
            room.occupancy = occupancy;
            room.maxRounds = maxRounds;

            let player = {
                socketID: socket.id,
                nickname,
                isPartyLeader: true,
            }
            room.players.push(player);
            room = await room.save();
            socket.join(name);
            io.to(name).emit('updateRoom', room);
        }catch(err) {
            console.log(err);
        }
    });

    //JOIN GAME CALLBACK
    socket.on('join-game', async({nickname, name}) =>{
        try{
            var room = await Room.findOne({name});
            if(!room){
                socket.emit('notCorrectGame', 'Enter Valid Room Name');
                return;
            }
            if(room.isJoin){
                var player = {
                    socketID: socket.id,
                    nickname,
                }
                room.players.push(player);
                socket.join(name);
                if(room.players.length === room.occupancy){
                    room.isJoin = false;
                }
                room.turn = room.players[room.turnIndex]; // increment turnindex as new players join
                room = await room.save();
                io.to(name).emit('updateRoom', room)  //send message to all players in room 
            }else {
                socket.emit('notCorrectGame', 'The game is in progress, please try later');
            }
        } catch(err){
            console.log(err);
        }
    });

    // White Board Sockets
    socket.on('paint', ({details, roomName}) => {
        io.to(roomName).emit('points', {details: details});
    });

    // Chatbox
    socket.on('msg', async (data) => {
        //console.log(data);
        try{
            if(data.msg === data.word){
                let room = await Room.findOne({name: data.roomname});
                //room = await room.save();
                /*
                let userPlayer = room[0].players.filter(
                    (player) => player.nickname === data.username //Finding the player who guessed right
                )
                */
                console.log(data.correctUserGuess+=1);
                room = await room.save();
                io.to(data.roomName).emit('msg', {
                    username: data.username,
                    msg: 'Guessed it!',
                    correctUserGuess: data.correctUserGuess + 1,
                    
                });
            }else {
                io.to(data.roomname).emit('msg', {
                    username: data.username,
                    msg: data.msg,
                    correctUserGuess: data.correctUserGuess,
                })
            }
            
        }catch(err) {
            console.log(err);
        }
    });

    socket.on('change-turn', async(name) => {
        //increment turnIndex from DB
        try{
            let room = await Room.findOne({name});
            let turnIndexs = room.turnIndex;
            if(turnIndexs+1 === room.players.length){
                room.currentRound+=1; //increment currentRound DB
            }
            if(room.currentRound <= room.maxRounds){
                const word = getWord(); //get word from API
                room.word = word;
                room.turnIndex = (turnIndexs+1) % room.players.length; //
                room.turn = room.players[room.turnIndex]; //grab player from array and create new object turn index
                room = await room.save(); //save room
                io.to(name).emit('change-turn', room); //tell room to change turn
                console.log(turnIndex);
                console.log(room.word);
            } else { // else show leaderboard
             }
        }catch(err){
            console.log(err);
        }
    });
    

    /*
    socket.on('disconnect', async() => {
        try {
            let room = await Room.findOne({"players.socketID": socket.id});
            for(let i=0; i< room.players.length; i++) {
                if(room.players[i].socketID === socket.id) {
                    room.players.splice(i, 1);
                    break;
                }
            }
            room = await room.save();
            if(room.players.length != 1) {
                socket.broadcast.to(room.name).emit('user-disconnected', room);
            }
        } catch(err) {
            console.log(err);
        }
    })
    */
    
});

server.listen(port, '0.0.0.0', ()=> {
    console.log('Server started and running on port ' + port);
});
