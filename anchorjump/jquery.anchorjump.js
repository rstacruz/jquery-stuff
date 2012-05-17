/*! ---------------------------------------
 *  Anchorjump
 *  http://github.com/rstacruz/jquery-stuff
 * ---------------------------------------- */

// Makes anchor jumps happen with smooth scrolling.
//
//    $("#menu a").anchorjump();
//    $("#menu a").anchorjump({ offset: -30 });
//
//    // Via delegate:
//    $("#menu").anchorjump({ for: 'a', offset: -30 });

(function($) {
  $.fn.anchorjump = function(options) {
    var defaults = {
      speed: 500,
      offset: 0,
      for: null
    };

    options = $.extend({}, defaults, options);

    if (options['for']) {
      this.on('click', options['for'], onClick);
    } else {
      this.on('click', onClick);
    }

    function onClick(e) {
      var $a = $(e.target).closest('a');
      if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

      e.preventDefault();
      var href = $a.attr('href');
      var $area = $(href);

      $('body').animate({ scrollTop: $area.offset().top + options.offset }, options.speed);

      // Add the location hash via pushState.
      if (window.history.pushState) {
        window.history.pushState({ href: href }, "", href);
      }
    };
  };
})(jQuery);
