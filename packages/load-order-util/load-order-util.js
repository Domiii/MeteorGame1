/* put global variables first, so Meteor picks them up */
defineGlobal = null;
dependsOnSymbols = null;

_ = lodash;   // replace underscore with lodash

(function(freeGlobal) {
  'use strict';

  var delayedInitializers = [];
  var alreadyStarted = false;


  function isSymbolReady(symbolName) {
    return !!_.get(window, symbolName);
  }

  function isSymbolNotReady(symbolName) {
    return !isSymbolReady(symbolName);
  }

  function getSymbolReadyCount(symbolNames) {
    var count = 0;
    for (var i = 0; i < symbolNames.length; ++i) {
      var symbolName = symbolNames[i];
      if (isSymbolReady(symbolName)) {
        ++count;
      }
    }
    return count;
  }

  function executeIfReady(initializer) {
    if (initializer.executed) {
      // already execute -> Don't try it again
      return false;
    }

    if (getSymbolReadyCount(initializer.dependencies) < 1) {
      // not ready yet
      return false;
    }

    // actual execution
    initializer.executed = true;
    initializer.cb();
    return true;
  };

  function executeReadyInitializers() {
    var runCount = 0;
    for (var i = 0; i < delayedInitializers.length; ++i) {
      var initializer = delayedInitializers[i];
      if (executeIfReady(initializer)) {
        ++runCount;
      }
    }
    return runCount;
  }

  function getMissingSymbolError(initializer) {
    var missing = _.map(initializer.dependencies, isSymbolNotReady);
    return 'Initializer missing ' + missing.length + 
      ' symbols: [' + missing.join() + '] - ' + initializer.cb;
  }

  defineGlobal = function(path, value) {
    _.set(Global, path, value);
  };

  /**
   * Execute callback once all of the given symbols are available
   * (only checked during Meteor startup)
   */
  dependsOnSymbols = function(symbolNameOrNames, cb) {
    console.assert(cb instanceof Function, "Invalid argument `cb` must be a function");

    var symbolNames;
    if (symbolNameOrNames instanceof Array) {
      symbolNames = symbolNameOrNames;
    }
    else {
      symbolNames = [symbolNameOrNames];
    }

    var initializer = {
      dependencies: symbolNames,
      cb: cb,
      executed: false
    };

    //if (!executeIfReady(initializer))
    {
      if (!alreadyStarted) {
        delayedInitializers.push(initializer)
      }
      else {
        if (!executeIfReady(initializer)) {
          // could not run now and no lazy loading support: report error
          console.error(getMissingSymbolError(initializer));
        }
      }
    }
  };

  Meteor.startup(function() {
    if (delayedInitializers.length > 0) {
      while(executeReadyInitializers() > 0);

      if (!_.every(delayedInitializers, { executed: true })) {
        console.error("Initializer(s) could not be run during start-up due to missing symbols:");
        console.error(_.map(_.filter(delayedInitializers, {executed: false}), getMissingSymbolError));
      }
    }

    alreadyStarted = true;
  });
})(this);