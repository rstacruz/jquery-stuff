/*! jquery.hidpi (c) 2012, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/hidpi */

// Adds retina (High DPI) support to images.
//
// This example loads `hello.jpg` in most system's, but uses `hello@2x.jpg`
// on systems that support hi-DPI.
//
//     <img data-src="hello.jpg">
//
//     $(function() {
//       $('img[data-src]').hidpi();
//     });
//
// This also adds the `jQuery.support.hidpi` variable for checking for hidpi support in JS.
//
// Be sure to specify the dimensions of the image!
//
//     <img data-src="hello.jpg" width="40" height="40" alt="Hello">
//
// or you can do it in CSS... either way, the dimensions are required to be specified.
//
//     <img data-src="hello.jpg" class="hello">
//
//     img.hello { width: 40px; height: 40px; }
//
(function($, w, devicePixelRatio15) {
  $.support.hidpi = isHiDPI();

  $.fn.hidpi = function() {
    this.each(function() {
      var $img  = $(this);
      var src   = $(this).data('src');
      var hiSrc = src.replace(/\.[^\.]*$/, function(ext) { return "@2x" + ext; });

      $(this).attr('src', $.support.hidpi ? hiSrc : src);
    });
  };

  // Thanks https://github.com/imulus/retinajs/blob/master/src/retina.js
  // The repetitive parts of the string are put in a variable so JS compressors
  // can optimize them away.
  function isHiDPI() {
    var query =
      "(-webkit-min" + devicePixelRatio15 +
      "(min--moz" + devicePixelRatio15 +
      "(-ms-min" + devicePixelRatio15 +
      "(-o-min" + devicePixelRatio15 +
      "(min" + devicePixelRatio15 +
      "(min-resolution: 1.5dppx)";

    if (w.devicePixelRatio && w.devicePixelRatio > 1)
      return true;

    if (w.matchMedia && w.matchMedia(query).matches)
      return true;

    return false;
  }

})(jQuery, this, '-device-pixel-ratio: 1.5),');

