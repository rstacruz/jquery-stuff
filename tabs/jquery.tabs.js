// Simple tabs.
//
//   // All options are optional.
//   $(".tabbed").tabbed();
//
//   $(".tabbed").tabbed({
//     content: '.content',
//     links: '[href]'
//   });
//
// http://github.com/rstacruz/jquery-stuff
//
(function($) {
  $.fn.tabbed = function(options) {
    var defaults = {
      content: '> *:not(:first-child)',
      links: '[href]',
      active: 'active'
    };

    options || (options = {});
    options = $.extend({}, defaults, options);

    var self = this;

    function update(target) {
      self.find(options.links)
        .removeClass(options.active)
        .filter("[href='#"+target+"']")
          .addClass(options.active);

      self.find(options.content).hide();
      self.find('#'+target).show();
    }

    this.on("click", "[href]", function(e) {
      e.preventDefault();
      var target = $(this).attr('href').substr(1);
      update(target);
    });

    var $active = self.find(options.links).filter('.'+options.active);
    if ($active.length) {
      update($active.attr('href').substr(1));
    }
  };

})(jQuery);
