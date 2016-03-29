'use strict';

/**
 * Shooter objects shoot bullets
 */
PhaserExtensions.defineComponent('Bullet', {
  init: function() {
    var body = this.gameObject.body;

    // make sure, the bullet is alive
    this.gameObject.revive();


    // TODO: Add collision handling - http://jsfiddle.net/bstevens/a6paycw6
    body.onBeginContact.add(this.onHit, this);
  },

  update: function() {
    
  },

  onHit: function(body1, body2, shape1, shape2, contactEquations) {
    
  }
});