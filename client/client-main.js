'use strict';

// configure accounts UI
Accounts.ui.config({
  requestPermissions: {
      google: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
      ],
  },
  requestOfflineToken: {google: true},
});

// data subscriptions
Meteor.subscribe("tasks");