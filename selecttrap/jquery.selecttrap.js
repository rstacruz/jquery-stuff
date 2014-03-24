/*! jQuery selecttrap -- https://github.com/rstacruz/jquery-stuff
    (c) 2013, Rico Sta. Cruz, MIT licensed */

;(function($) {

  /**
   * Traps a selectbox in a wrapper, effectively allowing you to "skin" how it
   * looks like.
   * 
   *     $("select").selecttrap();
   */

  $.fn.selecttrap = function(options) {
    if (!options) options = {};

    $(this).each(function() {
      var $select = $(this);

      // Don't reapply
      if ($select.parent().is('.selecttrap')) return;

      // Initialize box
      var $box = $select
        .wrap('<div class="selecttrap">')
        .closest('div')
        .addClass(options['class'])
        .addClass($select.attr('class'));

      // Initialize artifacts
      var $text = $('<div class="st-text"></div>')
        .appendTo($box)
        .after('<div class="st-arrow">');

      // Change the placeholder text when the <select> is changed
      $select
        .on('change.selecttrap selecttrap:update', function() {
          var val = $select.val() || '';
          var opt = $select.find('[value="'+val.replace(/"/, '\\"')+'"]');
          $text.text(opt.length ? opt.text() : val);
        })
        .trigger('change.selecttrap');

      // Inherit disabledness
      if ($select.is(':disabled'))
        $box.addClass('disabled');

      // Hover tracking
      $select
        .on('mouseover.selecttrap mouseenter.selecttrap', function() {
          $box.addClass('hover');
        })
        .on('mouseout.selecttrap mouseleave.selecttrap', function() {
          $box.removeClass('hover');
        });

      // Focus tracking
      $select
        .on('focus.selecttrap', function() {
          $box.addClass('focus');
        })
        .on('blur.selecttrap', function() {
          $box.removeClass('focus');
        });
    });
  };

})(jQuery);
