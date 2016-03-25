var _ = lodash;

(function(Global) {
  'use strict';

  // register the following extensions, once the client is ready
  dependsOnSymbols(['Phaser'], function() {
    Global.PhaserExtensions = {};
    Global.PhaserExtensions.AllComponents = {};

    // prototype base to be added to all Components
    var ComponentPrototypeBase = {
      /**
       * Called when component is created, with given set of arguments
       */
      init: function() {
      },

      /**
       * Called when component is added to world (or other group)
       */
      start: function() {

      },

      /**
       * Called on update
       */
      update: function() {

      },

      /**
       * Called when component is removed from world (or other group)
       */
      stop: function() {

      },

      /**
       * NYI: Components should be resettable to a pre-configured state.
       */
      reset: function() {

      },

      /**
       * Returns all components of name
       */
      getComponents: function(name) {
        return this.gameObject.getComponents(name);
      },

      /**
       * Returns first component of name
       */
      getComponent: function(name) {
        return this.gameObject.getComponent(name);
      }
    };

    /**
     * Define component of give name and with given methods
     */
    PhaserExtensions.defineComponent = function(name, methods) {
      // create new Component class
      var ComponentClass = function(name, gameObject) {
        Object.defineProperty(this, 'name', {
          value: name
        });
        this.gameObject = gameObject;
      };
      ComponentClass.prototype = Object.create(ComponentPrototypeBase);
      ComponentClass.prototype.constructor = ComponentClass;
      _.assign(ComponentClass.prototype, methods);

      // register class
      Global.PhaserExtensions.AllComponents[name] = ComponentClass;
    };

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
      addComponent: function(name, /*, arg0, arg1, arg2, etc... */ ) {
        // create component
        var clazz = PhaserExtensions.AllComponents[name];
        if (clazz == null) {
          throw new Error("Invalid component name. There is no component defined with this name: " + name);
        }

        var component = new clazz(name, this);
        var args = Array.prototype.slice.call(arguments, 1);
        component.init.apply(component, args);

        // add component
        this._goComponents.push(component);
        var components = this._goComponentsByName[name];
        if (components == null) {
          components = this._goComponentsByName[name] = [];
        }
        components.push(component);
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
          component.update();
        }
      },
      stop: function() {
        for (var i = 0; i < this._goComponents.length; ++i) {
          var component = this._goComponents[i];
          component.stop();
        }
      },
      // reset: function() {

      // }
    });
  });
})(this);