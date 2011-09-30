;(function ($) {
  if (window.history.pushState) {
    $.navigate = function (href, silent) {
      window.history.pushState({ href: href }, "", href);
      if (silent !== true) {
        $(window).trigger('navigate', href);
      }
    };

    var loaded = false;

    window.onpopstate = function (e, state) {
      if (!loaded) { loaded = true; return; } // Skip the first load
      $(window).trigger('navigate', window.location.pathname);
    };
  }

  else {
    var skip = false;

    $.navigate = function (href, silent) {
      if (window.location.hash == '#!'+href) { return; }
      window.location.hash = "#!" + href;

      if (silent === true) {
        skip = true;
      }
    };

    $.hashListen('!(.*)', function (href) {
      if (skip) {
        skip = false;
      } else {
        $(window).trigger('navigate', href);
      }
    });
  };
})(jQuery);
