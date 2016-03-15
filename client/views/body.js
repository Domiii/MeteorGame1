'use strict';

// template stuff
Template.body.onCreated(function() {
  this.subscribe("players");
});

Template.body.events({
  "submit .new-task": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.text.value;

    // Insert a task into the collection
    Meteor.call("addTask", text);

    // Clear form
    event.target.text.value = "";
  },

  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
});