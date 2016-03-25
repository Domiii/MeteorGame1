'use strict';

dependsOnSymbols('PhaserExtensions', function() {
  PhaserExtensions.defineComponent('Unit', {
    update: function() {
      console.log('Unit update');
    }
  });
});