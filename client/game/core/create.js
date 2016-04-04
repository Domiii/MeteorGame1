'use strict';

function configureGlobals() {
  // set object defaults
  PhaserExtensions.Prefabs.overrideDefaults({
    body: {
      collideWorldBounds: true,
      immovable: true,
      fixedRotation: true
    }
  });


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
        components: [
          'CircleShape',
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
  var character = GameStatus.currentPlayerCharacter = group.instantiatePrefab({
    sprite: 'octacat',
    scale: {x: 0.4, y: 0.4}
  });

  // TODO: Get or create player object
  character.addComponent('PlayerCharacter', { player: null });
  character.addComponent('CurrentPlayerCharacter', { speed: 300 });
  character.addComponent('Shooter', {
    bulletsGroup: GameStatus.groups.bullets,
    shootDelay: 0.8
  });
  
  game.camera.follow(character);
}

function createNPCs() {
  var group = GameStatus.groups.units;

  GameStatus.npcs = [
    group.instantiatePrefab({
      x: 200, y: 0,
      sprite: 'octacat',
      scale: {x: 0.2, y: 0.2},
      components: [
        'Unit'
      ]
    })
  ];
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

  // create NPCs
  createNPCs();

  // input configuration
  GameStatus.cursors = game.input.keyboard.createCursorKeys();

  // wrap things up by getting the physics engine ready
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.updateBoundsCollisionGroup();
});