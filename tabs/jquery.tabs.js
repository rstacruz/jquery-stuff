/*! ---------------------------------------
 *  Tabs
 *  http://github.com/rstacruz/jquery-stuff
 * ---------------------------------------- */

// Simple tabs.
//
//   // All options are optional.
//   $(".tabbed").tabbed();
//
//   $(".tabbed").tabbed({
//     content: '.content',  /* Selector for content areas. */
//     links: '[href]',      /* Selector for tab links. */
//     active: 'active',     /* Classname for active tabs/content areas. */
//     activate: false       /* Activate the tabs on start. Default: false */
//   });
//
(function($) {
  $.fn.tabbed = function(options) {
    var defaults = {
      content: '> *:not(:first-child)',
      links: '[href]',
      active: 'active',
      activate: false
    };

    options || (options = {});
    options = $.extend({}, defaults, options);

    var self = $(this);

    // Selects the tab called `target` in the parent element `$parent`.
    function select($parent, target) {
      $parent.find(options.links)
        .removeClass(options.active)
        .filter("[href='#"+target+"']")
          .addClass(options.active);

      $parent.find(options.content).hide();
      $parent.find('#'+target).show();
    }

    // Register the click handler to delegate to the select() function.
    self.on("click", "[href]", function(e) {
      e.preventDefault();
      var target = $(this).attr('href').substr(1);
      var $parent = $(this).closest(self);
      select($parent, target);
    });

    // Activate the tabs if it's asked for.
    if (options.activate) {
      self.each(function() {
        var $parent = this;
        var $active = $parent.find(options.links).filter('.'+options.active);
        if ($active.length) {
          update($active.attr('href').substr(1));
        }
      });
    }
  };

})(jQuery);
