'use strict';

Global.render = function() {
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(GameState.me, 32, 500);
};