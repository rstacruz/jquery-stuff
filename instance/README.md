jQuery.instance
===============

Easy states and mixins for jQuery objects.

Why use jQuery.instance?
------------------------

When creating interfaces with complicated JavaScript behavior,
things can get really complicated real quick. Sometimes, doing
things the OOP way can be a very sane solution.

You can easily extend an object like so:

    var $sidebar = $("#sidebar");
    $sidebar.load = function() { /* ... */ };
    $sidebar.load();

...but if you were to access that in another area of your script, it'd
be another object altogether and your extensions will not be available.

    $("a.reload-sidebar").click(function() {
        var $sb = $("#sidebar");
        $sb.load();       // Error: `load` is not defined
        $sidebar == $sb;  // false
    });

If you were to use `$("#sidebar").instance()` instead, you'll
be sure that `$sb` and `$sidebar` will be the same object.

    var $sidebar = $("#sidebar").instance();
    $sidebar.load = function() { /* ... */ };

    $("a.reload-sidebar").click(function() {
        var $sb = $("#sidebar").instance();
        $sb.load();
        $sidebar == $sb;  // true
    });

Usage
-----

Use `.instance()` to make sure that there will only be one instance of an object.

    var $one = $("#sidebar").instance();
    $one.abc = 42;
  
    var $two = $("#sidebar").instance(); // will be the same as $one
    $two.abc;      // 42
    $one == $two;  // true
    $two.show();   // still a jQuery object equivalent to $("#sidebar")

It can also be used for making 'pseudo-classes' for jQuery objects by
letting you extend your objects with methods and properties
from another object (a 'mixin').

    // This is a mixin with properties/methods that will be added
    // to a jQuery object.
    var Sidebar = {
      name: 'My sidebar',
      expand: function () {
        this.slideDown('fast');
      }
    };
    
    // Calling $(x).instance(Sidebar) is the same as:
    // $(x).instance().extend(Sidebar);
    var $one = $("#sidebar").instance(Sidebar);
    $one.expand();
    $one.name;      // 'My sidebar'
    
    var $two = $("#sidebar").instance();
    $two.expand();  // Same as $one.expand()


Hypothetical example
--------------------

Let's say that we're to create a spin button widget.
We can have a function that returns a jQuery object like this:

    var $spin = $.spinbutton(); // Returns a jQuery object
    $("#container").append($spin);
    $spin.show();

But we'd also want that object to be able to keep a state
(i.e., variables), and have some custom functions like so:

    $spin.setValue(4);
    $spin.add();
    $spin.comment = "Hello";

From here, `$.spinbutton` can be simply a `$("...")` generator
that, in the end, will call `instance()` to extend the
object:

    $.spinbutton = function() {
      var $button = $("<div class='spin-button'>")
          .append($("<span class='display'>"))
          .append($("<a class='add'>")
              .click(function() { $this.add(); return false; }))
          .append($("<a class='subtract'>")
              .click(function() { $this.subtract(); return false; }))

      return $button.instance(SpinButton);
    },

And the mixin can look like this:

    var SpinButton = {
      $display: function () { return this.find('span.display'); },
      setValue: function (val) { this.$display().html(val); },
      getValue: function () { return parseInt(this.$display().html()); },
      add:      function () { this.setValue(this.getValue + 1); },
      subtract: function () { this.setValue(this.getValue - 1); }
    };

Now, the functions can be used elsewhere!

    /* Elsewhere */ {
        var $button = $("#container .spin-button").instance();
        $button.setValue(200);
    }

Without the `.instance()`, the `$("#container .spin-button")` will simply
return a jQuery object /without/ the mixin we defined. Calling `.instance()`
will return the very same JavaScript object that was created earlier,
maintaining it's state and mixins.

Authors
-------

jQuery.instance is authored and maintained by Rico Sta. Cruz of Sinefunc, Inc.
See more of our work on [www.sinefunc.com](http://www.sinefunc.com)!

Copyright
---------

(c) 2010 Rico Sta. Cruz and Sinefunc, Inc. See the LICENSE file for more details.

