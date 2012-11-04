# Cycler

Cycles between a given `list` at a given `interval`.
Simply define an `onactivate` hook.

All the options are optional except `onactivate`.

``` javascript
    c = new Cycler(list, {
      interval: 3000,
      initial: 0, /* first slide's index */
      onactivate: function(current, index, prev, prevIndex) { ... }, /* Required */
      onstart: function() { ... },
      onpause: function() { ... }
    });
```

Navigating
----------

You can switch by slides using `next()`, `previous()` and `goTo()`. When
these are invoked, the interval timer is reset (that is, it will take 3000ms
again to switch to the next slide).

If these are called when the slideshow is paused, it should remain paused.

Doing this will trigger the `onactivate` callback.

``` javascript
    c.next();
    c.previous();
    c.goTo(0);
```

The onactivate hook
-------------------

This is where the magic happens. It's called everytime a new slide is activated.

The callback takes 4 arguments: the current list item (`current`) + its
index in the list (`index`), and the previous item (`prev`) + its index (`prevIndex`).

``` javascript
    var list = [ 'Apple', 'Banana', 'Cherry' ];

    new Cycler(list, {
      onactivate: function(current, index, prev, prevIndex) {
        console.log("Switching from", prev, "to", current);
        console.log("(from", prevIndex, "to", index, ")");
      };
    });

    // Result:
    //
    // Switching from null to "Apple" (from null to 0)
    // Switching from "Apple" to "Banana" (from 0 to 1)
    // Switching from "Banana" to "Cherry" (from 1 to 2)
    // Switching from "Cherry" to "Apple" (from 2 to 0)
```

Pausing
-------

You can pause and unpause the slideshow with `pause()` and `start()`. Note
that calling `start()` will reset the interval timer.

These will call the `onpause` and `onstart` callbacks respectively.

``` javascript
    c.pause();
    c.start();
```

You can pass `true` as an argument (eg, `c.pause(true)`) to these to supress
triggering the callbacks.

Properties
----------

``` javascript
    c.current    /* Numeric index of current item */
    c.list       /* The list being cycled */
```

Chainability
------------

All the methods are chainable, too, so you can do:

``` javascript
    c.next().pause();
```

Slideshow example
-----------------

``` javascript
    var $parent = $(".slideshow");
    var $images = $parent.find("img");

    var c = new Cycler($images, {
      interval: 5000,
      onactivate: function(current) {
        $images.hide();
        $(current).show();
      }
    });

    // Custom controls example
    $(".slideshow-controls button.next").on("click", function() { c.next(); });
    $(".slideshow-controls button.prev").on("click", function() { c.previous(); });

    // Pause on hover example
    $(".slideshow").on("hover", function() { c.pause(); }, function() { c.start(); });
```
