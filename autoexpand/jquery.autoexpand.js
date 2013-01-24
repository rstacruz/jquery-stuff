/*! autoexpand (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/autoexpand */

// Makes a textarea automatically grow as you type.
//
//     $("#myform textarea").autoexpand();
//
// The textarea does not exist at the time this is called. (However, see
// 'Caveats' below)
//
// You can define the maximum height via CSS's `max-height`. Autoexpand also
// respects CSS's `min-height` & `height`, and HTML's `rows` attribute.
//
// Basic usage
// -----------
//
// This is a sensible default:
//
//     $("textarea.autoexpand").autoexpand();
//
// Now add `.autoexpand` to your textareas.
//
// Suggested usage
// ---------------
//
// Personally, I prefer this variation:
//
//     $("textarea.autoexpand:not([rows='1'])").autoexpand({ extraLines: 1, speed: 100 });
//     $("textarea.autoexpand[rows='1']").autoexpand();
//
// This makes `<textarea rows=1>` behave like a normal `<input type=text>`,
// except that it automatically grows as needed.  This is much like Facebook's
// comments field. Use this for inputs that are meant to take just a single
// line.
//
// For other textareas, you get one extra line. This makes pressing Return on
// those textareas not feel awkward.
//
// Caveat
// ------
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

  var $shadow;

  $.fn.autoexpand = function(options) {
    var $this = this;

    options = $.extend({}, {
      extraLines: 0,     /* Extra padding (in number of lines) */
      preempt: true,     /* Preemptively add a new line before it reaches the end */
      preemptLength: 4,  /* Make a new line 4 letters before the end */
      throttle: 50,      /* Throttle the keydown updates */
      speed: 0           /* Fancyness. Be sure to add extraLines */
    }, options||{});

    // Transitions don't work well with the Enter key when there are no extraLines.
    if (options.speed > 0 && options.extraLines === 0) options.speed = 0;

    // The event handler that updates the 'shadow' div -- done on every
    // window resize to handle resizing of the textarea.
    var updateShadow = function() {
      var $textarea = $(this);

      // Sanity check: don't do anything if called prematurely
      if (!$textarea.length) return;

      // Lazy-create the shadow element if not available
      if (!$shadow) {
        $shadow = $('<div class="autoexpand-shadow">').appendTo(document.body);
      }

      // Initialize CSS for textarea
      if (!$textarea.data('autoexpand')) initTextarea($textarea);

      // Get the min-height. This takes `rows`, `min-height` and `height` into
      // consideration (thanks, browsers)
      var isFull = ($textarea.css('box-sizing') === 'border-box');
      var height = isFull ? $textarea.outerHeight() : $textarea.css('height');
      var minHeight = Math.max(minHeight, int(height));

      $shadow.css({
        position:  'absolute',
        top:        -10000,
        left:       -10000,
        zIndex:     -100,
        width:      isFull ? $textarea.outerWidth() : $textarea.css('width'),
        minHeight:  minHeight,
        visibility: 'hidden',
        resize:     'none',
        borderColor: 'red', /* [1] */
        borderStyle: 'solid'
      });

      var props = ['fontFamily', 'fontSize', 'lineHeight', 'boxSizing', 'paddingTop',
      'paddingBottom', 'paddingLeft', 'paddingRight', 'wordWrap', 'whiteSpace',
      'textWrap', 'borderWidth'];

      for (var i=0; i<props.length; i++) {
        var prop = props[i];
        $shadow.css(prop, $textarea.css(prop));
      }

      // [1] = The 'border' doesn't quite capture 'solid 0px transparent' so we'll emulate it

      $shadow.textarea = $textarea;

      return $shadow;
    };

    var initTextarea = function($textarea) {
      $textarea.data('autoexpand', true);

      // Disable the resize gripper, manually resizing will interfere with
      // the autoexpand logic
      $textarea.css({ resize: 'none', overflow: 'hidden' });

      if (options.speed) {
        addTransition($textarea, 'height ' + options.speed + 'ms ease-in');
      }
    };

    var updateHeight = function() {
      var $textarea = $(this);

      // Sanity check: don't do anything if called prematurely
      if (!$textarea.length) return;

      if (!$shadow || !$shadow.textarea.is($textarea)) updateShadow.apply(this);

      // Build the value for the shadow. (preempt uses 'w' because it's the
      // widest in most fonts)
      var val = htmlescape($textarea.val());
      if (options.preempt) val += ' ' + times('w', options.preemptLength);
      if (options.extraLines > 0) val += times('<br/>&nbsp;', options.extraLines);

      $shadow.html(val);

      var isFull = ($textarea.css('box-sizing') === 'border-box');

      var height = isFull ? $shadow.outerHeight() : $shadow.css('height');
      var maxHeight = int($textarea.css('max-height'));
      if ((maxHeight) && (height >= maxHeight)) height = maxHeight;

      console.log('Height=', height, ' full=', isFull, ' heights=[', $shadow.outerHeight(), '/', $shadow.css('height'));
      $textarea.css('height', height);

      // If we've reached your max-height, show the scrollbars
      if (maxHeight !== null) {
        if (height === maxHeight) {
          $textarea.css({ 'overflow-y': 'auto' });
        } else {
          $textarea.css({ 'overflow-y': 'hidden' });
        }
      }
    };

    var updateAll = function() { updateShadow.apply(this); updateHeight.apply(this); };

    // Bind events.
    $(document).on('focus', this.selector, updateAll);
    $(document).on('input change', this.selector, throttle(updateHeight, options.throttle));
    $(window).on('resize', function() { $this.each(updateAll); });

    // Allow manually updating the height via `.trigger('autoexpand')`
    $(document).on('autoexpand', this.selector, updateAll);

    // Trigger immediately
    $(function() { $this.each(updateAll); });

    return this;
  };

  // Converts a string (like "32px") to integer.
  function int(str) {
    var i = parseInt(str, 10);
    return isNaN(i) ? null : i;
  }

  function throttle(fn, speed) {
    return (speed && window._ && window._.throttle) ?
      window._.throttle(fn, speed) :
      fn;
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
