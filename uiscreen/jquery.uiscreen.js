// Usage:
//
//   $("#element").screen();
//   $("#element").unscreen();
//   $.unscreen(); // remove all screens
//
;(function($) {
  function resetPosition($screen, $el) {
    $screen
      .css({
        'top':    $el.position().top + parseInt($el.css('margin-top')),
        'left':   $el.position().left  + parseInt($el.css('margin-left')),
        'position': 'absolute',
        'width':  $el.outerWidth(),
        'height': $el.outerHeight()
      });
  };

  $.uiscreen = $.extend(function(el) {
    $.uiscreen.activate(el);
  }, {
    // State
    $screens: [],

    // Options
    background: '#555555',
    opacity: 0.5,
    screen_template: "<div class='uiscreen'><div class='uiscreen-spinner'></div></div>",
    z_index: 10010,
    fadein_time: 250,
    fadeout_time: 0,

    // Methods
    activate: function(el, options) {
      var $el = $(el);
      if ($(el).length === 0) { return false; }

      if (!options) { options = {}; }

      var id = "uiscreen-for-" + ($el.attr('id') ? $el.attr('id') : 'noid');

      var $screen = this.$screen($el);
      if (options['class']) { $screen.addClass(options['class']); }

      $screen.css({ 'opacity': this.opacity });
      resetPosition($screen, $el);

      $el.offsetParent().append($screen);
      $screen
        .data('parent', $el)
        .attr('id', id)
        .addClass('fadein')
        .show()
        .animate(
          { 'opacity': this.opacity },
          this.fadein_time,
          function() {
            $(this).removeClass('fadein');
          });
    },

    kill: function(el, options) {
      var $el     = $(el);

      if (!$el.data('$screen')) {
        return;
      }

      var speed = (options && (options.speed != undefined)) ? options.speed : this.fadeout_time;

      $el.data('$screen')
        .addClass('fadeout')
        .animate(
          { 'opacity': 0 },
          speed,
          function() {
            $(this).remove();
          });

      $el.data('$screen', null);
    },

    // Return the screen for a certain element
    $screen: function($el) {
      if ($el.data('$screen')) { return $el.data('$screen'); }

      // Construct the screen.
      var $screen =
        $(this.screen_template).
          css({
            'position': 'absolute',
            'margin': 0,
            'padding':0,
            'border': 0,
            'top':    0,
            'left':   0,
            'width':  1,
            'height': 1,
            'z-index': this.z_index
          })
          .hide();

      if (this.background)
        { $screen.css({ 'background': this.background }); }

      $(document.body).append($screen);
      this.$screens.push($screen);

      $el.data('$screen', $screen);
      return $screen;
    }
  });

  $.unscreen = function(options) {
    var $parents = $('');
    for (i in $.uiscreen.$screens) {
      var screen = $.uiscreen.$screens[i];
      var $parent = screen.data('parent');
      if (($parent) && ($parent.unscreen)) { $parent.unscreen(options); }
    }
  };

  $.fn.screen = function(options) {
    this.each(function() {
      $.uiscreen.activate($(this), options);
    });
    return this;
  };

  $.fn.unscreen = function(options) {
    this.each(function() {
      $.uiscreen.kill($(this), options);
    });
    return this;
  };

  // Make sure that all uiscreens hug their parents, literally
  $.uiscreen.autoresize = function() {
    var $parents = $('');
    for (i in $.uiscreen.$screens) {
      var screen = $.uiscreen.$screens[i];
      var $parent = screen.data('parent');
      if ($parent) { resetPosition($(screen), $parent); }
    }
  };

  $(window).resize(function () {
    $.uiscreen.autoresize();
  });
})(jQuery);
