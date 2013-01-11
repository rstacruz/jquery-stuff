/*! placeholderpoly (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/placeholder_polyfill */

// Crappiest placeholder polyfill ever.
// Not as good as the others, but requires the least amount of effort.
//
// How to use:
//
//  * Just load it.
//
// Restrictions
//
//  * Passwords are silly.
//  * Placeholder disappears on focus.

(function($, placeholder) {
  var alreadySupported = (placeholder in document.createElement('input'));
  if (alreadySupported) return;

  $('['+placeholder+']').live(placeholder+':clear focus', function() {
    var $input = $(this);
    var place = $input.attr(placeholder);

    if ($input.val() === place) $input.removeClass(placeholder).val('');
  });

  $('['+placeholder+']').live(placeholder+':restore blur', function() {
    var $input = $(this);
    var place = $input.attr(placeholder);

    if ($input.val() === '') $input.addClass(placeholder).val(place);
  });

  $(function() {
    $('['+placeholder+']').trigger(placeholder+':restore');
  });
})(jQuery, 'placeholder');
