(function(Global) {
  'use strict';


  PhaserExtensions.Prefabs = {
    list: [],
    byName: {},

    defaults: {
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
     * @param {Object} [prefab]
     * @param {String|Sprite} [prefab.sprite]
     * @param {Number} [prefab.x]
     * @param {Number} [prefab.y]
     * @param {Object} [prefab.body]
     * @param {Array.<Object>} [prefab.components]
     * @param {String} [prefab.components.<name>]
     * @param {Object} [prefab.components.<data>]
     */
    registerOne: function(name, prefab) {
     prefab.name = name;

      if (this.byName[name]) {
        console.warning('Overriding prefab of name because name has been registered more than once: ' + 
          name);
      }

      this.list.push(prefab);
      this.byName[name] = prefab;

      // merge in defaults
      for (var prop in this.defaults) {
        if (!prefab[prop]) {
          prefab[prop] = this.defaults[prop];
        }
      }
    },

    getPrefab: function(name) {
      var prefab = this.byName[name];
      if (!prefab) {
        console.error(new Error('Invalid prefab name is not registered: ' + name).stack);
        return {};
      }
      return prefab;
    },

    instantiate: function(prefabOrName, game, x, y) {
      return this.instantiateInGroup(prefabOrName, game.world, x, y);
    },

    instantiateInGroup: function(prefabOrName, group, x, y) {
      var prefab;
      if (_.isString(prefabOrName)) {
        prefab = this.getPrefab(prefabOrName);
      }
      else {
        prefab = prefabOrName;
      }

      if (arguments.length < 3) {
        x = prefab.x || 0;
        y = prefab.y || 0;
      }

      var gameObject = group.create(x, y, prefab.sprite);
      this.assignTo(gameObject, prefab);
      return gameObject;
    },

    assignTo: function(gameObject, prefab) {
      this.assignBodyData(gameObject, prefab.body);
      this.addComponents(gameObject, prefab.components);
    }

    assignBodyData: function(gameObject, bodyCfg) {
      if (!bodyCfg) {
        return;
      }

      var body = gameObject.body;

      if (!!bodyCfg.data) {
        _.merge(gameObject.body, bodyCfg.data)
      }

      if (bodyCfg.shapes) {
        // TODO: Add shapes
      }

      if (bodyCfg.sensor) {
        // TODO: Override sensor for all shapes
      }
    },

    addComponents: function(gameObject, componentCfgs) {
      if (!(componentCfgs instanceof Array)) {
        return;
      }

      for (var i = 0; i < componentCfgs.length; ++i) {
        var componentCfg = componentCfgs[i];
        var name, initialValues;

        if (_.isString(componentCfg)) {
          name = componentCfg;
          initialValues = null;
        }
        else {
          name = componentCfg.name;
          initialValues = componentCfg;
        }

        gameObject.addComponent(name, initialValues);
      }
    }
  };
})(this);