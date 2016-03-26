Package.describe({
  name: 'domiii:meteor-phaser',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('stevezhu:lodash', 'client');
  
  api.export('Phaser', 'client');
  api.export('PhaserExtensions', 'client');

  api.addFiles('Symbols.js', 'client');

  api.addFiles('compatibility/Phaser/build/phaser.min.es5.js', 'client');

  api.addFiles('PhaserExtensions.js', 'client');
  api.addFiles('PhaserExtensions.GameObject.js', 'client');
  api.addFiles('PhaserExtensions.Components.js', 'client');
  api.addFiles('PhaserExtensions.ExtendedGroup.js', 'client');
  api.addFiles('PhaserExtensions.Prefabs.js', 'client');
  api.addFiles('PhaserExtensions.GroupPrefabs.js', 'client');
});
