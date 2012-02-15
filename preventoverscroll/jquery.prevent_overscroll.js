(function($) {

  // If you have an element with overflow: auto (or overflow: scroll), and you
  // try to use your mouse wheel to scroll it, the document will probably scroll
  // once your pane is at it's boundaries.
  //
  //     <!-- Once this hits the bottom of the scroll pane, using the
  //          mouse wheel to scroll will scroll the document. Not good. -->
  //
  //     <div class="scrollable">...</div>
  //     .scrollable { overflow: auto; height: 200px; }
  //
  // Simply use .preventScroll() to stop this behavior.
  //
  //     $(".scrollable").preventOverscroll();
  //
  $.fn.preventOverscroll = function() {
    var $this = $(this);

    $this.live("mousewheel", function(e) {
      var dy = e.originalEvent.wheelDeltaY;
      var dx = e.originalEvent.wheelDeltaX;

      // Get direction of scrolling.
      var scrolling = {
        down:  dy < 0,
        up:    dy > 0,
        left:  dx > 0,
        right: dx < 0
      };

      // Check if we're at boundaries.
      var at = {
        top:    ($this.scrollTop() === 0),
        left:   ($this.scrollLeft() === 0),
        bottom: (this.scrollHeight - $this.scrollTop() <= $this.height()),
        right:  (this.scrollHeight - $this.scrollTop() <= $this.height())
      };

      if ((scrolling.down  && at.bottom) ||
          (scrolling.up    && at.top) ||
          (scrolling.left  && at.left) ||
          (scrolling.right && at.right)) {
        e.preventDefault();
      }
    });
  };

})();
