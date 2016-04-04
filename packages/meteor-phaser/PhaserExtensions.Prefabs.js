(function(Global) {
  'use strict';

  PhaserExtensions.Prefabs = {
    _properties: {
      special: [
        'x', 'y', 'sprite', 'name',
        'components',
        //'body.sensorOnly',
      ],
      deepCopy: {
        'body'
      }
    },

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
     * @param {Object} [_prefab]
     * @param {String|Sprite} [_prefab.sprite]
     * @param {Number} [_prefab.x]
     * @param {Number} [_prefab.y]
     * @param {Array.<Object>} [_prefab.components]
     * @param {String} [_prefab.components]
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
      gameObject.assignPrefabValues(prefab);
      return gameObject;
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

    modifyPrefab: function(nameOrPrefabDst, nameOrPrefabSrc) {
      var dst = this.asPrefab(nameOrPrefabDst);
      var src = this.asPrefab(nameOrPrefabSrc);

      return _.merge(dst, src);
    },

    _convertToPrefab: function(possiblePrefab) {
      if (this.isPrefab(possiblePrefab)) {
        return possiblePrefab;
      }

      // convert data format
      var prefab = this.collectPropertiesExcept(possiblePrefab, this._specialPropertyPaths, 'data');

      // add and touch up prefab properties
      this._decoratePrefab(prefab);

      return prefab;
    },

    _decoratePrefab: function(prefab) {
      // flag as prefab
      prefab.___isPrefab____ = true;

      // merge in defaults
      _.defaultsDeep(prefab, this.getDefaultPrefab());
    },

    collectPropertiesExcept: function(obj, excludePropPaths, collectPath) {
      // clone object
      var obj2 = _.cloneDeepWith(obj, function(value, key, currentObj) {
        // TODO: We only want to shallow-copy most kinds of objects
      });

      // get existing collection, or create new
      var collection = _.get(obj2, collectPath) || {};

      // merge everything into the collection object (but exclude itself)
      _.unset(obj2, collectPath);
      _.merge(collection, obj2);

      var dst = {};

      // take out all special properties from collection, and add to dst directly
      for (var propPath in excludePropPaths) {
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