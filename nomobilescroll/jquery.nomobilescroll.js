/*! ---------------------------------------
 *  NoMobileScroll
 *  http://github.com/rstacruz/jquery-stuff
 * ---------------------------------------- */

// Prevents iPad from scrolling. Great for fullscreen web apps.
//
// In addition to this JavaScript hack, you will also need to nest your scrollable areas:
//
//     .scrollable,
//     .scrollable > div {
//        -webkit-overflow-scrolling: touch;
//        overflow: auto;
//     }
//
(function($) {
  $.noMobileScroll = function() {
    document.addEventListener('touchstart', function(e) {
      // Find the parent pane.
      var $pane;
      $(e.target).parents().each(function() {
        if ($pane) return;
        var $el = $(this);
        var flow = $el.css('overflow');
        if ((flow === 'auto') || (flow === 'scroll')) {
          $pane = $el;
        }
      });

      // If there is no scrollable pane, or if there is but it's not enough to scroll,
      // Prevent default.
      if ((!$pane) || ($pane[0].scrollHeight <= $pane.innerHeight())) {
        e.preventDefault();
      }
    });
  };
})(jQuery);

