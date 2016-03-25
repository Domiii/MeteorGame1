/**
 * This component is only added to the locally playing player.
 */

'use strict';

dependsOnSymbols('PhaserExtensions', function() {
    PhaserExtensions.defineComponent('CurrentPlayer', {
      update: function() {
        var cursors = Game.cursors;

        this.gameObject.body.setZeroVelocity();

        if (cursors.up.isDown)
        {
            this.gameObject.body.moveUp(300)
        }
        else if (cursors.down.isDown)
        {
            this.gameObject.body.moveDown(300);
        }

        if (cursors.left.isDown)
        {
            this.gameObject.body.velocity.x = -300;
        }
        else if (cursors.right.isDown)
        {
            this.gameObject.body.moveRight(300);
        }
      }
    });
});