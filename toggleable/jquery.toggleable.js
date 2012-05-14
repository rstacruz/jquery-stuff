// Makes a certain element a toggle-to-activate thing. Clicking the button
// (the selector defined in `using`) will toggle the 'active' class for both
// the button and the parent element.
//
//     $("nav.dropdown").toggleable({ using: "a.button", [sticky: true] });
//
// http://github.com/rstacruz/jquery-stuff
//
(function($) {
  $.fn.toggleable = function(options) {
    options || (options = {});

    var $menus = this;
    var button = options.using;

    $menus.on('active:off', function() {
      $(this)
        .removeClass('active')
        .find(button).removeClass('active');
    });

    $menus.on('active:on', function() {
      $(this)
        .addClass('active')
        .find(button).addClass('active');
    });

    // Button
    $menus.on('click', button, function(e) {
      // Prevent the body handler from working.
      e.preventDefault();
      e.stopPropagation();

      if ($(this).is('.active')) {
        $(this).closest($menus).trigger('active:off');
      } else {
        // Clear out any other popup first.
        $('body').trigger('click');
        $(this).closest($menus).trigger('active:on');
      }
    });

    $('body').on('click', function(e) {
      // If sticky is true, don't dismiss the popup when the menu items
      // are clicked.
      if (options.sticky) {
        var isMenuItem = $(e.target).closest($menus).length > 0;
        if (isMenuItem) return;
      }

      $menus.trigger('active:off');
    });
  };

})(jQuery);
