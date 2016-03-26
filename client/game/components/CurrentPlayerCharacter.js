/**
 * This component is only added to the locally playing player.
 */

'use strict';

PhaserExtensions.defineComponent('CurrentPlayerCharacter', {
  init: function() {
  },

  update: function() {
    if (this.controlLost) {
      // player cannot currently control this guy
      return;
    }


    var cursors = GameStatus.cursors;
    var speed = this.speed;

    this.gameObject.body.setZeroVelocity();

    if (cursors.up.isDown)
    {
        this.gameObject.body.velocity.y = -speed;
    }
    else if (cursors.down.isDown)
    {
        this.gameObject.body.velocity.y = speed;
    }

    if (cursors.left.isDown)
    {
        this.gameObject.body.velocity.x = -speed;
    }
    else if (cursors.right.isDown)
    {
        this.gameObject.body.velocity.x = speed;
    }

    
    if (game.input.keyboard.isDown(Phaser.Keyboard.PLUS) || 
        game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_ADD)) {
      this.speed += 30;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.MINUS) || 
        game.input.keyboard.isDown(Phaser.Keyboard.NUMPAD_SUBTRACT)) {
      this.speed -= 30;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.R)) {
      // reset GameObject
      this.gameObject.reset();
    }
  }
}, {
  // CurrentPlayerCharacter also is a PlayerCharacter
  requiredComponents: ['PlayerCharacter'],
  controlLost: false
});