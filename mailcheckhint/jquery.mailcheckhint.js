/*! mailcheckhint (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/mailcheckhint */

// Simple one-shot integration for Mailcheck.js.
// Requires Mailcheck: https://github.com/Kicksend/mailcheck
//
// Appends a <span class='hint'> after the <input> when there's a suggestion.
// The hint is clickable, and when you click it, it accepts the suggested email.
//
// Usage:
//
//     $('input.email').enableMailcheckHint();
//
// Customization can be done with all these optional args:
//
//     $('input.email').enableMailcheckHint({
//       message: 'Ibig mo bang sabihin ay %{email}?',
//       hintElement: '<div class="hinttext">',
//       append:  function($input, $hint) { $input.closest('.field').append($hint); },
//       dismiss: function($input, $hint) { $hint.remove(); $input.addClass('ok'); }
//     });
//
// There's also macros to make mailcheck easier to configure:
//
//     $.mailcheck.addDomains(['rocketmail.com', 'yahoo.com.in']);
//     $.mailcheck.addTLDs('ph com.ph net.ph org.ph'); /* Auto-split the string */
//
(function ($) {
  $.mailcheck = {
    addDomains: function(more) {
      if (typeof more === 'string') more = more.split(' ');
      Kicksend.mailcheck.defaultDomains =
        Kicksend.mailcheck.defaultDomains.concat(more);
    },
    addTLDs: function(more) {
      if (typeof more === 'string') more = more.split(' ');
      Kicksend.mailcheck.defaultTopLevelDomains =
        Kicksend.mailcheck.defaultTopLevelDomains.concat(more);
    },
    disableTLDs: function() {
      Kicksend.mailcheck.defaultTopLevelDomains = [];
    }
  };

  $.fn.enableMailcheckHint = function(options) {
    var $hint;
    var $input = $(this);

    var defaults = {
      message: "Did you mean %{email}?",
      hintElement: "<span class='hint mailcheck-hint'>",
      append:  function($input, $hint) { $hint.hide(); $input.after($hint); $hint.slideDown(250); },
      dismiss: function($input, $hint) { $hint.slideUp(250, function() { $hint.remove(); }); }
    };

    options = $.extend({}, defaults, (options || {}));

    $input.on('blur', function() {
      var $input = $(this);

      $input.mailcheck({
        suggested: function(el, suggestion) {
          // Create element
          if ($hint) $hint.remove();
          $hint = $(options.hintElement);

          // Construct message
          var msg = options.message;
          msg = msg.replace("%{email}", [
            "<a class='mailcheck-email-address' href='mailto:",
            suggestion.full,
            "'>",
            "<span class='mailcheck-user'>",
            suggestion.address,
            "</span>",
            "<span class='mailcheck-at'>@</span>",
            "<strong class='mailcheck-domain'>",
            suggestion.domain,
            "</strong></a>"
          ].join(''));
          $hint = $hint.html(msg);

          // Add handler
          $hint.on('click', function(e) {
            // Save focus
            var $focus = $(':focus');

            // Accept suggestion
            e.preventDefault();
            $input.val(suggestion.full);
            options.dismiss($input, $hint);
            $hint = null;

            // Restore focus
            $focus.focus();
          });

          // Show
          options.append($input, $hint);
        },

        empty: function(element) {
          if ($hint) {
            options.dismiss($input, $hint);
            $hint = null;
          }
        }
      });
    });
  };
})(jQuery);
