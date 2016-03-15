'use strict';

Global.update = function() {
  var me = GameState.me;
  var cursors = GameState.cursors;


  me.body.setZeroVelocity();

  if (cursors.up.isDown)
  {
      me.body.moveUp(300)
  }
  else if (cursors.down.isDown)
  {
      me.body.moveDown(300);
  }

  if (cursors.left.isDown)
  {
      me.body.velocity.x = -300;
  }
  else if (cursors.right.isDown)
  {
      me.body.moveRight(300);
  }
};