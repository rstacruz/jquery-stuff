// Dependencies (global)
global.assert = require('chai').assert;
global.expect = require('chai').expect;
global.extend = require('util')._extend;
global.sinon = require('sinon');

// Dependencies (local)
var jsdom = require('jsdom');
var sourceCache = cache();

// Helpers
global.loadEnv = loadEnv;
global.render = render;

// ----

function render(html) {
  $('body').html(html);
}

function loadEnv(src) {
  var sources = [
    getFile('test/vendor/jquery-1.9.1.js'),
    getFile(src)
  ];

  return function(done) {
    jsdom.env({
      html: '<!doctype html><html><head></head><body></body></html>',
      src: sources,
      done: function(errors, window) {
        window.console = console;
        extend(global, {
          window   : window,
          $        : window.$
        });
        done(errors);
      }
    });
  };
}

/**
 * Returns a file's contents -- getFile('test/vendor/x.js')
 */

function getFile(filepath) {
  var path = require('path');
  var fs = require('fs');
  var fpath = path.resolve(__dirname, '..', filepath);
  return fs.readFileSync(fpath).toString();
}

/**
 * Creates a cache
 */

function cache() {
  var hash = {};
  return function (key, fn) {
    key = JSON.stringify(key);
    if (!hash[key]) hash[key] = fn();
    return hash[key];
  };
}
