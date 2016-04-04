'use strict';

PhaserExtensions.defineComponent('RectangleShape', {
  init: function() {
    var body = this.gameObject.body;

    // add default collision shape
    body.setCircle(this.gameObject.width / 2);
  },
  
  update: function() {
    //console.log('Unit update');
  }
});