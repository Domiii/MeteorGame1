Package.describe({
  name: 'domiii:load-order-util',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('stevezhu:lodash');
  api.export('dependsOnSymbols');
  api.addFiles('load-order-util.js');
});

Package.onTest(function(api) {
  // api.use('ecmascript');
  // api.use('tinytest');
  // api.use('domiii:load-order-util');
  // api.addFiles('load-order-util-tests.js');
});
