'use strict';

/**
 * OwnedByPlayer component indicates ownership of object by some player (whereas users own players).
 */
PhaserExtensions.defineComponent('OwnedByPlayer', {
  setOwner: function(playerOrId) {
    this.ownerId = playerOrId && isNaN(playerOrId) && playerOrId._id || playerOrId;
  },

  getOwnerId: function() {
    return this.ownerId;
  },

  getOwner: function() {
    return Meteor.players.findOne(this.ownerId);
  }
}, {
  
});
