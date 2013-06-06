/*! jQuery selecttrap -- https://github.com/rstacruz/jquery-stuff
    (c) 2013, Rico Sta. Cruz, MIT licensed */

;(function($) {

  /**
   * Traps a selectbox in a wrapper, effectively allowing you to "skin" how it
   * looks like.
   */

  $.fn.selecttrap = function(options) {
    if (!options) options = {};
    var $select = $(this);

    // Initialize box
    var $box = $select
      .wrap('<div class="selecttrap">')
      .closest('div')
      .addClass(options['class']);

    // Initialize artifacts
    var $text = $('<div class="st-text"></div>')
      .appendTo($box)
      .after('<div class="st-arrow">');

    // Change the placeholder text when the <select> is changed
    $select
      .on('change.selecttrap', function() {
        var val = $select.val();
        var opt = $select.find('[value="'+val.replace(/"/, '\\"')+'"]');
        $text.text(opt.length ? opt.text() : val);
      })
      .trigger('change.selecttrap');
  };

})(jQuery);
