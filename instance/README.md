# jQuery instance
#### Ensures you get just one instance for a given element.

Quick usage guide:

    var $one = $("#sidebar").instance();
    var $two = $("#sidebar").instance();
    $one == $two; // true
    
Usage with a mixin (this is pretty much a cheapo view):

    var Sidebar = {
      expand: function () { ... }
    };
    
    var $one = $("#sidebar").instance(Sidebar);
    $one.expand();
