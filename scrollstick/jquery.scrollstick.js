/*! ---------------------------------------
 *  Scrollstick
 *  http://github.com/rstacruz/jquery-stuff
 * ---------------------------------------- */

// Makes something stick to the top when it gets scrolled away from.
//
//    $("#nav").scrollstick();
//
// You may also specify options:
//
//    $("#nav").scrollstick({
//      zIndex: 20
//    });
//
// All options are optional:
//
//  - `min`    - Start sticking when the user has scrolled down this far.
//  - `max`    - Move away when scrolling down this far.
//  - `offset` - How many pixels from the top.
//  - `zIndex` - The zIndex.
//
(function($) {
  $.fn.scrollstick = function(options) {
    var reposition, $this = this;
    if (!this.length) return;

    this.data('stuck', false);

    var defaults = {
      min: this.offset().top,
      max: null,
      offset: 0,
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
        marginTop: 0,
        top: options.offset,
        left: $clone.offset().left,
        right: $(window).width() - ($clone.offset().left + $clone.outerWidth())
      });
    });

    $(window).on('scroll', function() {
      var pos = $(window).scrollTop();
      var inside = pos > (options.min - options.offset);
      var stuck = $this.data('stuck');

      // Stick it.
      if (!stuck && inside) {
        stuck = true;
        $this.data('stuck', true);
        $this.addClass('stuck');
        $parent = $this.parent();

        // Keep old values.
        old = {
          position: $this.css('position'),
          top: $this.css('top'),
          left: $this.css('left'),
          right: $this.css('right'),
          marginTop: $this.css('marginTop'),
        };

        // Make a placeholder.
        $clone = $this.clone();
        $clone.addClass('scrollstick-placeholder');
        $clone.css({ visibility: 'hidden' });
        $clone.insertAfter($this);

        reposition();
      }

      // Move it away when you've reached the max.
      if (typeof options.max === 'number') {
        if (stuck && pos > options.max) {
          $this.css({ top: options.offset - (pos - options.max) });
        } else {
          $this.css({ top: options.offset });
        }
      }

      // Unstick it.
      if (stuck && !inside) {
        $this.data('stuck', false);
        $this.removeClass('stuck');

        // Either kill the clone, or just hide it
        $this.css({ position: old.position, top: old.top, left: old.left, right: old.right, marginTop: old.marginTop });
        $clone.remove();
      }
    });
  };
})(jQuery);
