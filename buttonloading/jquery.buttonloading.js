/*! jQuery.buttonLoading (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/buttonloading */

// Show 'loading...' text on buttons.
//
// Quick setup
// -----------
//
// Add a `data-loading-text` attribute to your buttons:
//
//     <button type='submit' data-loading-text='Saving...'>Save</button>
//
// Now toggle the state using:
//
//     $('button').showButtonLoading();
//     $('button').hideButtonLoading();
//
// Recommended usage
// -----------------
// 
// You can activate this automatically:
//
//     $('form').on('submit', function() {
//       this.find(':submit').showButtonLoading();
//     });
//
// How it works
// ------------
//
// This swaps the text with the given loading text, disables the button, and
// adds a the `loading` class.

(function($) {
  $.fn.toggleButtonLoading = function() {
    return this.is(':disabled') ?
      this.hideButtonLoading() :
      this.showButtonLoading();
  };

  $.fn.showButtonLoading = function() {
    var $button = this;
    var label;

    // Sanity check
    if ($button.is(':disabled')) return;

    // Get the alt label
    var alt = $button.data('loadingText');

    // Swap
    if ($button.is('input')) {
      label = $button.attr('value');
      $button.attr('value', alt);
    } else {
      label = $button.html();
      $button.html(alt);
    }

    // Save the old
    $button.data('originalText', label);

    // Attr
    $button.attr('disabled', true);
    $button.addClass('loading');

    return this;
  };

  $.fn.hideButtonLoading = function() {
    var $button = this;

    // Sanity check
    if (!$button.is(':disabled')) return;

    // Get the alt label
    var alt = $button.data('originalText');

    // Swap
    if ($button.is('input')) {
      $button.attr('value', alt);
    } else {
      $button.html(alt);
    }

    // Attr
    $button.removeAttr('disabled');
    $button.removeClass('loading');

    return this;
  };
})(jQuery);
