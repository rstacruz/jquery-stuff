/*! pseudoInput (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/pseudoinput */

// Makes a parent container react to the input inside it.
//
//     <div class='pseudoinput'>
//         <textarea>...</textarea>
//     </div>
//
// Now call:
//
//     $('.pseudoinput').pseudoInput();
//
// Possible uses
// -------------
//
// One use of this is to make fake text boxes, like so:
//
//     /* Basic styles: */
//     .pseudoinput { cursor: text; }
//     .pseudoinput textarea {
//         margin: 0; padding: 0;
//         border: 0; outline: 0;
//         background: transparent; box-shadow: none;
//      )
//
//     .pseudoinput { /* style me like an input field */ }
//     .pseudoinput:focus { /* ... */ }
//
// Another use
// -----------
//
// Or maybe to highlight the fieldset:
//
//     $('fieldset').pseudoInput();
//
// Now you can style `fieldset.focus`!

(function($) {

  $.fn.pseudoInput = function() {
    var $container = this;

    var input = ':input:visible:enabled';
    var selector = {
      container: $container.selector,
      inputs: $container.selector + ' ' + input
    };

    $(document).on('click.pseudoinput', selector.container, function(e) {
      if ($(e.target).is(input+ ', label, :input')) return;
      $(input, this).eq(0).focus();
    });

    $(document).on('focus.pseudoinput', selector.inputs, function() {
      $(this).closest(selector.container).addClass('focus');
    });

    $(document).on('blur.pseudoinput', selector.inputs, function() {
      $(this).closest(selector.container).removeClass('focus');
    });

    return $container;
  };

})(jQuery);
