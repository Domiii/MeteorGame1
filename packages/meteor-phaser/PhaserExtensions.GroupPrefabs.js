(function(Global) {
  'use strict';

  /**
   * Provides utilities for registering and instantiating from group prefabs.
   *
   * TODO: Group hierarchy registration and definitions (but needs to be done per stage)
   * TODO: Collision group prefabs
   */
  PhaserExtensions.GroupPrefabs = {
    list: [],
    byName: {},

    /**
     * Set of global default values
     */
    defaults: {
      classType: PhaserExtensions.GameObject
    },

    overrideDefault: function(prop, value) {
      this.defaults[prop] = value;
    },

    overrideDefaults: function(cfg) {
      _.merge(this.defaults, cfg);
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
    registerOne: function(name, groupPrefab) {
     groupPrefab.name = name;

      if (this.byName[name]) {
        console.warning('Overriding group prefab of name because name has been registered more than once: ' + 
          name);
      }

      this.list.push(groupPrefab);
      this.byName[name] = groupPrefab;

      // merge in defaults (but don't override any already set values)
      squishy.mergeWithoutOverride(groupPrefab, this.defaults);

      // convert classType, if string is given
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
      return this.createGroup(game, parent, this.defaults);
    },

    createGroup: function(game, parent, nameOrPrefab) {
      var prefab;
      if (_.isString(nameOrPrefab)) {
        prefab = this.getGroupPrefab(nameOrPrefab);
      }
      else {
        prefab = nameOrPrefab;
      }

      var group = new PhaserExtensions.ExtendedGroup(game, parent, prefab);
      return group;
    },

    assignDefaultsTo: function(group) {
      this.assignTo(group, this.defaults);
    },

    assignTo: function(group, prefabOrName) {
      var prefab;
      if (_.isString(prefabOrName)) {
        prefab = this.getGroupPrefab(prefabOrName);
      }
      else {
        prefab = prefabOrName;
      }

      // lazy method... does not actually do type or other kinds of checking... potentially dangerous
      _.merge(group, prefab);
    }
  };
})(this);