/**
 * All player characters have this component.
 * There is also a CurrentPlayerCharacter component for the locally playing player.
 */

PhaserExtensions.defineComponent('PlayerCharacter', {
  init: function() {
    var ownedByPlayer = this.getComponent('OwnedByPlayer');
    ownedByPlayer.setOwner(this.player);
  },

  update: function() {
    
  },


}, {
  // PlayerCharacter also is a Unit and it is owned by itself
  requiredComponents: ['Unit', 'OwnedByPlayer']
});