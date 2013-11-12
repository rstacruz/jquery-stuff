/*! jQuery.toggleable (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/toggleable */

// Requires jQuery 1.7+.
//
// Makes a certain element a toggle-to-activate thing. Clicking the button
// (the selector defined in `using`) will toggle the 'active' class for both
// the button and the parent element.
//
//     $(document).toggleable('nav.dropdown', { using: "a.button", [options] });
//
// When using with `$(document)`, it's preferable /not/ to put this inside a
// `$(function() { ... })` block. Toggleable will create delegate events.
//
// Options:
//
// - `sticky` - Defaults to false.
// - `modal` - Close others when this is opened. Defaults to true.
// - `clickout` - Allow clicking away. Default to true.

(function($) {
  var defaults = {
    modal: true,
    clickout: true,
    using: null,
    event: "click"
  };

  $.fn.toggleable = function(parent, options) {
    var $context = this;

    // Normalize arguments
    if (arguments.length === 0) { parent = null; options = {}; }
    if (typeof parent === 'object') { options = parent; parent = null; }
    options = $.extend({}, defaults, options || {});

    var button = (parent || '') + ' ' + options.using;
    var click = options.event;

    $context.on('toggle:off.toggleable', parent, function () {
      $(this).removeClass('active');
      $(options.using, this).removeClass('active');
    });

    $context.on('toggle:on.toggleable', parent, function () {
      $(this).addClass('active');
      $(options.using, this).addClass('active');
    });

    // Button
    $context.on(click+'.toggleable', button, function (e) {
      // Prevent the body handler from working.
      e.preventDefault();
      var $a = $(this);

      if ($a.is('.active')) {
        $a.closest(parent||$context).trigger('toggle:off');
      } else {
        // Clear out any other popup first.
        if (options.modal) { $(document).trigger('toggle:clear'); }
        $a.closest(parent||$context).trigger('toggle:on');
      }
      e.stopPropagation();
    });

    if (options.clickout) {
      $(document).on(click+'.toggleable toggle:clear.toggleable', function (e) {
        // If sticky is true, don't dismiss the popup when the menu items
        // are clicked.
        if (options.sticky) {
          var isMenuItem = $(e.target).closest(parent||$context).length > 0;
          if (isMenuItem) return;
        }

        $find(parent, $context).trigger('toggle:off');
      });
    }

    return this;
  };

  function $find (child, parent) {
    if (!child) return parent;
    return $(child, parent);
  }

})(jQuery);
