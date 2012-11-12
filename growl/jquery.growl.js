/*! jQuery.growl (c) 2010-12, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/growl */

// Usage:
//
//   $.growl("Message");
//   $.growl({message: "Message"});
//   $.growl({message: "Message", sticky: true, timeout: 10000, id: 'thnth', class: 'error'}); // Not impl yet
//   $.growl.kill(); // Hide all
//
// Todo:
//  - coallescing
//
;(function($) {
  $.growl = function(message) {
    return $.growl.showMessage(message);
  };

  $.extend($.growl, {
    // Options
    id: "growl",
    timeout: 5000,
    id_prefix: "growl-notification-",

    // State
    $notifs: null,

    // Construct the html. Override me if you like.
    buildHtml: function(options) {
      if (options.message && options.title) {
        return "<div class='item'><h3>"+options.title+"</h3><p>"+options.message+"</p><button class='close'></button></div>";
      } else {
        return "<div class='item'><p>"+options.message+"</p><button class='close'></button></div>";
      }
    },

    showMessage: function(args) {
      // Alias for $.growl('message').
      if (typeof args == "string")
        { return $.growl.showMessage({ 'message': args }); }

      if ((typeof args != "object") ||
          (args.message === undefined))
        { return; }

      var message = args.message;
      var self = this;

      // Build the container for messages.
      if (!self.$notifs) {
        self.$notifs = $("<div id='" + self.id + "'><div class='items'></div></div>");
        $(document.body).append(self.$notifs);
      }

      // Build the HTML.
      var html = $.growl.buildHtml(args);

      // Construct the item.
      var item = $(html);
      if (args.classname) { item.addClass(args.classname); }

      item.find('.close').click(function() {
        self._killItem(item);
      });

      // Either replace the old item (coallesce), or add the new item.
      var id = args.id ? (this.id_prefix + args.id) : null;
      var $old = args.id ? $("#"+id) : [];
      if ($old.length > 0) {
        // Replace the old item with the new one.
        $old.html(item.html());
        $old.attr('class', item.attr('class'));
        item = $old;
      }
      else {
        // Add the new item.
        item.attr('id', id);
        self.$notifs.find('.items').prepend(item);
      }

      self.addTimer(item, args);
    },

    addTimer: function($item, args) {
      var self = this;

      // Clear a timeout, if there is one.
      var timer = $item.data('growl-timer');
      if (timer) { window.clearTimeout(timer); }

      // Add a timeout.
      if (args.sticky !== true) {
        timer = window.setTimeout(function() {
          self._killItem($item);
        }, args.timeout || self.timeout);
        $item.data('growl-timer', timer);
      }
    },

    kill: function() {
      var self = this;
      self.$notifs.find('.items > *').each(function() {
        self._killItem($(this));
      });
    },

    _killItem: function($item) {
      $item = $($item);
      $item.slideUp(function() { $(this).remove(); });
    }
  });
})(jQuery);
