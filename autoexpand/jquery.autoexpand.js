/*! autoexpand (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/autoexpand */

// Makes a textarea automatically grow as you type.
//
//     $("#myform textarea").autoexpand();
//
// The textarea *must* exist at the time this is called.
//
// Also, you can define the minimum height via CSS's `min-height`.
//
// Suggested usage
// ---------------
//
// This is a sensible default:
//
//     $("textarea.autoexpand").autoexpand({ extraLines: 1 });
//     $("textarea.autoexpand-single").autoexpand();
//
// Make your multiline textareas `.autoexpand`. The extra padding makes it
// inviting to type more text in.
//
// For single-line textareas, add `.autoexpand-single` to them. This is for
// textareas that are just one-line high but are supposed to expand to more
// lines, like the Facebook comments area.
//
// If you're going to create these textareas dynamically, or update their
// content dynamically, you'll need to retrigger the autoexpand event to resize
// it as needed.
//
//     $("textarea").trigger('autoexpand');
//
// Acknowledgements
// ----------------
//
// First based on:
// http://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js?r=2

(function($) {

  $.fn.autoexpand = function(options) {
    var $this = this;

    var defaults = {
      extraLines: 0,     /* Extra padding (in number of lines) */
      scroll: false,     /* Hide scrollbars if false (default). Set to `true` to leave scrollbars alone. */
      useHeight: true,   /* Base the minimum height to the current `height` attribute. `false` to disable. */
      speed: 100         /* Fancyness, set to `0` to disable */
    };

    if (!options) options = {};
    options = $.extend({}, defaults, options);

    // Disable speed if extraLines = 0. With no extra padding, it will look
    // weird, no matter what.
    if (options.extraLines === 0) options.speed = 0;

    // The event handler that updates the 'shadow' div -- done on every
    // window resize to handle resizing of the textarea.
    var updateShadow = function() {
      var $textarea = $(this);

      // Sanity check: don't do anything if called prematurely
      if (!$textarea.length) return;

      var $shadow = $textarea.data('shadow');

      // Create the shadow element if not available
      if (!$shadow) {
        $shadow = $('<div class="autoexpand-shadow">').appendTo(document.body);
        initTextarea($textarea);
        $textarea.data('shadow', $shadow);
      }

      // This determines how we set the width/height of the elements
      var isFull = ($textarea.css('box-sizing') === 'border-box');

      var minHeight = int($textarea.css('min-height'));
      if (options.useHeight) {
        var height = isFull ? $textarea.outerHeight() : $textarea.css('height');
        minHeight = Math.max(minHeight, int(height));
      }

      $shadow.css({
        position:  'absolute',
        top:        -10000,
        left:       -10000,
        zIndex:     -100,
        width:      isFull ? $textarea.outerWidth() : $textarea.css('width'),
        minHeight:  minHeight,
        font:       $textarea.css('font'),
        boxSizing:  $textarea.css('box-sizing'),
        border:     $textarea.css('border'),
        padding:    $textarea.css('padding'),
        wordWrap:   $textarea.css('word-wrap'),
        whiteSpace: $textarea.css('white-space'),
        visibility: 'hidden',
        resize:     'none'
      });

      return $shadow;
    };

    var initTextarea = function($textarea) {
      // Disable the resize gripper, manually resizing will interfere with
      // the autoexpand logic
      $textarea.css({ 'resize': 'none' });
      if (options.scroll === false) {
        $textarea.css({ overflow: 'hidden' });
      }

      if (options.speed) {
        addTransition($textarea, 'height ' + options.speed + 'ms ease-in');
      }
    };

    var updateHeight = function() {
      var $textarea = $(this);

      // Sanity check: don't do anything if called prematurely
      if (!$textarea.length) return;

      // Get or build the shadow
      var $shadow = $textarea.data('shadow') || updateShadow.apply(this);

      // Build the value for the shadow
      var val = htmlescape($textarea.val());
      if (options.extraLines > 0) val += times('<br/>&nbsp;', options.extraLines);

      $shadow.html(val);

      // This determines how we set the width/height of the elements
      var isFull = ($textarea.css('box-sizing') === 'border-box');

      // Find the target height
      var height = isFull ? $shadow.outerHeight() : $shadow.css('height');
      var maxHeight = int($textarea.css('max-height'));
      if ((maxHeight) && (height >= maxHeight)) height = maxHeight;

      $textarea.css('height', height);

      // If we've reached your max-height, show the scrollbars
      if ((maxHeight !== null) && (scroll === false)) {
        if (height === maxHeight) {
          $textarea.css({ 'overflow-y': 'auto' });
        } else {
          $textarea.css({ 'overflow-y': 'hidden' });
        }
      }
    };

    // Underscore.js bonus! If underscore.js is available, don't call the updating logic
    // too often to improve performance for fast typers.
    if (typeof window._ === 'function' && typeof _.throttle === 'function') {
      updateHeight = _.throttle(updateHeight, 25);
      updateShadow = _.throttle(updateShadow, 25);
    }

    var updateAll = function() { updateShadow.apply(this); updateHeight.apply(this); };

    // Bind events. Need to use `.live` instead of `.on` because if there are
    // matches during its existence, it will not match future elements that may
    // appear later.
    this.live('change keyup focus', updateHeight);
    $(window).on('resize', function() { $this.each(updateAll); });

    // Allow manually updating the height via `.trigger('autoexpand')`
    this.live('autoexpand', updateAll);

    // Trigger immediately
    $(function() { $this.each(updateAll); });

    return this;
  };

  // Converts a string (like "32px") to integer.
  function int(str) {
    var i = parseInt(str, 10);
    return isNaN(i) ? null : i;
  }

  // Escapes a `string` to HTML entities.
  function htmlescape(string) {
    return string
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/\n$/, '<br/>&nbsp;')
      .replace(/\n/g, '<br/>')
      .replace(/ {2,}/g, function(space) { return times('&nbsp;', space.length -1) + ' '; });
  }

  // Repeats a `string` a `number` of times.
  function times(string, number) {
    var re = '';
    for(var i = 0; i < number; i++) { re = re + string; }
    return re;
  }

  // Adds a transition `transition` to element `$el`.
  function addTransition($el, transition) {
    var value = $el.css('transition');
    if (value.length) value += ', ';
    value += transition;
    return $el.css({ transition: value });
  }

})(jQuery);
