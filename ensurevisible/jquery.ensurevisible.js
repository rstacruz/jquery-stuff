(function() {
  jQuery.fn.ensureVisible = function() {
    var itemMax, itemMin, oflow, paneMax, paneMin, parent;
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
      parent.animate({
        scrollTop: itemMax - parent.innerHeight()
      });
    } else if (itemMin < paneMin) {
      parent.animate({
        scrollTop: itemMin
      });
    }
    return this;
  };
}).call(this);
