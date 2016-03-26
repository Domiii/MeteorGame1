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
    { preload: GameStatus.preload, create: GameStatus.create, update: GameStatus.update, render: GameStatus.render });

  $(window).resize(resizeGame);
  setTimeout(resizeGame);
};


var gameStarter;
var tryStartGame = function() {
  if (Meteor.userId() && Global.Phaser && $('#game-container').length > 0){
    clearInterval(gameStarter);
    StartGame();
  }
};

// check for login event
// see: http://stackoverflow.com/questions/16350424/meteor-js-on-login-event
Tracker.autorun(function(){
  tryStartGame();
});

$(window).load(function() {
  gameStarter = setInterval(tryStartGame);
});