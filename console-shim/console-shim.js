/*! Console Shim (c) 2012, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/console-shim */

// Makes `console.log()` commands silently fail if the current browser doesn't
// have console API support.

(function (console) {
  var methods = 'assert count debug dir dirxml error group groupCollapsed groupEnd info log markTimeline profile profileEnd table time timeEnd trace warn'.split('');

  if (!console) console = window.console = {};

  for (var i in methods) {
    if (methods.hasOwnProperty(i)) {
      var fn = methods[i];
      if (!console[fn]) console[fn] = (function() {});
    }
  }

})(window.console);
