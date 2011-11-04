(function() {
  jQuery.fn.sort = function(options) {
    var list, order, parent, sel, via;
    if (options == null) {
      options = {};
    }
    via = options.via || function(el) {
      return el.text();
    };
    sel = options.items || '*';
    sel = "> " + sel;
    order = options.order || 'asc';
    parent = $(this);
    list = [];
    parent.find(sel).each(function() {
      return list.push($(this).remove());
    });
    list = _.sortBy(list, via);
    if (order === 'desc') {
      list.reverse();
    }
    return _.each(list, function(element) {
      return parent.append(element);
    });
  };
}).call(this);
