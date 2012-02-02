(function() {

  jQuery.fn.ensureVisible = function() {
    var args, itemMax, itemMin, oflow, opts, paneMax, paneMin, parent;
    args = Array.prototype.slice.apply(arguments);
    opts = {
      speed: 400,
      offset: 0
    };
    if (typeof args[0] === 'object') $.extend(opts, args.shift());
    if (typeof args[0] === 'number') opts.speed = args.shift();
    if (typeof args[0] === 'function') opts.callback = args.shift();
    parent = this.offsetParent();
    oflow = parent.css('overflow-y') || parent.css('overflow');
    if (!(oflow === 'auto' || oflow === 'scroll')) return this;
    paneMin = parent.scrollTop();
    paneMax = paneMin + parent.innerHeight();
    itemMin = this.position().top + paneMin - opts.offset;
    itemMax = itemMin + this.outerHeight() + opts.offset;
    if (itemMax > paneMax) {
      parent.stop().animate({
        scrollTop: itemMax - parent.innerHeight()
      }, opts.speed, opts.callback);
    } else if (itemMin < paneMin) {
      parent.stop().animate({
        scrollTop: itemMin
      }, opts.speed, opts.callback);
    } else {
      if (typeof opts.callback === 'function') opts.callback();
    }
    return this;
  };

}).call(this);
