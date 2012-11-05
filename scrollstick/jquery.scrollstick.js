/*! jQuery.scrollstick (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/scrollstick */

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
      exitZIndex: 10
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
        margin: 0,
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
          margin: $this.css('margin')
        };

        // Make a placeholder.
        $clone = $this.clone();
        $clone.addClass('scrollstick-placeholder');
        $clone.css({ visibility: 'hidden' });
        $clone.insertAfter($this);

        reposition();
      }

      // Move it away when you've reached the max.
      if ((typeof options.max === 'number') && (stuck)) {
        var exiting;
        exiting = (pos > options.max - options.offset);

        if ((exiting) && ($this.css('position') !== 'absolute')) {
          $this
            .addClass('exited')
            .css({ position: 'absolute', top: options.max, zIndex: options.exitZIndex });
        }

        if ((!exiting) && ($this.css('position') !== 'fixed')) {
          $this
            .removeClass('exited')
            .css({ position: 'fixed', top: options.offset, zIndex: options.zIndex });
        }
      }

      // Unstick it.
      if (stuck && !inside) {
        $this.data('stuck', false);
        $this.removeClass('stuck');

        // Either kill the clone, or just hide it
        $this.css({ position: old.position, top: old.top, left: old.left, right: old.right, margin: old.margin });
        $clone.remove();
      }
    });
  };
})(jQuery);
