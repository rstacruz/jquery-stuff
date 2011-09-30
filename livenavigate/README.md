# Livenavigate
#### In-page navigation that doesn't break the back button and actually changes the URL

What it solves
--------------

The usual approach to single-page apps are URL's like
`http://domain.com/#!1938/article`. Livenavigate does the same thing,
except that it your URL will be `http://domain.com/1938/article`, yet
everything will be in-place via AJAX.

This is only supported if your browser supports history states (FF4/Safari).
Don't worry though--it will fallback to the hashbang method otherwise.

For hashbang URL's, this relies on the awesome jQuery.hashListen. It
uses the hash change event, and falls back to window timers if it's not
available.

End result: in-place navigation with nice URL's, no matter what browser.

Usage
-----

``` javascript
/* Bind this to like, say, <a> links */
$.navigate('/admin/products');
```

If the history states are available (Safari/FF4), it will change the actual URL
of the page, yet still /not/ load the URL directly (but instead just trigger the
`navigate` event).

``` javascript
/* Here's how you listen to new pages */
$(window).bind('navigate', function (e, href) {
  /* href == '/admin/products' */
});
```

If history states are not available, it will fall back to hashListen.

You may also silently navigate to a given URL without trigerring the event 
handlers:

``` javascript
$.navigate('/admin/products', true);
```

Common example
--------------

In your HTML, include both JS files. (jQuery 1.3+ required)

``` html
<script src="jquery.js">
<script src="jquery.hashlisten.js">
<script src="jquery.livenavigate.js">
```

Now you probably have links like this:

``` html
<a href="/product/12">Fish steamer</a>
````

In your JS, let's bind all `<a>` links to open in-place.

``` javascript
$("a").live('click', function() {
    // Ignore <a rel='external'>
    if ($(this).is("[rel~=external]")) { return true; }

    // Navigate to it.
    var href = $(this).attr('href');
    $.navigate(href);

    // Show a loading spinner or something.
    $("#loading").show();
    return false;
});
```

Now let's hook it up to load the URL's via AJAX.

``` javascript
$window.bind('navigate', function (e, href) {
    // Load it via AJAX.
    $.get(href, function(data)
    {
        // Pick out the content from it.
        var $data = $("<div>").html(data);
        var html  = $data.find('#content').html();

        // Load it in place.
        $("#content").html(html);

        // Hide the spinner
        $("#loading").hide();
    });
});
```

Hashlisten
----------

This includes a separate plugin Hashlisten. See `README.hashlisten.md` for
notes on what it is.

Authors
-------

Livenavigate and Hashlisten are authored and maintained by Rico Sta. Cruz of
Sinefunc, Inc. See more of our work on [www.sinefunc.com](http://www.sinefunc.com)!

Copyright
---------

Copyright (c) 2010-2011 Rico Sta. Cruz and Sinefunc, Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
