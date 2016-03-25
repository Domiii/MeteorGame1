'use strict';

Game.render = function() {
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(Game.currentPlayer, 32, 500);
};