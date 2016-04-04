'use strict';

/**
 * Wraps a p2.Box shape.
 * See: https://github.com/schteppe/p2.js/blob/master/src/shapes/Box.js
 */
PhaserExtensions.defineComponent('BoxShape', {
  start: function() {
    var world = this.gameObject.world;
    var body = this.gameObject.body;

    var w = this.getWidth();
    var h = this.getHeight();

    var shape = this.shape = this.shape || 
      new p2.Box({ width: world.pxm(w), height: world.pxm(h) });

    body.addShape(shape, this.offsetX, this.offsetY, this.rotation);
  },

  getWidth: function() {
    return this.width || this.gameObject.width;
  },

  getHeight: function() {
    return this.height || this.gameObject.height;
  },

  setSize: function(w, h) {
    this.width = w;
    this.height = h;
    this.udpateShape();
  },

  unsetSize: function() {
    this.setSize(undefined, undefined);
  },

  udpateShape: function() {
    this.shape.width = this.getWidth();
    this.shape.height = this.getHeight();
    this.shape.updateBoundingRadius();
    this.shape.updateArea();
  },
});