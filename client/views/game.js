'use strict';

Template.game.helpers({
});

$(window).load(function(){
  // start the game

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', 
    { preload: preload, create: create, update: update });

  function preload() {
    // for some reason, canvas display style is set to block in code...
    var canvas = game.canvas;
    canvas.style.display = "inline-block";
  }

  function create() {
  }

  function update() {
  }
});