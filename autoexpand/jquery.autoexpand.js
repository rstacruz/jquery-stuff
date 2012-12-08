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
// Preferred usage
// ---------------
//
// For those that are multiline by default, this (below) works well. The extra
// padding makes it inviting to add more text.
//
//     $("#myform textarea").autoexpand({ extraLines: 1 });
//
// For multiline textboxes that masquerade as non-multilines, just use it as
// is.
//
//     $("#myform textarea").autoexpand();
//
// First based on: http://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js?r=2

(function($) {

  $.fn.autoexpand = function(options) {
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

    this.filter('textarea').each(function() {
      var $textarea = $(this);

      // Sanity check: don't apply the events more than once. If .autoexpand() is
      // called again, it will merely update the height as needed.
      if ($textarea.data('autoexpand')) {
        $textarea.trigger('autoexpand');
        return;
      }

      $textarea.data('autoexpand', true);

      // Create a 'shadow' div that has the same style as the original.
      var $shadow = $('<div class="autoexpand-shadow">').appendTo(document.body);

      // Disable the resize gripper, manually resizing will interfere with
      // the autoexpand logic
      $textarea.css({ 'resize': 'none' });
      if (options.scroll === false) {
        $textarea.css({ overflow: 'hidden' });
      }

      if (options.speed) {
        addTransition($textarea, 'height ' + options.speed + 'ms ease-in');
      }

      var minHeight, maxHeight, isFull;

      // The event handler that updates the 'shadow' div -- done on every
      // window resize to handle resizing of the textarea.
      var updateShadow = function() {
        // This determines how we set the width/height of the elements.
        isFull = ($textarea.css('box-sizing') === 'border-box');

        maxHeight = parseInt($textarea.css('max-height'), 10);
        if (isNaN(maxHeight)) maxHeight = null;

        minHeight = parseInt($textarea.css('min-height'), 10);
        if (options.useHeight) {
          var height = isFull ? $textarea.outerHeight() : $textarea.css('height');
          minHeight = Math.max(minHeight, parseInt(height, 10));
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
      };

      // The event handler for updates: update the 'shadow' box with the same
      // text and use its height for the textarea height.
      var updateHeight = function() {
        var val = htmlescape($textarea.val());
        if (options.extraLines > 0) val += times('<br/>&nbsp;', options.extraLines);

        $shadow.html(val);

        var height = isFull ? $shadow.outerHeight() : $shadow.css('height');
        if ((maxHeight) && (height >= maxHeight)) height = maxHeight;

        $textarea.css('height', height);

        // If you've reached your max-height, show the scrollbars.
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

      var updateAll = function() { updateShadow(); updateHeight(); };

      // Run the update immediately
      updateAll();

      // Bind things
      $textarea.on('change keyup', updateHeight);
      $(window).on('resize', updateAll);

      // Allow manually updating the height via `.trigger('autoexpand')`
      $textarea.on('autoexpand', updateAll);
    });

    return this;
  };

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
