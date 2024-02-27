import io from 'socket.io-client';

export class Draw extends Phaser.Scene {
    constructor() {
        super('Draw');
    }
    preload(){
        this.isDrawing = false;
        this.names = null;
        this.load.html('inputMessage', 'chatbox.html');
        this.load.html('form', 'form.html');
        this.globRoomData = {}
    }

    create(data) {
        this.names = data.name;
        var dataOfRoom = {};    
        let points = new Phaser.Structs.List();
        let chatMessages = new Phaser.Structs.List();
        var correctUserGuess = 0;
        var playerArr = [];
        var joinArr = [];
        var messages = new Phaser.Structs.List();

        //Create Timer Tween
        /*
        this.timer = this.add.text(300,10, '0', {fill:'#000'});
        this.timerTween = this.tweens.addCounter({
            from: 60,
            to: 0,
            duration: 60000,
            paused: true,
        }); 
        */

        const textInput = this.add.dom(685,575).createFromCache('form').setOrigin(0.5);
        let chatbox = textInput.getChildByName('chat');
        this.playersData;

        var chat = this.add.text(570,440, '',{
            lineSpacing: 15,
            backgroundColor: '#21313CDD',
            color: '#26924F',
            padding: 10,
            fontStyle: 'bold'
        });
        chat.setFixedSize(225,540);
        
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        //console.log(dataOfRoom['word']);
        this.enterKey.on('down', event => {
            if(chatbox.value != ''){
                //Socket for chatbox
                console.log(correctUserGuess);
                this.socket.emit('msg', {
                    'username': data.nickname,
                    'msg': chatbox.value,
                    'word': dataOfRoom['word'],
                    'roomname': dataOfRoom['name'],
                    'correctUserGuess': correctUserGuess,
                });
                console.log(dataOfRoom['word']);
            }
            chatbox.value = '';
            //chat.setText(chatMessages);
            //console.log(chatMessages);
        })



        // -> How to Start tween timer
        /*
        this.input.once('pointerdown', () => {
            this.timerTween.resume();
        });
        */



        //Socket Connection
        this.socket = io('http://192.168.0.83:3000', {
            'transports': ['websocket'],
            'autoConnect': false
        });
        this.socket.connect();       

        //Check if previous room was Create
        if(data.previousScene == 'Lobby'){
            this.socket.emit('create-game', data);
        }else {
            this.socket.emit('join-game', data);
        }
        
        //Listen to Socket
        this.socket.on('connect', ()=>{
            console.log('Socket Connected');
            this.socket.on('updateRoom', (roomData)=>{
                console.log('Joined Room ' + data.name);

                dataOfRoom = roomData;

                this.globRoomData = dataOfRoom['isJoin'];
                //console.log(this.globRoomData);

                playerArr = dataOfRoom.players.length-1;
                joinArr = dataOfRoom.players.isJoin;
                //this.playerArr.push(this.dataOfRoom['players'].length-1);
                //console.log(this.dataOfRoom['players']['isJoin']);
                //console.log(playerArr);
                //playerArr.push(this.dataOfRoom['players']['nickname']);
                //console.log('Total Players: ' + this.playerArr);
                //console.log(this.dataOfRoom['players'].length-1);
                //this.getPlayers = this.dataOfRoom['players'].length-1;
                //console.log(this)
                this.add.text(5,10,'Word Length is: ' + dataOfRoom['word'].length,{fill:'#000'});
                //console.log(dataOfRoom['word']);
                //console.log(dataOfRoom['isJoin']);
                //console.log(playerArr);
                //console.log(dataOfRoom.players.length-1);
            });
            //console.log(dataOfRoom['isJoin']);
            if(dataOfRoom['isJoin'] != true){
                //Start timer
                //console.log('This can Start');
                /*
                let enterKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
                enterKey1.on('down', event => {
                    this.startTween = this.timerTween.resume();
                });
                */
            }
            
            //console.log(this.playerArr);
            this.socket.on('msg', (msgData)=>{
                //messages.add(msgData);

                let arr = []
                arr.push(msgData['username']+ ':');
                arr.push(msgData['msg']);
                chat.setText(arr);
                console.log(arr);
                correctUserGuess = msgData['correctUserGuess'];
                if(this.currentUserGuess == playerArr){
                    this.socket.emit('change-turn', dataOfRoom['name']);
                }
                console.log(playerArr);
           });

           this.socket.on('notCorrectGame', (data)=> this.scene.start('Menu'));

           //Update correctUserGuess counter -1 as host will not be able to guess
           // If everyone has guessed right on user emit 
           // = dataOfRoom['players'].length-1
           if(correctUserGuess = playerArr['length']){
               this.socket.emit('change-turn', dataOfRoom['name']);
               console.log('Change - Player');
            }
           
           this.socket.on('change-turn', (data)=> {
               console.log('Change-Turn');
               let oldWord = dataOfRoom['word'];
               var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
               var showWord = this.add.text(500, 500, 'The word was'+ oldWord, style);
               var timeline = this.tweens.timeline({
                targets: showWord,
                totalDuration: 2500,
                tweens: [
                    {
                        alpha:0,
                    }
                ]
            });
               dataOfRoom = data;
               this.add.text(5,10,'Word Length is: ' + data['word'].length,{fill:'#000'});
               correctUserGuess = 0;
               this.graphics.clear();

               // tween for old word
           });

           this.socket.on('points', (point)=>{
            //console.log('Point Received');
            if(point['details'] !== null){
                points.add(point['details']);
                points.each(point => {
                    let newPath = new Phaser.Curves.Path();
                    newPath.fromJSON(point);
                    newPath.draw(this.graphics);
                });
            }
           });

           /*
           this.socket.on('user-disconnected', (data)=>{
               console.log(data.nickname +' disconnected');
           });
           */

        });
    
       //Drawing
       this.graphics = this.add.graphics();
       this.graphics.lineStyle(4, 0x000);
    }
    update() {
        //Timer Tween
        /*
        this.timer.setText([
            'Timer: ' + this.timerTween.getValue()
        ]);
        */
        
       /*
       if(this.globRoomData != true){
           this.timerTween.resume();
       }
       */
      /*
       this.timer.setText([
           'Timer: ' + this.timerTween.getValue()
       ]);
       */
        
        //Drawing
        if(!this.input.activePointer.isDown && this.isDrawing){
            this.isDrawing = false;     
            this.socket.emit('paint', {
                'details': this.path.toJSON(),
                'roomName': this.names,
            });

        }
        else if(this.input.activePointer.isDown){
            if(!this.isDrawing){
                this.path = new Phaser.Curves.Path(
                    this.input.activePointer.position.x-2,
                    this.input.activePointer.position.y-2);
                this.isDrawing = true;
            }
            else{
                this.path.lineTo(
                    this.input.activePointer.position.x-2,
                    this.input.activePointer.position.y-2)
            }
            this.path.draw(this.graphics);
            this.drawSaved = this.path.toJSON();
        }

    }

}











