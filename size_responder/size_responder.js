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
//     SizeResponder.when({
//       width: { min: 300 },
//       })
//       .on('enter', function() {
//         console.log("Browser was resized to < 300px width");
//       }),
//       .on('exit', function() {
//         console.log("Browser was resized to > 300px width");
//       });
//
// More options:
//
//     SizeResponder.when({
//       width: { min: 300, max: 600 },
//       height: { min: 30, max: 600 },
//     })
//
//     .on('enter', function() { ... })
//     .on('exit', function() { ... })
//     .on('tick', function() { ... })
//
// You can give an associated HTML class with the conditions using `.htmlClass()`:
//
//     SizeResponder
//       .when({ height: { min: 300 }})
//       .htmlClass('tall');
//
//    /* Toggles between <html class="tall"> and <html class="not-tall"> */
//
(function(w, $) {
  function SizeResponder(options) {
    var self = this;
    $.extend(self, options || {});

    self.emitter = $({});

    self._matches = undefined;
    self._fn = $.proxy(self.onresize, self);

    self.enable();
    setTimeout(function() {
      $(function() { self.onresize(); });
    }, 0);

    return self;
  }

  SizeResponder.prototype = {
    onresize: function() {
      var matches = this.matches();

      if (matches && this._matches !== true) {
        this.trigger('enter');
        this._matches = true;
      }

      else if (!matches && this._matches !== false) {
        this.trigger('exit');
        this._matches = false;
      }

      if (matches) this.trigger('tick');
    },

    // Delegate events to .emitter.
    trigger: function() { this.emitter.trigger.apply(this.emitter, arguments); return this; },
    on: function() { this.emitter.on.apply(this.emitter, arguments); return this; },
    off: function() { this.emitter.off.apply(this.emitter, arguments); return this; },

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
      $(window).off('resize.sizeresponder');
    },

    enable: function() {
      this.disable();
      $(window).on('resize.sizeresponder', this._fn);
    },

    htmlClass: function(klass) {
      this.on('enter', function() { $('html').addClass(klass).removeClass('not-'+klass); });
      this.on('exit', function() { $('html').removeClass(klass).addClass('not-'+klass); });
    }
  };

  SizeResponder.when = function(options) {
    return new SizeResponder(options);
  };

  w.SizeResponder = SizeResponder;
})(this, jQuery);
