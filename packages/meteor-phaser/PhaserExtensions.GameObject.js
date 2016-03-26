(function(Global) {
  'use strict';

  PhaserExtensions.GameObject = function(game, x, y, key, frame) {
    // call base ctor
    Phaser.Sprite.call(this, game, x, y, key, frame);

    this._goComponents = [];
    this._goComponentsByName = {};

    this.events.onAddedToGroup.add(this.start, this);
    this.events.onRemovedFromGroup.add(this.stop, this);
  };

  PhaserExtensions.GameObject.prototype = Object.create(Phaser.Sprite.prototype);
  PhaserExtensions.GameObject.prototype.constructor = PhaserExtensions.GameObject;
  _.assign(PhaserExtensions.GameObject.prototype, {
    addComponent: function(name, initialValues) {
      // create component
      var clazz = PhaserExtensions.AllComponents[name];
      if (clazz == null) {
        throw new Error("There is no component defined with given name: " + name);
      }
      var component = new clazz(name, this, initialValues);

      // reset
      component.resetComponent();

      // add component
      this._goComponents.push(component);
      var components = this._goComponentsByName[name];
      if (components == null) {
        components = this._goComponentsByName[name] = [];
      }
      components.push(component);

      if (clazz.requiredComponents instanceof Array) {
        for (var i = 0; i < clazz.requiredComponents.length; ++i) {
          var compName = clazz.requiredComponents[i];
          this.requireComponent(compName);
        }
      }

      // call init event
      component.init();

      return component;
    },

    /**
     * Gets the first component of given name, or adds a new component if 
     * object does not have it yet.
     */
    requireComponent: function(name) {
      var c = this.getComponent(name);
      if (!c) {
        c = this.addComponent(name);
      }
      return c;
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
  });
})(this);