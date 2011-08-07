$.fn.unorphan = function() {
  $(this).each(function() {
    var last = this.lastChild;

    if ((last) && (last.nodeType == 3)) {
      var text     = last.nodeValue;
      var stripped = text.replace(/^\s*|\s*$/g, ' ');
      var spaces   = stripped.match(/ /g).length;

      if (spaces > 0) {
        last.nodeValue = last.nodeValue.replace(/\s*([^\s]+\s*)$/g, '\xA0$1');
      }
    }
  });
};
