'use strict';

/**
 * Wraps a p2.Circle shape.
 * See: https://github.com/schteppe/p2.js/blob/master/src/shapes/Circle.js
 */
PhaserExtensions.defineComponent('CircleShape', {
  start: function() {
    var world = this.gameObject.world;
    var body = this.gameObject.body;
    var r = this.getRadius();

    var shape = this.shape = this.shape || 
      new p2.Circle({ radius: world.pxm(r) });
    body.addShape(shape, this.offsetX, this.offsetY, this.rotation);
  },

  getRadius: function() {
    return this.radius || this.gameObject.width/2;
  },

  setRadius: function(r) {
    this.radius = r;
    this.udpateShape();
  },

  unsetRadius: function() {
    this.setRadius(undefined);
  },

  udpateShape: function() {
    this.shape.radius = this.getRadius();
    this.shape.updateBoundingRadius();
    this.shape.updateArea();
  },
});