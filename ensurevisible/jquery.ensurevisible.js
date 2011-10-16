(function() {
  jQuery.fn.ensureVisible = function(speed, cb) {
    var itemMax, itemMin, oflow, paneMax, paneMin, parent, _ref;
    if (typeof speed === 'function') {
      _ref = [null, speed], speed = _ref[0], cb = _ref[1];
    }
        if (speed != null) {
      speed;
    } else {
      speed = 400;
    };
    parent = this.offsetParent();
    oflow = parent.css('overflow-y') || parent.css('overflow');
    if (!(oflow === 'auto' || oflow === 'scroll')) {
      return this;
    }
    paneMin = parent.scrollTop();
    paneMax = paneMin + parent.innerHeight();
    itemMin = this.position().top + paneMin;
    itemMax = itemMin + this.outerHeight();
    if (itemMax > paneMax) {
      parent.stop().animate({
        scrollTop: itemMax - parent.innerHeight()
      }, speed, cb);
    } else if (itemMin < paneMin) {
      parent.stop().animate({
        scrollTop: itemMin
      }, speed, cb);
    } else {
      if (typeof cb === 'function') {
        cb();
      }
    }
    return this;
  };
}).call(this);
