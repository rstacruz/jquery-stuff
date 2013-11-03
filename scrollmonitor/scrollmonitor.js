/**
 * Monitors scrolling and executes something on different breakpoints.
 *
 * mon = new ScrollMonitor({
 *   if: (y) -> y < 300
 *   enter: -> $('top').hide()
 *   exit: -> $('top').show()
 *   scroll: ->
 * })
 *
 * mon.update()
 * mon.enable()
 * mon.disable()
 * mon.status()  #=> true/false
 */

window.ScrollMonitor = function(options) {
  var last = null;
  var $window = $(window);

  function update() {
    var y = $window.scrollTop();
    var now = options["if"](y);

    if (last !== now) {
      last = now;
      if (now && options.enter)
        options.enter(y);
      else if (!now && options.exit)
        options.exit(y);
    }
    if (options.scroll)
      return options.scroll(y, now);
  }

  var obj = {
    update: update,
    status: function() {
      return last;
    },
    enable: function() {
      $window.on('resize', update);
      $window.on('scroll', update);
      this.update();
      return this;
    },
    disable: function() {
      $window.off('resize', update);
      $window.off('scroll', update);
      return this;
    }
  };

  return obj.enable();
};
