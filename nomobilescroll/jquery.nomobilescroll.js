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

      if ((!$pane) || ($pane[0].scrollHeight <= $pane.outerHeight())) {
        e.preventDefault();
      }
    });
  };
})(jQuery);

