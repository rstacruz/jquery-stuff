/*! jQuery.toggleable (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/toggleable */

// Requires jQuery 1.7+.
//
// Makes a certain element a toggle-to-activate thing. Clicking the button
// (the selector defined in `using`) will toggle the 'active' class for both
// the button and the parent element.
//
//     $("nav.dropdown").toggleable({ using: "a.button", [options] });
//
// Options:
//
// - `sticky` - Defaults to false.
// - `modal` - Close others when this is opened. Defaults to true.
// - `clickout` - Allow clicking away. Default to true.

(function($) {
  $.fn.toggleable = function(options) {
    if (!options) options = {};

    if (typeof options.modal === 'undefined') options.modal = true;
    if (typeof options.clickout === 'undefined') options.clickout = true;
    var $menus = this;
    var button = options.using;

    $(document).on('active:off.toggleable', $menus.selector, function() {
      $(this)
        .removeClass('active')
        .find(button).removeClass('active');
    });

    $(document).on('active:on.toggleable', $menus.selector, function() {
      $(this)
        .addClass('active')
        .find(button).addClass('active');
    });

    // Button
    $(document).on('click.toggleable', $menus.find(button).selector, function(e) {
      // Prevent the body handler from working.
      e.preventDefault();
      e.stopPropagation();

      var $a = $(this);
      if ($a.is('.active')) {
        $a.closest($menus.selector).trigger('active:off');
      } else {
        // Clear out any other popup first.
        if (options.modal) { $('body').trigger('click.toggleable'); }
        $(this).closest($menus.selector).trigger('active:on');
      }
    });

    $(document).on('click.toggleable', function(e) {
      if (!options.clickout) return;

      // If sticky is true, don't dismiss the popup when the menu items
      // are clicked.
      if (options.sticky) {
        var isMenuItem = $(e.target).closest($menus.selector).length > 0;
        if (isMenuItem) return;
      }

      $($menus.selector).trigger('active:off');
    });

    return this;
  };

})(jQuery);
