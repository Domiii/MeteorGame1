'use strict';

// publish all public data
Meteor.publish("tasks", function () {
  return Tasks.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});

Meteor.publish("players", function () {
  return Players.find();
});

Meteor.publish("users", function () {
  return Meteor.users.find();
});