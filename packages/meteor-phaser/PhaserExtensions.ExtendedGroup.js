(function(Global) {
  'use strict';

  /**
   * @param {Object} [groupPrefab]
   * @param {Object} [groupPrefab.game]
   * @param {Object} [groupPrefab.parent]
   * @param {String} [groupPrefab.name]
   * @param {String} [groupPrefab.classType]
   * @param {Boolean} [groupPrefab.addToStage]
   * @param {Boolean} [groupPrefab.enableBody]
   * @param {PhysicsBodyType} [groupPrefab.physicsBodyType]
   * @param {PhysicsBodyType} [groupPrefab.classType]
   * @param {Object} [groupPrefab.objectPrefab]
   */
  PhaserExtensions.ExtendedGroup = function(game, parent, groupPrefab) {
    Phaser.Group.call(this, 
      game, parent, groupPrefab.name, groupPrefab.addToStage);
    
    _.merge(this. groupPrefab);
  };

  PhaserExtensions.ExtendedGroup.prototype = Object.create(Phaser.Group.prototype);
  PhaserExtensions.ExtendedGroup.prototype.constructor = PhaserExtensions.ExtendedGroup;

  _.assign(PhaserExtensions.ExtendedGroup.prototype, {
    instantiateDefaultPrefab: function(x, y) {
      console.assert(this.objectPrefab, 'Cannot instantiate default prefab because `objectPrefab` not set in group `' + this.name + '`');
      this.instantiatePrefab(this.objectPrefab, x, y);
    },

    instantiatePrefab: function(nameOrPrefab, x, y) {
      PhaserExtensions.Prefabs.instantiateInGroup(nameOrPrefab, this, x, y);
    }
  });
})(this);