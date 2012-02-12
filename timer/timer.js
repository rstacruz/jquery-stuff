(function() {

  // General purpose timer class.
  // http://github.com/rstacruz/jquery-stuff
  //
  //     t = new Timer(200, function() { ... });
  //     t.abort()
  //
  //     // Or to (re)set a function later on
  //     t = new Timer;
  //     t.reset(200, function() { ... })
  //
  //     // You can restart the timer before it executes
  //     t.restart();
  //
  //     // You can provide a new delay
  //     t.restart(400);

  function Timer(delay, fn) {
    this.initialize(delay, fn);
    return this;
  };

  Timer.prototype = {
    id: null,
    fn: null,
    delay: null,

    initialize: function(delay, fn) {
      if (typeof delay !== 'undefined') {
        this.reset(delay, fn);
      }
    },

    reset: function(delay, fn) {
      var self = this;

      // If there's a timer already scheduled to run, abort.
      self.abort();

      self.fn = fn;
      self.delay = delay;

      self.id = window.setTimeout(function() {
        self._cleanup();
        fn();
      }, delay);
    },

    restart: function(delay) {
      if (fn) {
        if (typeof delay !== 'undefined') {
          this.delay = delay;
        }

        this.abort();
        this.reset(this.delay, this.fn);
      }
    },

    abort: function() {
      if (this.id != null) {
        window.clearTimeout(this.id);
        this._cleanup();
      }
    },

    _cleanup: function() {
      this._id = null;
      this.fn = null;
      this.delay = null;
    }
  };

  window.Timer = Timer;

})();
