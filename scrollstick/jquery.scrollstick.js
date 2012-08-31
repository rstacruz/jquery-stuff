/*! ---------------------------------------
 *  Scrollstick
 *  http://github.com/rstacruz/jquery-stuff
 * ---------------------------------------- */

// Makes something stick to the top when it gets scrolled away from.
//
//    $("#nav").scrollstick({
//      zIndex: 20
//    });
//
(function($) {
  $.fn.scrollstick = function(options) {
    var reposition, $this = this;
    if (!this.length) return;

    this.data('stuck', false);

    var defaults = {
      min: this.offset().top,
      max: null,
      zIndex: 10,
    };

    options = $.extend({}, defaults, options);

    var $clone;
    var $parent;
    var old;

    // On resizing, reposition the top/left/right of the cloned element.
    $(window).on('resize', reposition = function() {
      if ((!$clone) || (!$this.data('stuck'))) return;

      $this.css({
        position: 'fixed',
        zIndex: options.zIndex,
        top: 0,
        left: $clone.offset().left,
        right: $(window).width() - ($clone.offset().left + $clone.outerWidth())
      });
    });

    $(window).on('scroll', function() {
      var pos = $(window).scrollTop();
      var inside = pos > options.min;
      var stuck = $this.data('stuck');

      // Stick it.
      if (!stuck && inside) {
        stuck = true;
        $this.data('stuck', true);
        $parent = $this.parent();

        // Keep old values.
        old = {
          position: $this.css('position'),
          top: $this.css('top'),
          left: $this.css('left'),
          right: $this.css('right'),
        };

        // Make a placeholder.
        $clone = $this.clone();
        $clone.addClass('scrollstick-placeholder');
        $clone.css({ visibility: 'hidden' });
        $clone.insertAfter($this);

        reposition();
      }

      // Move it away.
      if (typeof options.max === 'number') {
        if (stuck && pos > options.max) {
          var extra = pos - options.max;
          $this.css({ top: -1 * extra });
        } else {
          $this.css({ top: 0 });
        }
      }

      // Unstick it.
      if (stuck && !inside) {
        $this.data('stuck', false);

        // Either kill the clone, or just hide it
        $this.css({ position: old.position, top: old.top, left: old.left, right: old.right });
        $clone.remove();
      }
    });
  };
})(jQuery);
