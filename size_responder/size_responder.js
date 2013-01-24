/*! SizeResponder (c) 2013, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/size_responder */

// Performs a given callback (`enter`) when the window is resized to fit a
// certain range. Another callback (`exit`) will be ran when the window is
// resized not to fit that range.
//
// Perfect for responsive sites.
//
// Requires jQuery 1.7+.
//
// Simple example:
//
//     SizeResponder.on({
//       width: { min: 300 },
//       enter: function() {
//         console.log("Browser was resized to < 300px width");
//       },
//       exit: function() {
//         console.log("Browser was resized to > 300px width");
//       },
//     });
//
// More options:
//
//     SizeResponder.on({
//       width: { min: 300, max: 600 },
//       height: { min: 30, max: 600 },
//       enter: function() { ... },
//       exit: function() { ... }
//     });
//
(function(w, $) {
  function SizeResponder(options) {
    var self = this;
    $.extend(self, options || {});

    self._matches = false;
    self._fn = $.proxy(self.onresize, self);

    self.enable();
    $(function() { self.onresize(); });

    return self;
  }

  SizeResponder.prototype = {
    onresize: function() {
      var matches = this.matches();

      if (matches && !this._matches) {
        if (this.enter) this.enter();
        this._matches = true;
      }

      else if (!matches && this._matches) {
        if (this.exit) this.exit();
        this._matches = false;
      }
    },

    matches: function() {
      var match = true;
      var self = this;

      function check(what) {
        if (self[what] && match) {
          var size = $(window)[what]();
          if (typeof self[what].min === 'number' && size < self[what].min) match = false;
          if (typeof self[what].max === 'number' && size > self[what].max) match = false;
        }
      }

      check('width');
      check('height');
      return match;
    },

    disable: function() {
      $(window).off('resize.sizeresponder', this._fn);
    },

    enable: function() {
      this.disable();
      $(window).on('resize.sizeresponder', this._fn);
    }
  };

  SizeResponder.on = function(options) {
    return new SizeResponder(options);
  };

  w.SizeResponder = SizeResponder;
})(this, jQuery);
