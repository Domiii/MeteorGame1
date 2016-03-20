'use strict';

//var Global = this;

// register the following extensions, once the client is ready
onceSymbolReady('Phaser', function() {
  Global.PhaserExtensions = {};

  Global.PhaserExtensions.AllComponents = {};

  PhaserExtensions.GameObjectComponentBase = function(gameObject) {
    this.gameObject = gameObject;
  };
  _.assignIn(PhaserExtensions.GameObjectComponentBase.prototype, {
    init: function() {
    },

    start: function() {

    },

    update: function() {

    },

    stop: function() {

    },

    reset: function() {

    },

    getComponents: function(name) {
      return this.gameObject.getComponents(name);
    },

    getComponent: function(name) {
      return this.gameObject.getComponent(name);
    }
  });

  PhaserExtensions.defineComponent = function(name, members) {
    // create new Component class
    var ComponentClass = function(name) {
      Object.defineProperty(this, 'name', {
        value: name
      });
    };
    ComponentClass.prototype = Object.create(PhaserExtensions.GameObjectComponentBase);
    ComponentClass.prototype.constructor = ComponentClass;
    _.assignIn(ComponentClass.prototype, members);

    // register class
    Global.PhaserExtensions.AllComponents[name] = ComponentClass;
  };

  PhaserExtensions.GameObject = function(game, x, y, key, frame) {
    // call base ctor
    Phaser.Sprite(game, x, y, key, frame);

    this._goComponents = [];
    this._goComponentsByName = {};

    this.events.onAddedToGroup.add(this.start, this);
    this.events.onRemovedFromGroup.add(this.stop, this);
  };

  PhaserExtensions.GameObject.prototype = Object.create(Phaser.Sprite.prototype);
  PhaserExtensions.GameObject.prototype.constructor = PhaserExtensions.GameObject;
  _.assignIn(PhaserExtensions.GameObject.prototype, {
    addComponent: function(name, /*, arg0, arg1, arg2, etc... */ ) {
      // create component
      var clazz = PhaserExtensions.AllComponents[name];
      if (clazz == null) {
        throw new Error("Invalid component name. There is no component defined with this name: " + name);
      }
      var component = new clazz(name);

      var args = Array.splice.call(arguments, 0, 1)
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
      var args = Array.splice.call(arguments, 0, 1);

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