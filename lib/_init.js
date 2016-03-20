// create a global namespace
// see: http://stackoverflow.com/a/28571757/2228771
Global = this;

if (typeof global !== 'undefined') {
  global = Global;
}

Global.Game = {};

// ############################################################
// # plug some security holes
// # see: https://dweldon.silvrback.com/common-mistakes
// ############################################################
Meteor.users.deny({
  update: function() {
    return true;
  }
});