/*! ---------------------------------------
 *  Scrollstick
 *  http://github.com/rstacruz/jquery-stuff
 * ---------------------------------------- */

// Makes something stick to the top when it gets scrolled away from.
//
//    $("#nav").scrollstick({
//      zIndex: 20,
//      reclone: true|false   /* Reclone everytime. Default true */
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
      reclone: true
    };

    options = $.extend({}, defaults, options);
    var $clone = null;

    // On resizing, reposition the top/left/right of the cloned element.
    $(window).on('resize', reposition = function() {
      if ((!$clone) || (!$this.data('stuck'))) return;

      $clone.css({
        position: 'fixed',
        zIndex: options.zIndex,
        top: 0,
        left: $this.offset().left,
        right: $(window).width() - ($this.offset().left + $this.outerWidth())
      });
    });

    $(window).on('scroll', function() {
      var pos = $(window).scrollTop();
      var inside = pos > options.min && (!options.max || pos < options.max);
      var stuck = $this.data('stuck');

      // Stick it.
      if (!stuck && inside) {
        $this.data('stuck', true);

        if (!$clone) {
          $clone = $this.clone();
          $clone.find('script').remove();
          $clone.addClass('clone').appendTo($('body'));
        }

        reposition();

        $this.css({ visibility: 'hidden' });
      }

      // Unstick it.
      else if (stuck && !inside) {
        $this.data('stuck', false);
        $this.css({ visibility: 'visible' });

        // Either kill the clone, or just hide it
        if (options.reclone) {
          $clone.remove();
          $clone = null;
        } else {
          $clone.css({ top: '-9999px' });
        }
      }
    });
  };
})(jQuery);
