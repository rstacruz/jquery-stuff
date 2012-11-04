/*! jQuery.sort (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/sort */

// $.fn.sort()
// Sorts the insides of a given element.
// Requires underscore.js.
//
// Options:
//
//  * `via` (function, required) - should return the value to be sorted.
//  * `items` (string) - the selector of the children. defaults to '*'.
//  * `order` (string) - the order ('desc' or 'asc'). defaults to 'asc'.

(function($, _) {
  $.fn.sort = function(options) {
    if (!options) options = {};

    var via    = options.via || function(el) { return el.text(); };
    var sel    = "> " + (options.items || '*');
    var order  = options.order || 'asc';
    var parent = $(this);
    var list   = [];

    // Build the list of elements while taking them out of the DOM.
    parent.find(sel).each(function() { list.push($(this).remove()); });

    // Sort that list then add them back in.
    list = _.sortBy(list, via);
    if (order === 'desc') list.reverse();
    _.each(list, function(element) { parent.append(element); });

    return this;
  };
})(jQuery, _);
