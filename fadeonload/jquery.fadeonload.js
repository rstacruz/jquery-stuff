// Fades an image in on load.
//
//     $('.wallpaper img').fadeonload();
//
// The image doesn't have to be in the DOM at time of calling.
//
// It would be best if the image has `opacity: 0` in the CSS as well so there
// won't be a "flash of visible image".
//
(function($) {

  $.fn.fadeonload = function() {
    var $image = this;

    $(function() {
      $image.each(function() {
        var $image = $(this);

        if (this.complete) {
          $image.trigger('load');
        } else {
          $image.css({ opacity: 0 });
        }
      });
    });

    this.on('load', function() {
      var $image = $(this);

      $image
        .show()
        .css({ opacity: 0 });

      setTimeout(function() {
        $image.css({ opacity: 1, transition: 'opacity 400ms linear' });
      }, 25);
    });

    return this;
  };
})(jQuery);
