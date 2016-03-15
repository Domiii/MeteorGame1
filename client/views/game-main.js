'use strict';

Template.game.helpers({
});

var getOptimalGameWidth = function() {
  var $body = $('body');
  var w = $body.innerWidth();

  return w || 800;
};

var getOptimalGameHeight = function() {
  var $body = $('body');
  var h = $body.innerHeight();
  h -= $('.navbar').outerHeight() + 1;

  return h || 800;
};

var resizeGame = function() {
  game.width = getOptimalGameWidth();
  game.height = getOptimalGameHeight();
 
  if (game.renderType === Phaser.WEBGL) {
    game.renderer.resize(game.width, game.height);
    //game.renderer.setSmoothingEnabled(game.context, false);
  }
};

Global.StartGame = function(){
  if (Global.game) return;

  // start the game
  var cont = $('#game-container');
  Global.game = new Phaser.Game(getOptimalGameWidth(), getOptimalGameHeight(), Phaser.AUTO, 'game-container',
    { preload: preload, create: create, update: update, render: render });

  $(window).resize(resizeGame);
  setTimeout(resizeGame);

  var PhaserGame = function () {
    this.bmd = null;

    this.points = {
        'x': [ 32, 128, 256, 384, 512, 608 ],
        'y': [ 240, 240, 240, 240, 240, 240 ]
    };

  };

  PhaserGame.prototype = {

      create: function () {

          this.stage.backgroundColor = '#204090';

          this.bmd = this.add.bitmapData(this.game.width, this.game.height);
          this.bmd.addToWorld();

          var py = this.points.y;

          for (var i = 0; i < py.length; i++)
          {
              py[i] = this.rnd.between(32, 432);
          }

          this.plot();

      },

      plot: function () {

          this.bmd.clear();

          var x = 1 / game.width;

          var white = 'rgba(255, 255, 255, 1)';
          var thickness = 10;
          var r = thickness/2;

          for (var i = 0; i <= 1; i += x)
          {
              // var px = this.math.linearInterpolation(this.points.x, i);
              // var py = this.math.linearInterpolation(this.points.y, i);

              // var px = this.math.bezierInterpolation(this.points.x, i);
              // var py = this.math.bezierInterpolation(this.points.y, i);

              var px = this.math.catmullRomInterpolation(this.points.x, i);
              var py = this.math.catmullRomInterpolation(this.points.y, i);

              this.bmd.circle(px, py, r, white);
          }

          for (var p = 0; p < this.points.x.length; p++)
          {
              this.bmd.rect(this.points.x[p]-r, this.points.y[p]-r, thickness, thickness, 'rgba(255, 0, 0, 1)');
          }

      }

  };

  //game.state.add('Game', PhaserGame, true);
};


var gameStarter;
var tryStartGame = function() {
  if (Meteor.userId() && Global.Phaser && $('#game-container').length > 0){
    clearInterval(gameStarter);
    StartGame();
  }
};

// // check for login event
// // see: http://stackoverflow.com/questions/16350424/meteor-js-on-login-event
// Tracker.autorun(function(){
//   tryStartGame();
// });

$(window).load(function() {
  gameStarter = setInterval(tryStartGame);
});