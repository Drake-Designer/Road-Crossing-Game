// Global variables
let background;
let player;
let dragon;
let treasure;

// Title Scene
let titleScene = new Phaser.Scene('Title');
titleScene.preload = function () {
  this.load.image('titlebackground', 'assets/title-background.png');
};

titleScene.create = function () {
  let backgr = this.add.sprite(0, 0, 'titlebackground');
  backgr.setOrigin(0, 0);

  let text = this.add.text(100, 100, 'Welcome to my Game\n(Tap or Click to Start!)', {
    fontSize: '32px',
    fill: '#fff',
    stroke: '#000',
    strokeThickness: 4,
  });

  this.input.on(
    'pointerup',
    function () {
      this.scene.start('Game');
    },
    this
  );
};

// Win Scene
let winScene = new Phaser.Scene('Win');

winScene.create = function () {
  this.cameras.main.setBackgroundColor('#222');

  const message = 'You win!\n(Tap or Click to Restart)';
  const { width, height } = this.sys.game.config;

  let text = this.add.text(width / 2, height / 2, message, {
    fontFamily: 'monospace',
    fontSize: '32px',
    fill: '#fff',
    stroke: '#000',
    strokeThickness: 5,
    align: 'center',
    wordWrap: { width: width - 60 },
  });
  text.setOrigin(0.5, 0.5);

  // Restart on click/tap
  this.input.on(
    'pointerup',
    function () {
      this.scene.start('Game');
    },
    this
  );
};

// Game Scene
let gameScene = new Phaser.Scene('Game');

// Initiate
gameScene.init = function () {
  // Player speed
  this.playerSpeed = 1;
  // Enemy speed
  this.dragonMinSpeed = 0.2;
  this.dragonMaxSpeed = 2;
  // Boundaries
  this.dragonMinY = 80;
  this.dragonMaxY = 280;
  this.isTerminating = false;
  this.playerMoving = false;
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
  this.isTerminating = false;

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
      dragon.flipX = true;
      let dir = Math.random() < 0.5 ? 1 : -1;
      let speed = this.dragonMinSpeed + Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed);
      dragon.speed = dir * speed;
    },
    this
  );

  // Treasure
  treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  treasure.setScale(0.6);

  // Disabling click out of the phaser window
  this.input.on(
    'pointerdown',
    function () {
      this.playerMoving = true;
    },
    this
  );

  this.input.on(
    'pointerup',
    function () {
      this.playerMoving = false;
    },
    this
  );

  this.input.on(
    'pointerout',
    function () {
      this.playerMoving = false;
    },
    this
  );
};

// Update
gameScene.update = function () {
  if (this.isTerminating) return;

  if (this.playerMoving) {
    player.x += this.playerSpeed;
  }

  // Treasure overlap check
  let playerRect = player.getBounds();
  let treasureRect = treasure.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    this.isTerminating = true;
    this.cameras.main.fade(500);

    this.cameras.main.once(
      'camerafadeoutcomplete',
      function () {
        this.scene.start('Win');
      },
      this
    );
    return;
  }

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

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, dragonRect)) {
      this.gameOver();
      return;
    }
  }
};

gameScene.gameOver = function () {
  this.isTerminating = true;

  this.cameras.main.shake(500);

  this.cameras.main.once(
    'camerashakecomplete',
    function () {
      this.cameras.main.fade(500);
    },
    this
  );

  this.cameras.main.once(
    'camerafadeoutcomplete',
    function () {
      this.scene.restart();
    },
    this
  );
};

// Set the configuration of the game
let config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 360,
  },
  scene: [titleScene, gameScene, winScene],
};

// Create a new game and pass the configuration
let game = new Phaser.Game(config);
