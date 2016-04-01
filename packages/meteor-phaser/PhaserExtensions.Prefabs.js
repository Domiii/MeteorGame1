(function(Global) {
  'use strict';


  PhaserExtensions.Prefabs = {
    _specialPropertyPaths: [
      'x', 'y', 'sprite', 'name',
      'body.sensorOnly',
      'components'
    ],

    list: [],
    byName: {},

    _defaults: {
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
        prefab = this._defaultsPrefab = this._convertToPrefab(this._defaults);
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
     * @param {Object} [prefab]
     * @param {String|Sprite} [prefab.sprite]
     * @param {Number} [prefab.x]
     * @param {Number} [prefab.y]
     * @param {Object} [prefab.body]
     * @param {Array.<Object>} [prefab.components]
     * @param {String} [prefab.components.<name>]
     * @param {Object} [prefab.components.<data>]
     */
    registerOne: function(name, _prefab) {
      var prefab = this.convertToPrefab(_prefab);
      prefab.name = name;

      if (this.byName[name]) {
        console.warning('Overriding prefab of name because name has been registered more than once: ' + 
          name);
      }

      this.list.push(prefab);
      this.byName[name] = prefab;

      // merge in defaults
      _.defaultsDeep(groupPrefab, this.getDefaultPrefab());
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
      var prefab = this.asPrefab(prefabOrName);

      if (arguments.length < 3) {
        x = prefab.x || 0;
        y = prefab.y || 0;
      }

      var gameObject = group.create(x, y, prefab.sprite);
      this._assignTo(gameObject, prefab);
      return gameObject;
    },

    assignTo: function(gameObject, possiblePrefab) {
      var prefab = this.convertToPrefab(possiblePrefab);
      this._assignTo(gameObject, prefab);
    },

    _assignTo: function(gameObject, prefab) {
      // merge in all data recursively
      _.merge(gameObject, prefab.data);

      this.assignBodySpecials(gameObject, prefab.body);
      this.addComponents(gameObject, prefab.components);
    },

    assignBodySpecials: function(gameObject, bodyCfg) {
      if (!bodyCfg) {
        return;
      }

      var body = gameObject.body;

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
    },

    isPrefab: function(obj) {
      return obj.___isPrefab____ === true;
    },

    asPrefab: function(prefabOrName) {
      if (_.isString(prefabOrName)) {
        return this.getPrefab(prefabOrName);
      }
      else {
        return this._convertToPrefab(prefabOrName);
      }
    },

    _convertToPrefab: function(possiblePrefab) {
      if (this.isPrefab(possiblePrefab)) {
        return possiblePrefab;
      }

      var prefab = this.collectPropertiesExcept(possiblePrefab, this._specialPropertyPaths, 'data');

      // flag as prefab
      prefab.___isPrefab____ = true;

      return prefab;
    },

    collectPropertiesExcept: function(obj, excludePropPaths, collectPath) {
      // clone object
      var obj2 = _.cloneDeep(obj);

      // get existing collection, or create new
      var collection = _.get(obj2, collectPath) || {};

      // merge everything into the collection object (but exclude itself)
      _.unset(obj2, collectPath);
      _.merge(collection, obj2);

      var dst = {};

      // take out all special properties from collection, and add to dst directly
      for (var propPath in propPaths) {
        var val = _.get(collection, propPath);
        _.unset(collection, propPath);
        _.set(dst, propPath, val);
      }

      // add collection object to destination
      _.set(dst, collectPath, collection);

      // clone again, to reduce the chance of the final object being in slow mode
      // (which is often caused by deletion)
      return _.cloneDeep(dst);
    }
  };
})(this);