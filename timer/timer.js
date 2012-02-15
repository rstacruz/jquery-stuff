(function() {

  // General purpose timer class.
  // http://github.com/rstacruz/jquery-stuff
  //
  // Instanciating a Timer is the same as doing `setTimeout`.
  //
  //     t = new Timer(200, function() { ... });
  //
  // But, you can abort it before it happens!
  //
  //     t.abort();
  //
  // You can also restart the timer before it executes.
  // You can also restart() after aborting.
  //
  //     t.restart();
  //
  // You can provide a new delay.
  //
  //     t.restart(400);
  //
  // If you'd like to instanciate a Timer now, but activate it later on:
  //
  //     t = new Timer;
  //     t.reset(200, function() { ... })

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
        self.id = null;
        fn();
      }, delay);

      return this;
    },

    restart: function(delay) {
      if (fn) {
        if (typeof delay !== 'undefined') {
          this.delay = delay;
        }

        this.abort();
        this.reset(this.delay, this.fn);
      }

      return this;
    },

    abort: function() {
      if (this.id != null) {
        window.clearTimeout(this.id);
        this.id = null;
      }

      return this;
    }
  };

  window.Timer = Timer;

})();
