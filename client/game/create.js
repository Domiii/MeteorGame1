'use strict';

Global.GameState = {
  me: null
};

Global.create = function() {
  // for some reason, canvas display style is set to block in code...
  var canvas = game.canvas;
  canvas.style.display = "inline-block";



  var backgroundSize = 1920;
  var backgroundRadius = backgroundSize/2;
  // 
  game.add.tileSprite(-backgroundRadius, -backgroundRadius, backgroundSize, backgroundSize, 'background');

  game.world.setBounds(-GameConfig.worldRadius, -GameConfig.worldRadius, GameConfig.worldSize, GameConfig.worldSize);

  game.physics.startSystem(Phaser.Physics.P2JS);

  GameState.me = game.add.sprite(0, 0, 'player');

  game.physics.p2.enable(GameState.me);

  game.camera.follow(GameState.me);


  GameState.cursors = game.input.keyboard.createCursorKeys();
};