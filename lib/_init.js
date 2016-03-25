// create a global namespace
// see: http://stackoverflow.com/a/28571757/2228771
Global = this;

// see: https://github.com/stevezhu/meteor-lodash
_ = lodash;

if (typeof global !== 'undefined') {
  global = Global;
}

(function(freeGlobal) {
  // ############################################################
  // # plug some security holes
  // # see: https://dweldon.silvrback.com/common-mistakes
  // ############################################################
  Meteor.users.deny({
    update: function() {
      return true;
    }
  });
})(this);


//console.error('lib/_init.js');