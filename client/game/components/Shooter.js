'use strict';

/**
 * Shooter objects shoot bullets
 */
PhaserExtensions.defineComponent('Shooter', {
  init: function() {
  },

  update: function() {
    
  },

  getOrCreateBullet: function() {
    var bullet;
    while (!(bullet = this.bulletsGroup.getFirstDead())) {
      // add a bullet (only one should be required)
      bullet = this.bulletsGroup.create(0, 0, this.bulletSprite);
      bullet.addComponent('Bullet', {
        speed: this.bulletSpeed,
      });

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
});