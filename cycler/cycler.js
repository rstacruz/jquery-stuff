/*! Cycler (c) 2012 Rico Sta. Cruz, MIT license. */

// Cycles between a given `list` at a given `interval`.
// Simply define an `onactivate` hook.
//
// All the options are optional except `onactivate`.
//
//     c = new Cycler(list, {
//       interval: 3000,
//       initial: 0, /* first slide's index */
//       onactivate: function(current, old) { ... }, /* Required */
//       onstart: function() { ... },
//       onpause: function() { ... }
//     });
//
// Navigating
// ----------
//
// You can switch by slides using `next()`, `previous()` and `goto()`. When
// these are invoked, the interval timer is reset (that is, it will take 3000ms
// again to switch to the next slide).
//
// If these are called when the slideshow is paused, it should remain paused.
//
// Doing this will trigger the `onactivate` callback.
//
//     c.next();
//     c.previous();
//     c.goto(0);
//
// Pausing
// -------
//
// You can pause and unpause the slideshow with `pause()` and `start()`. Note
// that calling `start()` will reset the interval timer.
//
// These will call the `onpause` and `onstart` callbacks respectively.
//
//     c.pause();
//     c.start();
//
// You can pass `true` as an argument (eg, `c.pause(true)`) to these to supress
// triggering the callbacks.
//
// Properties
// ----------
//
//     c.current    /* Numeric index of current item */
//     c.list       /* The list being cycled */
//
// Chainability
// ------------
//
// All the methods are chainable, too, so you can do:
//
//     c.next().pause();
//
// Slideshow example
// -----------------
//
//     var $parent = $(".slideshow");
//     var $images = $parent.find("img");
//
//     var c = new Cycler($images, {
//       interval: 5000,
//       onactivate: function(current) {
//         $images.hide();
//         $(current).show();
//       }
//     });
//
//     // Custom controls example
//     $(".slideshow-controls button.next").on("click", function() { c.next(); });
//     $(".slideshow-controls button.prev").on("click", function() { c.previous(); });
//
//     // Pause on hover example
//     $(".slideshow").on("hover", function() { c.pause(); }, function() { c.start(); });
//
(function() {
  function Cycler(list, options) {
    this.interval   = options.interval || 3000;
    this.onactivate = options.onactivate || (function(){});
    this.onpause    = options.onpause || (function(){});
    this.onstart    = options.onstart || (function(){});
    this.initial    = (typeof options.initial === 'undefined') ? 0 : options.initial;
    this.list       = list;
    this.current    = null;

    this.goto(this.initial);
    this.start();

    return this;
  };

  Cycler.prototype = {
    start: function(silent) {
      var self = this;
      if ((!self._timer) && (!silent)) this.onstart.apply(this);

      self.pause(true);
      self._timer = setTimeout(function() {
        self.next();
      }, this.interval);
      return this;
    },

    pause: function(silent) {
      if (this._timer) {
        if (!silent) this.onpause.apply(this);
        clearTimeout(this._timer);
        this._timer = null;
      }
      return this;
    },

    // Delays the interval a bit
    restart: function(silent) {
      if (this._timer) this.pause(true).start(silent);
    },

    previous: function() {
      return this.next(-1);
    },

    next: function(i) {
      if (typeof i === 'undefined') i = 1;

      // Get the new index
      i = (this.current + i + this.list.length*2) % this.list.length;

      return this.goto(i);
    },

    goto: function(idx) {
      var old = this.current;
      this.current = idx;

      this.onactivate.call(this, this.list[idx], idx, old);
      this.restart(true);
      return this;
    }
  };

  window.Cycler = Cycler;
})();
