(function(Global) {
  'use strict';

  PhaserExtensions.Prefabs = {
    _properties: {
      special: [
        'x', 'y', 'sprite', 'name',
        'components',
        //'body.sensorOnly',
      ],
      deepMerge: {
        data: {
          'body': {
          }
        }
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
      this._mixedMergeDontOverride(this._defaults, cfg, this._properties.deepMerge);
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

    assignPrefabValues: function(obj, nameOrPrefab) {
      var prefab = this.asPrefab(nameOrPrefab);

      // merge in all data
      this._mixedMerge(obj, prefab.data, this._properties.deepMerge);
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

      return this._mixedMerge(dst, src, this._properties.deepMerge);
    },

    _convertToPrefab: function(possiblePrefab) {
      if (this.isPrefab(possiblePrefab)) {
        return possiblePrefab;
      }

      // convert data format
      var prefab = this.collectPropertiesExcept(possiblePrefab, this._properties.special, 'data');

      // add and touch up prefab properties
      this._decoratePrefab(prefab);

      return prefab;
    },

    _decoratePrefab: function(prefab) {
      // flag as prefab
      prefab.___isPrefab____ = true;

      // merge in defaults
      this._mixedMergeDontOverride(prefab, this.getDefaultPrefab(), this._properties.deepMerge);
    },

    _mixedMerge: function(dst, src, deepMergeProps) {
      var doMerge = this._mixedMerge;
      var customizer = function(objValue, srcValue, key, object, source, stack) {
        if (deepMergeProps && deepMergeProps[key]) {
          // deep-copy (merge) given subset of properties
          srcValue = srcValue || {};
          objValue = objValue || {};
          doMerge(objValue, srcValue, deepMergeProps[key]);
          return objValue;
        }
      };
      _.assignWith(dst, src, customizer);
    },

    /**
     * This is similar to _.defaults with a customizer to deep-merge given subset of properties
     */
    _mixedMergeDontOverride: function(dst, src, deepMergeProps) {
      var doMerge = this._mixedMergeDontOverride;
      var customizer = function(objValue, srcValue, key, object, source, stack) {
        if (deepMergeProps && deepMergeProps[key]) {
          // deep-copy (merge) given subset of properties
          srcValue = srcValue || {};
          objValue = objValue || {};
          doMerge(objValue, srcValue, deepMergeProps[key]);
          return objValue;
        }
        else if (objValue !== undefined) {
          // keep the original
          return objValue;
        }
      };
      _.assignWith(dst, src, customizer);
    },

    collectPropertiesExcept: function(obj, excludePropPaths, collectPath) {
      // clone object
      var obj2 = _.clone(obj);

      // get existing collection, or create new
      var collection = _.get(obj2, collectPath) || {};

      // merge everything into the collection object (but exclude itself)
      _.unset(obj2, collectPath);
      _.assign(collection, obj2);

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
      return _.clone(dst);
    }
  };
})(this);