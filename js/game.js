// Global variables
let background;
let player;
let dragon;
let treasure;

// Create a new scene
let gameScene = new Phaser.Scene('Game');

// Initiate
gameScene.init = function () {
  // Player speed
  this.playerSpeed = 1;

  // Enemy speed
  this.dragonMinSpeed = 1;
  this.dragonMaxSpeed = 4;

  // Boundaries
  this.dragonMinY = 80;
  this.dragonMaxY = 280;
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
  // Game background
  background = this.add.image(0, 0, 'background');
  background.setOrigin(0, 0);

  // Player
  player = this.add.sprite(70, 180, 'player');
  player.setScale(0.6);

  // Enemy (dragon)
  dragon = this.add.sprite(250, 180, 'dragon');
  dragon.flipX = true;
  dragon.setScale(0.6);

  // Treasure
  treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  treasure.setScale(0.6);

  // Set enemy speed
  let dir = Math.random() < 0.5 ? 1 : -1;
  let speed = this.dragonMinSpeed + Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed);
  dragon.speed = dir * speed;
};

// Update
gameScene.update = function () {
  // Move the player
  if (this.input.activePointer.isDown) {
    player.x += this.playerSpeed;
  }

  // Treasure collection
  let playerRect = player.getBounds();
  let treasureRect = treasure.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    this.scene.restart(); // Restart scene if player reaches the treasure
  }

  // Enemy (dragon) movement
  dragon.y += dragon.speed;

  // Check dragon boundaries
  let conditionGoingUp = dragon.speed < 0 && dragon.y <= this.dragonMinY;
  let conditionGoingDown = dragon.speed > 0 && dragon.y >= this.dragonMaxY;

  if (conditionGoingUp || conditionGoingDown) {
    dragon.speed *= -1;
  }
};

// Utility function (not used here but left as is)
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
