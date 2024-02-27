export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
    preload(){
        this.load.html('createButton', 'createbutton.html');
        this.load.html('joinButton', 'joinbutton.html');
    }

    create() {
        this.welcomeText = this.add.text(50,50,'Create or Join a room to play Artivia',{fill:'#000'});

        //Create Button
        this.createButton = this.add.dom(100,150).createFromCache('createButton').setOrigin(0.5);
        this.createButton.addListener('click');
        this.createButton.on('click',this.lobbyScreen.bind(this)); // This is normal one
        //this.createButton.on('click', this.drawScreen.bind(this));

        //Join Button
        this.joinButton = this.add.dom(250,150).createFromCache('joinButton').setOrigin(0.5);
        this.joinButton.addListener('click');
        this.joinButton.on('click',this.joinScreen.bind(this));

        /*
        this.createButton = this.add.text(100,100,'Create',{fill:'#000'})
                            .setInteractive()
                            .on('pointerover',()=> this.createButton.setStyle({fill:'#0f0'}))
                            .on('pointerout',()=> this.createButton.setStyle({fill:'#000'}))
                            .on('pointerdown',this.lobbyScreen.bind(this))
        this.joinButton = this.add.text(200,100,'Join',{fill:'#000'})
                            .setInteractive()
                            .on('pointerover',()=> this.joinButton.setStyle({fill:'#0f0'}))
                            .on('pointerout',()=> this.joinButton.setStyle({fill:'#000'}))
                            .on('pointerdown',this.joinScreen.bind(this))
        */
        
        
    }

    update() {}

    lobbyScreen(){
        this.scene.start('Lobby');
    }

    joinScreen(){
        this.scene.start('Join');
    }
}