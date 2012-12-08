/*! fadeonload (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/fadeonload */

// Fades an image in on load.
//
//     $('.wallpaper img').fadeonload();
//
// The image doesn't have to be in the DOM at time of calling.
//
(function($) {
  function addStyles(styles) {
    $('head').append($("<style type='text/css'>").html(styles));
  }

  $.fn.fadeonload = function() {
    var $image = this;

    // Ensure that the image begins with 0 opacity by adding a new stylesheet.
    // Note that this will not work for things like `$(".foo").children()`
    addStyles(this.selector + " { opacity: 0; }");

    // On load, fade it in. Relies on jQ 1.8+ to do vendor-prefix-free
    // transitions.
    this.on('load', function() {
      $(this).css({ opacity: 1, transition: 'opacity 400ms linear' });
    });

    // On document load (or immediately), if images are cached (and hence
    // "loaded" before the document DOM), manually trigger their fading in.
    $(function() {
      $image.each(function() {
        if (this.complete) $(this).trigger('load');
      });
    });

    return this;
  };
})(jQuery);
