(function($) {

  // Makes a certain element a toggle-to-activate thing. Clicking the button
  // (the selector defined in `using`) will toggle the 'active' class for both
  // the button and the parent element.
  //
  //     $("nav.dropdown").toggleable({ using: "a.button", [sticky: true] });
  //
  // http://github.com/rstacruz/jquery-stuff
  //
  $.fn.toggleable = function(options) {
    options || (options = {});

    var $parent = this;
    var $button = $(options.using, this);

    $parent.on('active:off', function() {
      $button.removeClass('active');
      $parent.removeClass('active');
    });

    $parent.on('active:on', function() {
      $button.addClass('active');
      $parent.addClass('active');
    });

    $button.on('click', function(e) {
      // Prevent the body handler from working.
      e.preventDefault();
      e.stopPropagation();

      if ($parent.is('.active')) {
        $parent.trigger('active:off');
      } else {
        // Clear out any other popup first.
        $('body').trigger('click');
        $parent.trigger('active:on');
      }
    });

    $('body').on('click', function(e) {
      // If sticky is true, don't dismiss the popup when the menu items
      // are clicked.
      if (options.sticky) {
        var isMenuItem = $(e.target).closest($parent).length > 0;
        if (isMenuItem) return;
      }

      $parent.trigger('active:off');
    });
  };

})(jQuery);
