jQuery hashlisten v0.1.0
========================

Monitors the URL for changes in the hash. Requires JQuery 1.3+.

This is often used for pages that have many states. If each state
is represented by a different hash in the URL (for instance,
http://site.com/#edit), clicking the back button will return the
page to the previous state.

The challenge: there is no browser event fired after clicking the
back button. Hashlisten solves that by continuously monitoring
the URL hash and triggering a callback when it's changed.

Usage
-----

    <!-- html -->
    <a href="#/post/32">Go to the new post</a>

    // This JS callback will be called after the link is clicked
    $.hashListen('/post/:id', function (id) {
        $("#content").html("Loading post number "+id+"...);
        // etc
    });

More usage examples
-------------------

    // Example for http://site.com/#/post/2/edit
    $.hashListen('/post/:id/:action', function (id, action) {
      console.log("Parameters: " + id + ", " + action);
      //=> Parameters: 2, edit

      console.log("Matches:");
      console.log(this.matches); // same as [id, action]
      //=> Matches: [2, 'edit']

      console.log("The entire hash: " + this.hash);
      //=> The entire hash: /post/2/edit

      console.log("The previous hash: " + this.referrer);
      //=> The previous hash: #whatever_was_before
    });
