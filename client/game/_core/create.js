'use strict';

var createMe = function() {
  var world = game.world;
  world.classType = PhaserExtensions.GameObject;
  
  Game.currentPlayer = world.create(0, 0, 'player');

  game.physics.p2.enable(Game.currentPlayer);
  game.camera.follow(Game.currentPlayer);
};

Game.create = function() {
  var cfg = Game.GameConfig;

  // for some reason, canvas display style is set to block in code...
  var canvas = game.canvas;
  canvas.style.display = "inline-block";

  var backgroundSize = 1920;
  var backgroundRadius = backgroundSize/2;

  // configure world
  game.add.tileSprite(-backgroundRadius, -backgroundRadius, backgroundSize, backgroundSize, 'background');
  game.world.setBounds(-cfg.worldRadius, -cfg.worldRadius, cfg.worldSize, cfg.worldSize);
  game.physics.startSystem(Phaser.Physics.P2JS);

  // create currentPlayer
  createMe();


  Game.cursors = game.input.keyboard.createCursorKeys();
};