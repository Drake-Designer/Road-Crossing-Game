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
  this.dragonMinSpeed = 0.4;
  this.dragonMaxSpeed = 1.5;

  // Boundaries
  this.dragonMinY = 80;
  this.dragonMaxY = 280;

  this.isTerminating = false;
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
  player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
  player.setScale(0.5);

  // Enemy (dragons)
  this.dragons = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x: 90,
      y: 100,
      stepX: 80,
      stepY: 20,
    },
  });

  // Set scale for each dragon
  this.dragons.children.iterate(function (dragon) {
    dragon.setScale(0.4);
  });

  // Set flipX and speed
  Phaser.Actions.Call(
    this.dragons.getChildren(),
    function (dragon) {
      // Flip dragon
      dragon.flipX = true;

      // Set speed
      let dir = Math.random() < 0.5 ? 1 : -1;
      let speed = this.dragonMinSpeed + Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed);
      dragon.speed = dir * speed;
    },
    this
  );

  // Treasure
  treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  treasure.setScale(0.6);
};

// Update
gameScene.update = function () {
  if (this.isTerminating) return;

  // Move the player
  if (this.input.activePointer.isDown) {
    player.x += this.playerSpeed;
  }

  // Treasure overlap check
  let playerRect = player.getBounds();
  let treasureRect = treasure.getBounds();

  // Get enemies
  let dragons = this.dragons.getChildren();
  let numDragons = dragons.length;

  for (let i = 0; i < numDragons; i++) {
    // Enemy (dragon) movement
    dragons[i].y += dragons[i].speed;

    // Check dragon boundaries
    let conditionGoingUp = dragons[i].speed < 0 && dragons[i].y <= this.dragonMinY;
    let conditionGoingDown = dragons[i].speed > 0 && dragons[i].y >= this.dragonMaxY;

    if (conditionGoingUp || conditionGoingDown) {
      dragons[i].speed *= -1;
    }

    // Check dragon overlap
    let dragonRect = dragons[i].getBounds();

    // Restart scene
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, dragonRect)) {
      return this.gameOver();
    }
  }

  gameScene.gameOver = function () {
    this.isTerminating = true;

    // Shake camera
    this.cameras.main.shake(500);

    //End shaking camera, restart the game
    this.cameras.main.on(
      'camerashakecomplete',
      function (camera, effect) {
        // Fade out
        this.cameras.main.fade(500);
      },
      this
    );

    this.cameras.main.on(
      'camerafadeoutcomplete',
      function (camera, effect) {
        // Restart game
        this.scene.restart();
      },
      this
    );

    this.cameras.main.fade(500);
    return;
  };
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
