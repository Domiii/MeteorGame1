Package.describe({
  name: 'domiii:load-order-util',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('stevezhu:lodash');

  api.export('defineGlobal');
  api.export('dependsOnSymbols');
  api.export('_');
  
  api.addFiles('load-order-util.js');
});
