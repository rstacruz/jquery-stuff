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

    $select
      .on('change.selecttrap', function() {
        var val = $select.val();
        var opt = $select.find('[value='+val+']');
        $text.text(opt.text());
      })
      .trigger('change.selecttrap');
  };

})(jQuery);
