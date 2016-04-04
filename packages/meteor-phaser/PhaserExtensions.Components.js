(function(Global) {
  'use strict';

  /**
   * All component classes, by name.
   */
  PhaserExtensions.AllComponents = {};

  /**
   * Prototype shared by all components
   */
  PhaserExtensions.ComponentPrototypeBase = {
    /**
     * Initialize defaults, if no initial values are given
     */
    // initDefaults: function() {
    //   return {};
    // },

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
     * Called when component is reset
     */
    onReset: function() {
    },

    /**
     * Reset values to their default
     */
    resetComponent: function(values) {
      // first reset to component defaults
      if (!!this.constructor.defaultValues) {
        _.merge(this, this.constructor.defaultValues);
      }

      if (!!values) {
        this._initialValues = values;
      }

      // then override with initial values for this object
      if (!!this._initialValues) {
        _.merge(this, this._initialValues);
      }

      // call reset event
      this.onReset();
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
   * Define new component class of given name with given instance methods and static members.
   * @param {Object} [instanceMethods]
   * @param {Object} [staticMembers]
   * @param {Object} [staticMembers.defaultValues] Assigned initially (and on reset) to each component instance.
   * @param {Array.String} [staticMembers.requiredComponents] Make sure, each object having this component also has the given set of components.
   */
  PhaserExtensions.defineComponent = function(name, instanceMethods, staticMembers) {
    // create new Component class
    var ComponentClass = function(name, gameObject, initialValues) {
      Object.defineProperty(this, 'name', {
        value: name
      });
      this.gameObject = gameObject;
      this.game = gameObject.game;
      this._initialValues = initialValues;
      this.enabled = true;
    };
    ComponentClass.prototype = Object.create(PhaserExtensions.ComponentPrototypeBase);
    ComponentClass.prototype.constructor = ComponentClass;
    _.assign(ComponentClass.prototype, instanceMethods);

    // set of static members, shared between all components
    if (!!staticMembers) {
      _.assign(ComponentClass, staticMembers);
    }

    // register class
    PhaserExtensions.AllComponents[name] = ComponentClass;
  };
})(this);