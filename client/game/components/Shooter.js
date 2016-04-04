'use strict';

/**
 * Shooter objects shoot bullets
 */
PhaserExtensions.defineComponent('Shooter', {
  init: function() {
    // if (this.bulletOverrides) {
    //   this.bulletsGroup.modifyObjectPrefab(this.bulletOverrides);
    // }
  },

  update: function() {
    
  },

  getOrCreateBullet: function() {
    var bullet;
    while (!(bullet = this.bulletsGroup.getFirstDead())) {
      // add a bullet (only one should be required)
      bullet = this.bulletsGroup.instantiate(0, 0);

      //game.physics.arcade.velocityFromRotation(this.gameObject.rotation, 400, bullet.body.velocity);
    }

    return bullet;
  },

  shootBulletInDirection: function(directionX, directionY) {
    var bullet = this.getOrCreateBullet();

    // go!
    bullet.body.velocity.x = velocityX;
    bullet.body.velocity.y = velocityY;
  }
},{
  defaultValues: {
    shootDelay: 0.5
  }
});