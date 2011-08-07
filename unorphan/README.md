# jQuery Unorphan
#### Obliterate text orphans.

`$.unorphan()` adjoins the last two words of any block of text to make sure 
that they will wrap together.

See [Wikipedia](http://en.wikipedia.org/wiki/Widows_and_orphans) for a 
description of text orphans.

### Common usage

``` javascript
$(function() {
  $("p, li, h2, h3, h4, h5, h6").unorphan();
});
```

This changes:

``` html
<p>Apples, bananas and oranges.</p>
```

Into:

``` html
<p>Apples, bananas and&nbsp;oranges.</p>
```

### Comparison to other utilities

Other similar utilities include:

* [jQWidont](http://davecardwell.co.uk/javascript/jquery/plugins/jquery-widont/jqwidont-uncompressed.js)
* [Widow Fix](http://plugins.jquery.com/project/widowfix)
* [Widont for WordPress](http://www.shauninman.com/archive/2007/01/03/widont_2_1_wordpress_plugin)

As of time of writing, *Unorphan* works better than these because:

* It does not mangle HTML at all (it operates on text nodes), you can be sure that your HTML
tags will always be intact.

* It does not rewrite `innerHTML`, causing your elements to unneededly reinitialize, and possibly
losing events and data in the elements.

* It's extremely small. (400 bytes)

* It does the manipulation on the client side, making no impact to your in-page SEO efforts.

### Acknowledgements

Original idea and implementation by [Shawn 
Inman](http://www.shauninman.com/archive/2007/01/03/widont_2_1_wordpress_plugin).

