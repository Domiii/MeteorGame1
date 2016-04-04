(function(Global) {
  'use strict';

  /**
   * Methods for getting, setting, adding, requiring components
   */
  PhaserExtensions.ComponentContainerBase = {
    addComponent: function(name, initialValues) {
      // create component
      var Clazz = PhaserExtensions.AllComponents[name];
      if (Clazz == null) {
        throw new Error("There is no component defined with given name: " + name);
      }
      var component = new Clazz(name, this, initialValues);

      // reset
      component.resetComponent();

      // add component
      this._goComponents.push(component);
      var components = this._goComponentsByName[name];
      if (components == null) {
        components = this._goComponentsByName[name] = [];
      }
      components.push(component);

      if (Clazz.requiredComponents instanceof Array) {
        for (var i = 0; i < Clazz.requiredComponents.length; ++i) {
          var compName = Clazz.requiredComponents[i];
          this.requireComponent(compName);
        }
      }

      // call init event
      component.init();

      return component;
    },

    addComponents: function(componentCfgs) {
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

        this.addComponent(name, initialValues);
      }
    },

    /**
     * Gets the first component of given name, or adds a new component if 
     * object does not have one yet.
     */
    requireComponent: function(name) {
      var c = this.getComponent(name);
      if (!c) {
        c = this.addComponent(name);
      }
      return c;
    },

    /**
     * Requires a component of given name and overrides the given values.
     */
    setComponent: function(name, values) {
      var c = this.getComponent(name);
      if (!c) {
        c = this.addComponent(name, values);
      }
      else {
        c.resetComponent(values);
      }
      return c;
    },

    setComponents: function(componentCfgs) {
      if (!(componentCfgs instanceof Array)) {
        return;
      }

      for (var i = 0; i < componentCfgs.length; ++i) {
        var componentCfg = componentCfgs[i];
        var name, values;

        if (_.isString(componentCfg)) {
          name = componentCfg;
          values = null;
        }
        else {
          name = componentCfg.name;
          values = componentCfg;
        }

        this.setComponent(name, values);
      }
    },

    getComponents: function(name) {
      return this._goComponentsByName[name];
    },

    getComponentNames: function() {
      return Object.keys(this._goComponentsByName);
    },

    getComponent: function(name) {
      var components = this.getComponents(name);
      if (components != null && components.length > 0) {
        return components[0];
      }
      return null;
    },

    sendMessage: function(name /*, arg0, arg1, arg2, etc... */ ) {
      var args = Array.prototype.slice.call(arguments, 1);

      for (var i = 0; i < this._goComponents.length; ++i) {
        var component = this._goComponents[i];
        var fn = component[name];
        if (fn) {
            fn.apply(component, args);
        }
      }
    },
  };


  /**
   * Default set of GameObject messages
   */
  PhaserExtensions.GameObjectMessages = {
    start: function() {
      for (var i = 0; i < this._goComponents.length; ++i) {
        var component = this._goComponents[i];
        component.start();
      }
    },

    update: function() {
      for (var i = 0; i < this._goComponents.length; ++i) {
        var component = this._goComponents[i];
        if (component.enabled) {
          component.update();
        }
      }
    },

    stop: function() {
      for (var i = 0; i < this._goComponents.length; ++i) {
        var component = this._goComponents[i];
        component.stop();
      }
    },

    reset: function() {
      // TODO: Also reset x, y, key and frame

      for (var i = 0; i < this._goComponents.length; ++i) {
        var component = this._goComponents[i];
        component.resetComponent();
      }
    }
  };


  /**
   * Set of useful extra methods for GameObjects
   */
  PhaserExtensions.GameObjectMethods = {
    /**
     * Assign values and components from given prefab.
     */
    assignPrefabValues: function(nameOrPrefab) {
      var prefab = PhaserExtensions.Prefabs.asPrefab(nameOrPrefab);

      // merge in all data recursively
      _.merge(this, prefab.data);

      this.setComponents(prefab.components);
    },
  };

  PhaserExtensions.GameObject = function(game, x, y, key, frame) {
    // call base ctor
    Phaser.Sprite.call(this, game, x, y, key, frame);

    // data managed by ComponentContainerBase
    this._goComponents = [];
    this._goComponentsByName = {};

    // hooking up some GameObjectMessages
    this.events.onAddedToGroup.add(this.start, this);
    this.events.onRemovedFromGroup.add(this.stop, this);
  };

  PhaserExtensions.GameObject.prototype = Object.create(Phaser.Sprite.prototype);
  PhaserExtensions.GameObject.prototype.constructor = PhaserExtensions.GameObject;
  _.assign(PhaserExtensions.GameObject.prototype,
    [
      PhaserExtensions.ComponentContainerBase, 
      PhaserExtensions.GameObjectMessages,
      PhaserExtensions.GameObjectMethods
    ]);
})(this);