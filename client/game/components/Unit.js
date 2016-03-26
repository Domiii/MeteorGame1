'use strict';

PhaserExtensions.defineComponent('Unit', {
  init: function() {
    this.game.physics.p2.enable(this.gameObject);

    var body = this.gameObject.body;


    // all units have P2 physics and cannot be moved by physics interactions
    body.collideWorldBounds = true;
    body.immovable = true;
    body.fixedRotation = true;

    // add default collision shape
    body.setCircle(this.gameObject.width / 2);
  },
  
  update: function() {
    //console.log('Unit update');
  }
});