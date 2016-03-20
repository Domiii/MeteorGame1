'use strict';

// TODO: Move to webpack for proper dependency management
//    see: https://medium.com/@SamCorcos/meteor-webpack-from-the-ground-up-f123288c7b75#.70nkaem0n
//    see: https://forums.meteor.com/t/use-webpack-with-meteor-simply-by-adding-packages-meteor-webpack-1-0-is-out/18819

var eventCb = function(e) {
  console.log('Script executed: ', e.target);
};
document.addEventListener('afterscriptexecute', eventCb, false);

function executeIfReady(symbolNames, cb) {
  for (var i = 0; i < symbolNames.length; ++i) {
    var symbolName = symbolNames[i];
    if (!Global[symbolName]) return false;
  }

  cb();
  return true;
};

/**
 * Execute callback once all of the given symbols are available
 * (only checked when a new script is loaded)
 */
window.onceSymbolReady = function(symbolNameOrNames, cb) {
  var symbolNames;
  if (symbolNameOrNames instanceof Array) {
    symbolNames = symbolNameOrNames;
  }
  else {
    symbolNames = [symbolNameOrNames];
  }

  executeIfReady(symbolNames, cb);

  var eventCb = function(e) {
    if (executeIfReady(symbolNames, cb)) {
      // the script has been executed -> Remove event listener
      document.removeEventListener('afterscriptexecute', eventCb, false);
    }
  };
  document.addEventListener('afterscriptexecute', eventCb, false);
};