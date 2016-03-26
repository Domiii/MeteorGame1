'use strict';

defineGlobal('GameStatus.render', function() {
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(GameStatus.currentPlayerCharacter, 32, 500);
});