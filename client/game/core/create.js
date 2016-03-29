'use strict';

function configureGlobals() {
  // set group defaults
  PhaserExtensions.GroupPrefabs.overrideDefaults({
    physicsBodyType: Phaser.Physics.P2JS,
    enableBody: true
  });

  // assign group defaults to world
  PhaserExtensions.GroupPrefabs.assignDefaultsTo(game.world);
}

function setupWorld() {
  // world setup
  var cfg = GameStatus.Config;

  game.add.tileSprite(-cfg.worldRadius, -cfg.worldRadius, cfg.worldSize, cfg.worldSize, 'background');
  game.world.setBounds(-cfg.worldRadius, -cfg.worldRadius, cfg.worldSize, cfg.worldSize);
  game.physics.startSystem(Phaser.Physics.P2JS);
}

function createGroups() {
  GameStatus.groups = {
    units: PhaserExtensions.GroupPrefabs.createGroup(game, {}),

    bullets1: PhaserExtensions.GroupPrefabs.createGroup(game, {
      objectPrefab: {
        sprite: 'bullet1',
        body: {
          shapes: 
        },
        components: [
          {
            name: 'Bullet',
            speed: 800
          }
        ]
      }
    })
  };
}


function createCurrentPlayerCharacter() {
  //var group = game.world;
  var group = GameStatus.groups.units;
  var character = GameStatus.currentPlayerCharacter = group.create(0, 0, 'octacat');

  // TODO: Get or create player object
  character.addComponent('PlayerCharacter', { player: null });
  character.addComponent('CurrentPlayerCharacter', { speed: 300 });
  character.addComponent('Shooter', {
    bulletsGroup: GameStatus.groups.bullets,
    bulletSpeed: 300,
    shootDelay: 1
  });
  
  game.camera.follow(character);
}

defineGlobal('GameStatus.create', function() {
  // for some reason, canvas display style is hardcoded to be `block` by Phaser...
  var canvas = game.canvas;
  canvas.style.display = "inline-block";

  // configure some globals
  configureGlobals();

  // configure world
  setupWorld();

  // create the groups that we are going to use
  createGroups();

  // create currentPlayerCharacter
  createCurrentPlayerCharacter();

  // input configuration
  GameStatus.cursors = game.input.keyboard.createCursorKeys();

  // wrap things up by getting the physics engine ready
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.updateBoundsCollisionGroup();
});