export class Join extends Phaser.Scene {
    constructor() {
        super('Join');
    }
    preload(){
        this.load.html('username', 'usernamefield.html');
        this.load.html('roomname', 'roomnamefield.html');
        this.load.html('joinButton', 'joinButton.html');
    }

    create() {
        let currentScene = 'Join';
        var welcomeText = this.add.text(100,50,'Join a Room',{fill:'#000'});

        var usernameInput = this.add.dom(200,100).createFromCache('username').setOrigin(0.5);
        var usernameText = usernameInput.getChildByName('username');

        var roomnameInput = this.add.dom(200,150).createFromCache('roomname').setOrigin(0.5);
        var roomnameText = roomnameInput.getChildByName('roomname');

        this.joinButton = this.add.dom(200,450).createFromCache('joinButton').setOrigin(0.5);
        this.joinButton.addListener('click');
        this.joinButton.on('click',function(){
            if(usernameText.value !=='' && roomnameText.value !==''){
                this.scene.start('Draw', {
                    'nickname': usernameText.value,
                    'name': roomnameText.value,
                    'previousScene': currentScene,
                });
            }else{
                console.log('Data not Filled');
            }
        }, this);
        /*
        this.drawScreen.bind(this)
        this.joinButton.on('click', function(event){
            if(event.target.name == 'joinButton'){
                var usernameText = usernameInput.getChildByName('username');
                if(usernameText.value !== ''){
                    this.removeListener('click');
                    //welcomeText.setText('Welcome ' + usernameText.value);
                }
            }
        });
        */
        
    }
    update() {}

    drawScreen(){
        this.scene.start('Draw');
    }

    
}