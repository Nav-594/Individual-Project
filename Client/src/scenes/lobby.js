export class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }
    preload(){
        //this.load.html('username', './helpers/form.html');
        //this.load.html('roomname', './helpers/form.html');
        this.load.html('username', 'usernamefield.html');
        this.load.html('roomname', 'roomnamefield.html');
        this.load.html('createButton', 'createbutton.html');
        this.load.html('roundMenu', 'maxrounds.html');
        this.load.html('playersMenu', 'maxplayers.html');
        
    }
    create() {
        let totPlayer = 0;
        let totRound = 0;
        let currentScene = 'Lobby';

        var welcomeText = this.add.text(100,50,'Create A Room',{fill:'#000'});
        console.log("Lobby Screne!");

        //Username + Room Name text fields
        var usernameInput = this.add.dom(200,100).createFromCache('username').setOrigin(0.5);
        var usernameText = usernameInput.getChildByName('username');

        var roomnameInput = this.add.dom(200,150).createFromCache('roomname').setOrigin(0.5);
        var roomnameText = roomnameInput.getChildByName('roomname');
        //Create Button
        this.createButton = this.add.dom(200,450).createFromCache('createButton').setOrigin(0.5);
        this.createButton.addListener('click');
        this.createButton.on('click', function(){
            if(usernameText.value !=='' && roomnameText.value !==''&& totPlayer !== 0 && totRound !== 0 ){
                /*
                const data = {
                    'nickname': usernameText.value,
                    'name': roomnameText.value,
                    'occupancy': totPlayers,
                    'maxRounds': totRounds,
                }
                */
                this.scene.start('Draw', {
                    'nickname': usernameText.value,
                    'name': roomnameText.value,
                    'occupancy': totPlayer,
                    'maxRounds': totRound,
                    'previousScene': currentScene,
                });
            }else {
                console.log('Data not Filled');
            }
        }, this);

        //Max rounds Dropbown
        var roundText = this.add.text(100,350,'Please Select Max Rounds',{fill:'#000'});
        var roundsMenu = this.add.dom(200,310).createFromCache('roundMenu').setOrigin(0.5);
        roundsMenu.addListener('click');
        roundsMenu.on('click', function(event) {
            switch(event.target.id){ 
                case '2':
                    roundText.setText('Max Rounds Set to 2');
                    totRound = 2;
                    break;
                case '5':
                    roundText.setText('Max Rounds Set to 5');
                    totRound = 5;
                    break;
                case '10':
                    roundText.setText('Max Rounds Set to 10');
                    totRound = 10;
                    break;
            }

        });

        //Max Players DropDown
        var playersText = this.add.text(100,250,'Please Select Max Players',{fill:'#000'});
        var playersMenu = this.add.dom(200,210).createFromCache('playersMenu').setOrigin(0.5);
        playersMenu.addListener('click');
        playersMenu.on('click', function(event) {
            switch(event.target.id){
                case '2':
                    playersText.setText('Max Players Set to 2');
                    totPlayer = 2;
                    break;
                case '3':
                    playersText.setText('Max Players Set to 3');
                    totPlayer = 3;
                    break;
                case '4':
                    playersText.setText('Max Players Set to 4');
                    totPlayer = 4;
                    break;
                case '5':
                    playersText.setText('Max Players Set to 5');
                    totPlayer = 5;
                    break;
                case '6':
                    playersText.setText('Max Players Set to 6');
                    totPlayer = 6;
                    break;
                case '7':
                    playersText.setText('Max Players Set to 7');
                    totPlayer = 7;
                   break;
                case '8':
                    playersText.setText('Max Players Set to 8');
                    totPlayer = 8;
                    break;
            }

        });
    }
    update() {
    }


    makeRoom(){
        if(usernameText.value !=='' && roomnameText.value !==''&& totPlayer !== 0 && totRound !== 0 ){
            data = {
                'nickname': usernameText.value,
                'roomname': roomnameText.value,
                'rounds': totRound,
                'players': totPlayer,
            }
            this.movedrawScreen.bind(this)
        }else {
            console.log('Data not Filled');
        }
    }
}