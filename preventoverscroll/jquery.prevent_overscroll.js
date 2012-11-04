/*! jQuery.preventOverscroll (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/preventoverscroll */

// If you have an element with overflow: auto (or overflow: scroll), and you
// try to use your mouse wheel to scroll it, the document will probably scroll
// once your scroll pane is at its boundaries.
//
//     <!-- Once this hits the bottom of the scroll pane, using the
//          mouse wheel to scroll will scroll the document. Not good. -->
//
//     <div class="scrollable">...</div>
//     .scrollable { overflow: auto; height: 200px; }
//
// Simply use .preventOverscroll() to stop this behavior.
//
//     $(".scrollable").preventOverscroll();

(function($) {
  $.fn.preventOverscroll = function() {
    // For WebKits, et al.
    if ('onmousewheel' in document.documentElement) {
      $(this).live('mousewheel', function(e) {
        var $this = $(this);

        var dy = e.originalEvent.wheelDeltaY;
        var dx = e.originalEvent.wheelDeltaX;

        // Sanity check for older browsers.
        if ((typeof dy === 'undefined') ||
            (typeof dx === 'undefined') ||
            (typeof this.scrollHeight === 'undefined')) {
          return;
        }

        // Get scrolling direction info, Webkit style.
        var scrolling = {
          down:  dy < 0,
          up:    dy > 0,
          left:  dx > 0,
          right: dx < 0
        };

        if (shouldStop($this, scrolling)) {
          e.preventDefault();
        }
      });
    }

    // For Moz.
    if ('MouseScrollEvent' in window) {
      $(this).live("DOMMouseScroll", function(e) {
        var $this = $(this);
        var ee = e.originalEvent;

        // Sanity check.
        if ((typeof ee.axis === 'undefined') ||
            (typeof this.scrollHeight === 'undefined')) {
          return;
        }

        // Get scrolling direction info, Mozilla style.
        var horiz = (ee.axis === ee.HORIZONTAL_AXIS);
        var vert  = (ee.axis === ee.VERTICAL_AXIS);
        var delta = ee.detail;

        var scrolling = {
          down:  vert  && delta > 0,
          up:    vert  && delta < 0,
          left:  horiz && delta < 0,
          right: horiz && delta > 0
        };

        if (shouldStop($this, scrolling)) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    // Given scrolling data `scrolling`, check if element `this` should stop
    // scrolling. Check if we're at boundaries.
    function shouldStop($this, scrolling) {
      // These are true/false of whether the content is already at boundaries.
      // For instance, `top` and `left` may both be true.
      var at = {
        top:    ($this.scrollTop()  === 0),
        left:   ($this.scrollLeft() === 0),
        bottom: ($this[0].scrollHeight - $this.scrollTop()  <= $this.height()),
        right:  ($this[0].scrollWidth  - $this.scrollLeft() <= $this.width())
      };

      return (
        (scrolling.down  && at.bottom) ||
        (scrolling.up    && at.top)    ||
        (scrolling.left  && at.left)   ||
        (scrolling.right && at.right)
      );
    }
  };
})(jQuery);
