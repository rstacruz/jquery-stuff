/*
 * jQuery Placeholder 0.1
 * 
 * http://www.dimeg.net/code/jquery/placeholder/
 *
 * Modified by github.com/rstacruz to fix some CSS issues
 * 
 * 
 * MIT License
 * ----
 *
 * Copyright (c) 2011 Vadim Sitel
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 */
(function($){
    $.fn.placeholder = function(options) {
        var settings = {
            'name'         : ''
        };
            
        return this.each(function() {
            if (options) { 
                $.extend(settings, options);
            }
            
            var $this = $(this);
            
            // Create wrapper span
            var wrapperTag = $('<span/>');
            wrapperTag.css("position", "relative");
            wrapperTag.css("display", "inline-block");
            
            // Create placeholder label
            var labelTag = $('<div/>');
            labelTag.html(settings.name);
            labelTag.attr('class', 'placeholder');
            labelTag.css("display", "block");
            labelTag.css("position", "absolute");
            labelTag.css("top", "0px");
            labelTag.css("left", "0px");
            
            labelTag.css("border", $this.css("width"));
            labelTag.css("text-align", $this.css("text-align"));
            labelTag.css("font-size", $this.css("font-size"));
            labelTag.css("font-family", $this.css("font-family"));
            labelTag.css("padding-left", parseInt($this.css('padding-left')) + parseInt($this.css('margin-left')) + parseInt($this.css('border-left-width')));
            labelTag.css("padding-top", parseInt($this.css('padding-top')) + parseInt($this.css('margin-top')) + parseInt($this.css('border-top-width')));

            // Clone the current input
            var currentInput = $this.clone(true);

            // Search clear button
            
            var clearTag = $('<div/>');
            clearTag.addClass("placeholder-clear");
            clearTag.css("position", "absolute");
            clearTag.css("top", "0px");
            clearTag.css("right", "0px");

            // Fill wrapper node
            
            wrapperTag.empty();
            wrapperTag.append(currentInput);
            wrapperTag.append(labelTag);
            wrapperTag.append(clearTag);
            
            var parent = $this.parent();
            wrapperTag.insertAfter($this);
            $this.remove();

            // Assign events

            if (currentInput.val().length < 1) {
                labelTag.show();
                clearTag.hide();
            } else {
                labelTag.hide();
                clearTag.show();
            }

            labelTag.bind('click', function() {
                $(this).addClass('active');
                currentInput.focus();
            });

            currentInput.bind('blur', function() {
                if ($(this).val().length < 1 || $(this).val() == $(this).attr("placeholder")) {
                    labelTag.css("display", "block");
                    labelTag.removeClass('active');
                }
                else {
                    labelTag.hide();
                }
            });
            
            currentInput.bind('focus', function() {
                if ($(this).val().length < 1 || $(this).val() == $(this).attr("placeholder")) {
                    labelTag.css("display", "block");
                    labelTag.addClass('active');
                } else {
                    labelTag.hide();
                }
            });

            currentInput.bind('keydown', function(e) {
              if ((!e.shiftKey) && (!e.ctrlKey) && (!e.metaKey)) {
                labelTag.hide();
              };
            });
            
            var oTimerId = null;
            var triggerElement = currentInput.clone(true);
            currentInput.unbind('keyup').bind('keyup', function() {
                clearTimeout(oTimerId);
                
                var that = $(this);
                oTimerId = setTimeout(function() { 
                    triggerElement.val(that.val());
                    triggerElement.trigger("keyup");

                    if (that.val().length < 1 || that.val() == that.attr("placeholder")) {
                        clearTag.hide();
                    } else {
                        clearTag.show();
                    }
                }, 640);
            });

            clearTag.bind('click', function() {
                triggerElement.val("");
                triggerElement.trigger("keyup");
                triggerElement.focus();
            });
        });
    };
})(jQuery);

