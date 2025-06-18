<<<<<<< HEAD
let background;
let player;
let dragon;
let treasure;

// Create a new scene
=======
>>>>>>> 5a84bd069f913caea69061891a0bc5d366e040df
let gameScene = new Phaser.Scene('Game');

gameScene.preload = function () {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

<<<<<<< HEAD
gameScene.create = function () {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  player = this.add.sprite(70, 180, 'player');
  dragon = this.add.sprite(250, 180, 'dragon');
  treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  treasure.setScale(0.6);
};

=======
>>>>>>> 5a84bd069f913caea69061891a0bc5d366e040df
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
};

let game = new Phaser.Game(config);
