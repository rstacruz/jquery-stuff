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
//  - `tag`    - Tag
//
//
// You can unbind a scrollstick via:
//
//     $(selector).scrollstick({ tag: 'mytag' });
//     $.unscrollstick(selector, 'mytag');
//
(function($) {
  $.fn.scrollstick = function(options) {
    var reposition, onscroll, $this = this;
    if (!this.length) return;

    this.data('stuck', false);

    var defaults = {
      min: this.offset().top,
      max: null,
      offset: 0,
      zIndex: 10,
      exitZIndex: 10,
      tag: null
    };

    options = $.extend({}, defaults, options);

    var tag = ".scrollstick";
    if (options.tag) tag = tag + '.' + options.tag;

    var $clone;

    // On resizing, reposition the top/left/right of the cloned element.
    $(window).on('resize'+tag, reposition = function() {
      options.min = $this.offset().top;
      if ((!$clone) || (!$this.data('stuck'))) return;

      var borderBox = ($clone.css('box-sizing') === 'border-box');

      $this.css({
        position: 'fixed',
        zIndex: options.zIndex,
        margin: 0
      });

      // Force a repaint
      $clone[0].outerWidth;

      // Then reposition based on the clone's new position
      $this.css({
        top: options.offset,
        left: $clone.offset().left,
        width: borderBox ? $clone.outerWidth() : $clone.innerWidth()
      });
    });

    $(window).on('scroll'+tag, onscroll = function() {
      var pos = $(window).scrollTop();
      var inside = pos > (options.min - options.offset);
      var stuck = $this.data('stuck');

      // Stick it.
      if (!stuck && inside) {
        stuck = true;
        $this.data('stuck', true);
        $this.addClass('stuck');

        // Make a placeholder.
        $clone = $this.clone();
        $clone.addClass('scrollstick-placeholder');
        $clone.css({ visibility: 'hidden' });
        $clone.insertAfter($this);
        $this.data('scrollstick:clone', $clone);

        reposition();
      }

      // Move it away when you've reached the max.
      if ((typeof options.max === 'number') && (stuck)) {
        var exiting = (pos > options.max);

        if ((exiting) && ($this.css('position') !== 'absolute')) {
          $this
            .addClass('exited')
            .css({
              position: 'absolute',
              top: options.max - $clone.offsetParent().offset().top,
              left: $clone.offset().left - $clone.offsetParent().offset().left,
              zIndex: options.exitZIndex
            });
        }

        if ((!exiting) && ($this.css('position') !== 'fixed')) {
          $this
            .removeClass('exited')
            .css({ position: 'fixed',
              top: options.offset,
              left: $clone.offset().left,
              zIndex: options.zIndex
            });
        }
      }

      // Unstick it.
      if (stuck && !inside) unstick($this);
    });

    // Fix bug in Firefox where scroll event isn't triggered after reloading
    // in the middle of a page
    onscroll();
  };

  $.unscrollstick = function(selector, _tag) {
    var $el = $(selector);
    if ($el.data('stuck')) unstick($el);

    var tag = ".scrollstick";
    if (_tag) tag = tag + '.' + _tag;

    $(window).off(tag);
  };

  function unstick($this) {
    $this.data('stuck', false);
    $this.removeClass('stuck');
    $this.attr('style', '');
    var $clone = $this.data('scrollstick:clone');
    if ($clone) $clone.remove();
  }

})(jQuery);
