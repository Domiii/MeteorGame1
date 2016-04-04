(function(Global) {
  'use strict';

  /**
   */
  PhaserExtensions.ExtendedGroup = function(game, parent, groupPrefab) {
    Phaser.Group.call(this, 
      game, parent, groupPrefab.name, groupPrefab.addToStage);
    
    _.merge(this. groupPrefab);


    // make sure, object prefab is in actual prefab form (if given)
    // and keep the result internal.
    if (this.objectPrefab) {
      this.setObjectPrefab(this.objectPrefab);
      this.objectPrefab = null;
    }
  };

  PhaserExtensions.ExtendedGroup.prototype = Object.create(Phaser.Group.prototype);
  PhaserExtensions.ExtendedGroup.prototype.constructor = PhaserExtensions.ExtendedGroup;

  _.assign(PhaserExtensions.ExtendedGroup.prototype, {
    getObjectPrefab: function() {
      return this._objectPrefab;
    },

    setObjectPrefab: function(nameOrPrefab) {
      this._objectPrefab = nameOrPrefab && PhaserExtensions.Prefabs.asPrefab(nameOrPrefab) || {};
    },

    modifyObjectPrefab: function(nameOrPrefab) {
      PhaserExtensions.Prefabs.modifyPrefab(this._objectPrefab, nameOrPrefab);
    },

    instantiate: function(x, y) {
      return this.instantiatePrefab(x, y, this._objectPrefab);
    },

    instantiatePrefab: function(nameOrPrefab) {
      return PhaserExtensions.Prefabs.instantiateInGroup(nameOrPrefab, this);
    },

    instantiatePrefabAt: function(x, y, nameOrPrefab) {
      return PhaserExtensions.Prefabs.instantiateInGroup(nameOrPrefab, this, x, y);
    },

    _ensureObjectPrefab: function() {
    }
  });
})(this);