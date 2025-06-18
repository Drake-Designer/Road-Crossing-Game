// Global variables

let background;
let player;
let dragon;
let treasure;

// Create a new scene

let gameScene = new Phaser.Scene('Game');

// Initiate
gameScene.init = function () {
  this.playerSpeed = 3;
};

// Preload
gameScene.preload = function () {
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

// Create

gameScene.create = function () {
  background = this.add.image(0, 0, 'background');
  background.setOrigin(0, 0);

  player = this.add.sprite(70, 180, 'player');

  dragon = this.add.sprite(250, 180, 'dragon');

  treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  treasure.setScale(0.6);
};

// Update

gameScene.update = function () {
  // Move the player
  if (this.input.activePointer.isDown) {
    player.x += this.playerSpeed;
  }

  // treasure collection
  let playerRect = player.getBounds();
  let treasureRect = treasure.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    this.scene.manager.bootScene(this);
  }
};

function grow(item) {
  if (item.scaleX < 2 && item.scaleY < 2) {
    item.setScale(item.scaleX + 0.001, item.scaleY + 0.001);
  }
}

// Set the configuration of the game

let config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scene: gameScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 360,
  },
};

// Create a new game and pass the configuration

let game = new Phaser.Game(config);
