import Phaser from 'phaser';
import {Menu} from './scenes/menu';
import {Lobby} from './scenes/lobby';
import {Join} from './scenes/join';
import {Draw} from './scenes/draw';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    backgroundColor: 0xecf0f1,
    scene: [Menu,Lobby,Join,Draw],
    dom: {
        createContainer: true
    },
};
const game = new Phaser.Game(config);
/*
window.addEventListener('resize', resizeApp);

  function resizeApp ()
  {
      // Width-height-ratio of game resolution
      // Replace 360 with your game width, and replace 640 with your game height
      let game_ratio = 800 / 600;
      
      // Make div full height of browser and keep the ratio of game resolution
      let div = document.getElementById('phaser-game');
      div.style.width = (window.innerHeight * game_ratio) + 'px';
      div.style.height = window.innerHeight + 'px';
      
      // Check if device DPI messes up the width-height-ratio
      let canvas = document.getElementsByTagName('canvas')[0];
      
      let dpi_w	= parseInt(div.style.width) / canvas.width;
      let dpi_h	= parseInt(div.style.height) / canvas.height;		
      
      let height = window.innerHeight * (dpi_w / dpi_h);
      let width	= height * game_ratio;
      
      // Scale canvas	
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
  }
  */
