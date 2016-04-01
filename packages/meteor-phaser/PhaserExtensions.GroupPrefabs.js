(function(Global) {
  'use strict';

  /**
   * Provides utilities for registering and instantiating from group prefabs.
   *
   * TODO: Group hierarchy registration and definitions (might want to have one set per stage)
   * TODO: Collision group prefabs
   */
  PhaserExtensions.GroupPrefabs = {
    _specialPropertyPaths: [
      'name'
    ],

    list: [],
    byName: {},

    /**
     * Set of global default values
     */
    _defaults: {
      classType: PhaserExtensions.GameObject
    },

    _defaultsPrefab: null,

    overrideDefault: function(propPath, value) {
      _.set(this._defaults, propPath, value);
      this._defaultsPrefab = null;    // defaultsPrefab needs to be rebuilt
    },

    overrideDefaults: function(cfg) {
      _.merge(this._defaults, cfg);
      this._defaultsPrefab = null;    // defaultsPrefab needs to be rebuilt
    },

    getDefaultPrefab: function() {
      var prefab = this._defaultsPrefab;
      if (!prefab) {
        prefab = this._defaultsPrefab = this._convertToGroupPrefab(this._defaults);
      }
      return prefab;
    },

    register: function(prefabs) {
      for (var name in prefabs) {
        var prefab = prefabs[name];
        this.registerOne(name, prefab);
      }
    },

    /**
   * @param {Object} [groupPrefab]
   * @param {Object} [groupPrefab.game]
   * @param {Object} [groupPrefab.parent]
   * @param {String} [groupPrefab.name]
   * @param {String} [groupPrefab.classType=PhaserExtensions.GameObject]
   * @param {Boolean} [groupPrefab.addToStage]
   * @param {Boolean} [groupPrefab.enableBody]
   * @param {PhysicsBodyType} [groupPrefab.physicsBodyType]
   * @param {PhysicsBodyType} [groupPrefab.classType]
   * @param {Object} [groupPrefab.objectPrefab]
     */
    registerOne: function(name, _groupPrefab) {
      var groupPrefab = this._convertToGroupPrefab(_groupPrefab);
      groupPrefab.name = name;

      if (this.byName[name]) {
        console.warning('Overriding group prefab of name because name has been registered more than once: ' + 
          name);
      }

      this.list.push(groupPrefab);
      this.byName[name] = groupPrefab;

      // merge in defaults
      _.defaultsDeep(groupPrefab, this.getDefaultPrefab());

      // lookup classType, if string is given
      if (_.isString(groupPrefab.classType)) {
        groupPrefab.classType = _.get(Global, groupPrefab.classType);
      }
    },

    getGroupPrefab: function(name) {
      var prefab = this.byName[name];
      if (!prefab) {
        console.error(new Error('Invalid group prefab name is not registered: ' + name).stack);
        return { name: '<invalid group>' };
      }
      return prefab;
    },

    createDefaultGroup: function(game, parent) {
      return this.createGroup(game, parent, this.getDefaultPrefab());
    },

    createGroup: function(game, parent, nameOrPrefab) {
      var prefab = this.asGroupPrefab(nameOrPrefab);
      var group = new PhaserExtensions.ExtendedGroup(game, parent, prefab);
      return group;
    },

    assignDefaultsTo: function(group) {
      this.assignTo(group, this.getDefaultPrefab());
    },

    assignTo: function(group, prefabOrName) {
      var prefab = this.asGroupPrefab(prefabOrName);

      // merge in all raw data directly
      _.merge(group, prefab.data);
    },

    isGroupPrefab: function(obj) {
      return obj.___isGroupPrefab____ === true;
    },

    asGroupPrefab: function(prefabOrName) {
      if (_.isString(prefabOrName)) {
        return this.getGroupPrefab(prefabOrName);
      }
      else {
        return this._convertToGroupPrefab(prefabOrName);
      }
    },

    _convertToGroupPrefab: function(possiblePrefab) {
      if (this.isGroupPrefab(possiblePrefab)) {
        return possiblePrefab;
      }

      // convert to group prefab
      var prefab = PhaserExtensions.Prefabs.collectPropertiesExcept(
        possiblePrefab, this._specialPropertyPaths, 'data');

      // flag as prefab
      prefab.___isGroupPrefab____ = true;

      return prefab;
    }
  };
})(this);