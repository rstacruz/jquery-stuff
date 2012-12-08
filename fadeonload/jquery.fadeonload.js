/*! fadeonload (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/fadeonload */

// Fades an image in on load.
//
//     $('.wallpaper img').fadeonload();
//
// The image doesn't have to be in the DOM at time of calling.
//
// Tip: add `opacity: 0` and the expected `width` and `weight` to the image in
// the CSS so that it will be invisible before scripts can be called. This
// prevents the image from 'peeking' before fading in.
//
(function($) {
  $.fn.fadeonload = function() {
    var $image = this;

    $(function() {
      $image.each(function() {
        // On document load (or immediately), if images are cached (and hence
        // "loaded" before the document DOM), manually trigger their fading in.
        if (this.complete) {
          $(this).trigger('load');
        }
        else {
          $(this).css({ opacity: 0 });
        }
      });
    });

    // On load, fade it in. Relies on jQ 1.8+ to do vendor-prefix-free
    // transitions. The timer is there to ensure that this happens after
    // other JS logic that may be attached to the image.
    this.on('load', function() {
      var $image = $(this);
      $image.show().css({ opacity: 0 });
      setTimeout(function() {
        $image.css({ opacity: 1, transition: 'opacity 400ms linear' });
      }, 25);
    });

    return this;
  };
})(jQuery);
