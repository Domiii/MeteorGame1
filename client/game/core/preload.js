'use strict';

defineGlobal('GameStatus.preload', function() {
  game.load.image('background','/assets/test/debug-grid-1920x1920.png');
  game.load.image('octacat','/assets/sprites/octacat.png');

  game.load.image('rectangle','/assets/sprites/rectangle.png');
  game.load.image('disk','/assets/sprites/disk.png');
  game.load.image('triangle-up','/assets/sprites/triangle-up.png');
  
  game.load.image('speed','/assets/sprites/speed.png');
  game.load.image('brain','/assets/sprites/brain.png');

  game.load.image('bullet1','/assets/misc/bullet1.png');
});