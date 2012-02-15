(function($) {

  // Makes a certain element a toggle-to-activate thing. Clicking the button
  // (the selector defined in `using`) will toggle the 'active' class for both
  // the button and the parent element. Great for toggle menus.
  //
  //     $("nav.dropdown").toggleable({ using: "a.button", [sticky: true] });
  //
  // http://github.com/rstacruz/jquery-stuff
  //
  $.fn.toggleable = function(options) {
    options || (options = {});

    var $parent = this;
    var $button = $(options.using, this);

    $button.live('click', function(e) {
      // Prevent the body handler from working.
      e.preventDefault();
      e.stopPropagation();

      if ($parent.is('.active')) {
        $button.removeClass('active');
        $parent.removeClass('active');
      } else {
        // Clear out any other popup first.
        $('body').trigger('click');
        $button.addClass('active');
        $parent.addClass('active');
      }
    });

    $('body').live('click', function(e) {
      // If sticky is true, don't dismiss the popup when the menu items
      // are clicked.
      if (options.sticky) {
        var isMenuItem = $(e.target).closest($parent).length > 0;
        if (isMenuItem) return;
      }

      $button.removeClass('active');
      $parent.removeClass('active');
    });
  };

})(jQuery);
