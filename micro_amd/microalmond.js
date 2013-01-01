/*! microalmond (c) 2012, Rico Sta. Cruz. MIT License.
 *  http://github.com/rstacruz/jquery-stuff/tree/master/micro_amd */

// Extremely minimal implementation of AMD, inspired by almond.js.
//
// It only supports defining with module names, with or without dependencies:
//
//     define('module_name', function() { ... });
//     define('module_name', ['deps', 'xxx'], function() { ... });
//
// You can require a module name:
//
//     require('module_name');
//
// Or require and add a function to run:
//
//     require('jquery', function($) { ... });
//     require(['jquery', 'backbone'], function($, Backbone) { ... });
//
// Other use cases are not accounted for.
//
//   - No async loading
//   - No unnamed modules

(function(w) {

  var modules = {};
  var cache = {};

  function resolve(deps, fn) {
    if (!deps.splice) deps = [deps];
    if (deps.length === 0) return fn;

    return function() {
      var args = [];
      for (var i=0; i<deps.length; i++) args.push(w.require(deps[i]));
      return fn.apply(this, args);
    };
  }

  w.define = function(name, deps, fn) {
    if (!fn) { fn = deps; deps = []; }
    modules[name] = resolve(deps, fn);
    delete cache[name];
  };

  w.require = function(name, fn) {
    if (fn) return resolve(name, fn)();
    if (!modules[name]) throw "Error: no '"+name+"'";
    if (typeof cache[name] === 'undefined') cache[name] = modules[name]();
    return cache[name];
  };

  w.define.amd = true;

})(this);
