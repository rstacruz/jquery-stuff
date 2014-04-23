// jQuery.paymentForm
// ==================
//
// Painless integration with [jQuery.payment].
//
// Features:
//
//  - Semantic, standard markup
//  - Automatic updating of credit card images
//  - Inline validation
//
// What it does
// ------------
//
//  - Automatically apply jquery.payment restrictions to CC fields You'll only
//    be able to type the right formats in each field.
//
//  - Enable autoFill in modern browsers for locally-saved credit card
//    information. Works in Google Chrome (built-in) and Firefox (extension). (\*)
//
//  - Make the credit card number fields show up as numeric inputs in mobile
//    phones.
//
//  - Generate placeholder text for the input fields.
//
//  - (Optional) Show an image of the credit card type based on the number.
//
//  - (Optional) validation for the major credit card fields based on rules on
//    credit card numbers.
//
// \* = as of April 2013
//
// Usage
// -----
//
// Format your HTML like with markup from the [Autocomplete types] spec:
//
//     Name on card:
//     <input type='text' autocompletetype='cc-name'>
//
//     CC number:
//     <input type='text' autocompletetype='cc-number'>
//
//     Expiry:
//     <input type='text' autocompletetype='cc-exp'>
//
//     CSC (card security code):
//     <input type='text' autocompletetype='cc-csc'>
//
// Now in JS:
//
//     $(function() {
//       $("form").paymentform();
//     });
//
// Validation
// ----------
//
// Turn on validation via:
//
//       $("form").paymentform({ validate: true });
//
// This adds the classes `error` and `valid` to the form fields as needed.
//
// You can customize the error/valid handlers via the `onerror` and `onvalid` options:
//
//       $("form").paymentform({
//         validate: true,
//
//         onerror: function($element, message) {
//           if (message === null) {
//             $element.removeClass('error');
//             $element.find("+ .error-message").remove();
//           } else {
//             $element.addClass('error');
//             $element.after($("<span class='error-message'>").html(message));
//           }
//         },
//
//         onvalid: function($element) {
//           $element.addClass('valid');
//         }
//       });
//
// Credit card types
// -----------------
//
// Make an element with the class `cc-type`:
//
//     <div class='cc-type'>
//
// This will automatically have its classes changed so you may restyle it via CSS:
//
//     <div class='cc-type cc-type-unknown'>
//     <div class='cc-type cc-type-known cc-type-visa'>
//     <div class='cc-type cc-type-known cc-type-mastercard'>
//
// [Autocomplete types]: http://wiki.whatwg.org/wiki/Autocomplete_Types
// [jQuery.payment]: https://github.com/stripe/jquery.payment

(function ($) {
  // Default values for options.
  var defaults = {
    bullet: String.fromCharCode(8226),
    validate: false
  };

  function PaymentForm(form, options) {
    this.constructor(form, options);
  }

  PaymentForm.prototype = {
    constructor: function (form, options) {
      this.options = $.extend({}, defaults, options || {});

      // Enable any custom handlers.
      if (this.options.onerror) this.onerror = this.options.onerror;
      if (this.options.onvalid) this.onvalid = this.options.onvalid;

      // Cache the elements.
      this.$form = $(form);
      this.$type = this.$form.find('.cc-type');
      this.$ccNumber = this.$form.find('[autocompletetype="cc-number"]');
      this.$ccName = this.$form.find('[autocompletetype="cc-name"]');
      this.$ccCsc = this.$form.find('[autocompletetype="cc-csc"]');
      this.$ccExp = this.$form.find('[autocompletetype="cc-exp"]');
      this.$inputs = this.$form.find('[autocompletetype^="cc-"]');

      // Turn on auto-complete for the entire form.
      this.$form.attr('autocomplete', 'on');

      // Add the right HTML attributes to input fields, and activate jQuery
      // Payment behavior.
      this.updateInputs();

      if (this.options.validate) {
        this.registerValidation();
      }
    },

    // Add the right HTML attributes to input fields, and activate jQuery
    // Payment behavior.
    updateInputs: function() {
      this.updateExpInput(this.$ccExp);
      this.updateCscInput(this.$ccCsc);
      this.updateNameInput(this.$ccName);
      this.updateNumberInput(this.$ccNumber);
    },

    // Turns on validation for the form fields.
    registerValidation: function() {
      var self = this;

      // Decorator for validation functions.
      function getValidator(msg, fn) {
        return function() {
          var $element = $(this);
          var value = $element.val();
          if (value.length === 0) return;

          var isValid = fn(value);
          setError($element, isValid, msg);
        };
      }

      function setError($element, isValid, msg) {
        if (isValid) {
          self.onerror($element, null);
          self.onvalid($element);
        } else {
          self.onerror($element, msg);
        }
      }

      // Clear errors on typing, and validate on blur.
      self.$inputs
        .on('input focus', function() { self.onerror($(this), null); })
        .on('blur', function() { $(this).trigger('payment:validate'); });

      self.$ccNumber
        .on('payment:validate', getValidator('invalid card number', $.payment.validateCardNumber));

      self.$ccName
        .on('payment:validate', getValidator('invalid card number', function(value) {
          return value.length > 0;
        }));

      self.$ccExp
        .on('payment:validate', getValidator('invalid card expiry', function(value) {
          var parts = $.payment.cardExpiryVal(value);
          return $.payment.validateCardExpiry(parts.month, parts.year);
        }));

      self.$ccCsc
        .on('payment:validate', getValidator('invalid', function(value) {
          var type = $.payment.cardType(self.$ccNumber.val());
          return $.payment.validateCardCVC(value, type);
        }));
    },

    // Updates an input element with an error message.
    // If `message` is null, then clears the error.
    onerror: function($element, message) {
      if (message) {
        $element.removeClass('valid').addClass('error');
      } else {
        $element.removeClass('valid error');
      }
    },

    onvalid: function($element) {
      $element.addClass('valid');
    },

    // Updates CC Number input fields.
    //
    // For credit card numbers, turn autocomplete on and enable number-only
    // inputs for mobile devices.
    //
    updateNumberInput: function($input) {
      $input
        .on('input', $.proxy(this.updateCardTypeElement, this))
        .payment('formatCardNumber')
        .attr({
          placeholder: numberText(this.options.bullet),
          autocomplete: 'on',
          pattern: '\\d*'
        });
    },

    updateExpInput: function($input) {
      $input
        .payment('formatCardExpiry')
        .attr({
          placeholder: 'MM / YY',
          autocomplete: 'on'
        });
    },

    updateCscInput: function($input) {
      $input
        .payment('formatCardCVC')
        .attr({
          placeholder: "CVC",
          autocomplete: 'on',
          autocompletetype: 'cc-csc',
          pattern: '\\d*'
        });
    },

    updateNameInput: function($input) {
      $input.attr({ autocomplete: 'on' });
    },

    // Updates the card type element with the right card image.
    updateCardTypeElement: function() {
      var type = $.payment.cardType(this.$ccNumber.val());
      updateCardType(this.$type, type);
    }
  };

  $.fn.paymentform = function(options) {
    new PaymentForm(this, options);
  };

  function numberText(b) {
    return b+b+b+b+" "+b+b+b+b+" "+b+b+b+b+" "+b+b+b+b;
  }

  function cvcText(b) {
    return b+b+b;
  }

  // Updates the 'card type' element with the classname from `type`.
  function updateCardType($element, type) {
    if ($element.length === 0) return;

    removeClassByRegex($element, /^cc-type-/);
    if (type) {
      $element.addClass('cc-type-known cc-type-'+type);
    } else {
      $element.addClass('cc-type-unknown');
    }
  }

  function removeClassByRegex($element, regex) {
    var klasses = $element.attr('class').split(' ');
    var output = [];

    for (var i=0; i<klasses.length; ++i) {
      var klass = klasses[i];
      if (!klass.match(regex)) output.push(klass);
    }

    $element.attr('class', output.join(' '));
  }
})(jQuery);
