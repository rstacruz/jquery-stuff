// Usage:
//
//   $.hashListen(function(newhash) {
//     alert("Changed to " + newhash);
//   });
//
//   $.hashListen("/go/:id/:action", function(id, action) {
//     alert("You requested for person " + id + " (" + action + ")");
//     // Also: this.referrer, this.matches, this.hash
//   });
//
;(function ($) {
  // Thanks http://benalman.com/projects/jquery-hashchange-plugin/
  var docMode = document.documentMode;
  var supportsOnhashchange = 'onhashchange' in window && (docMode === undefined || docMode > 7);

  // Listening to hash
  $.hashListen = function(p, q) {
    if (typeof p == "string") {
      var regex = RegExp("^" + p.replace(/:[a-zA-Z\-\_0-9]+/, "([^/]*)") + "$");
      return $.hashListen.onchange(function(hash) {
        var matches = hash.match(regex);
        if (matches == null) { return; }
        this.matches = matches.slice(1);
        q.apply(this, this.matches);
        return false;
      });
    }

    if (typeof p != "function") { return; }
    $.hashListen.onchange(p);
  };

  $.extend($.hashListen, {
    // Options
    _onchange: [],
    _timer: null,
    interval: 400,

    // State
    referrer: null,
    matches: null,
    hash: null,

    init: function () {
      var self = this;
      if (supportsOnhashchange) { return; }

      self._timer = window.setInterval(function () {
        return self.ontick();
      }, self.interval);
      $(document.body).click(function() {
        window.setTimeout(function() { self.ontick(); }, 1);
      });
    },

    ontick: function () {
      var hash = window.location.hash.substr(1);
      if (hash == this.hash) { return; }
      this.referrer = this.hash;
      this.hash = hash;
      this.onchange([hash]);
    },

    onchange: function (a) {
      if ($.hashListen._timer == null)
        { $(function () { $.hashListen.init(); }); }

      if (typeof a == "function")
        { this._onchange.push(a); }

      else {
        for (var i=0; i<this._onchange.length; ++i) {
          var fn = this._onchange[i];
          if (false === fn.apply(this, a)) { return; }
        }
      }
    }
  });

  if (supportsOnhashchange) {
    $(window).bind('hashchange', function () { $.hashListen.ontick(); });
    $(function () { $.hashListen.ontick(); });
  }
})(jQuery);
