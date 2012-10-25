/*! jQuery.ajaxSubmit (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/ajaxsubmit */

(function($) {

  // $.fn.ajaxSubmit()
  // Submits a given form via AJAX. Returns the AJAX object.
  //
  // The given `options` parameter is a dict object that will be passed onto as
  // options for `$.ajax()`.
  //
  //     $("form#my-form").ajaxSubmit({
  //       success: function(data) {
  //         alert("All done!");
  //       }
  //     });
  //
  $.fn.ajaxSubmit = function(options) {
    var $this = $(this).eq(0);

    if (!$this.is('form')) return false;

    var method = ($this.attr('method') || 'post').toLowerCase();
    var url    = $this.attr('action') || window.location.href;

    // Construct the options object to be passed to the AJAX request.
    options || (options = {});
    options.url    = url;
    options.method = options.method || method;
    options.data   = $this.serialize();

    return $.ajax(options);
  };

})(jQuery);
