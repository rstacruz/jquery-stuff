$ = jQuery

# Returns the scroll position thing.
#
# ## Example
#    $("#two").scrollPosition()   // 0..1 or undefined
#
$.fn.scrollPosition = ->
  top = $(this).position().top
  min = Math.max(top - $(window).height(), 0)
  max = Math.min($('body').height() - $(window).height(), top + $(this).outerHeight())

  val = ($(window).scrollTop() - min) / (max - min)

  val

# Monitors scrolling.
#
# You can pass an attr delta to make it trigger before it's actually shown.
#
# ## Example
#     $("#two").monitorScroll({ callback: function(e, pos) { pos; } });
#     // `pos` will be 0..1 -- what scrollPosition will give
#
$.fn.monitorScroll = (options) ->
  callback = options.callback || (->)
  delta    = options.delta || 0

  $(this).each ->
    $this = $(this)

    if options.callback
      $this.bind 'peek', callback

    $(window).scroll ->
      pos = $this.scrollPosition()
      $this.trigger 'peek', pos  if pos > (0.0-delta) && pos < (1.0+delta)

    # Initialize it
    callback.apply $(this), [null, ($this.scrollPosition() || 0)]

$.fn.scrope = (elements) ->

  for selector of elements
    options = elements[selector]

    $(this).monitorScroll delta: options.top, callback: (e, pos) ->
      if options.fromTop
        p = -pos
      else
        p = (-pos + 0.5) * 2  # -1..1

      $el = if selector == '&'
        $(this)
      else
        $(this).find(selector)

      $el.setOffset top: options.top * p, bgTop: (options.bgTop||0) * p

# Adds two CSS values together.
#
# ##  Example
#     add('5px', 10)   //=> 15px
#
add = (a, b) ->
  return a  if parseFloat(b) == 0.0
  unit = "#{a}".match(/[^0-9]*$/)
  (parseFloat(a) + parseFloat(b)) + unit

$.fn.setOffset = (options) ->
  console.log $(this).attr('id'), options  if $(this).attr('id') == 'two'
  $(this).each ->
    $this = $(this)

    # Ensure that the element has positioning.
    if !$this.css('position') == 'static'
      $this.css position: 'relative', top: 0, left: 0

    fadeIn = false

    # Store the old
    if !$this.data('original_offset')
      bp = $this.css('backgroundPosition').split(' ')

      $this.data 'original_offset',
        top:   $this.css('top'),
        left:  $this.css('left')
        bgTop:  bp[0]
        bgLeft: bp[1]

      fadeIn = true

    origin = $this.data('original_offset')

    if options.top or options.left
      $this.css
        top:    add origin.top,    (options.top || 0)
        left:   add origin.left,   (options.left || 0)

    if options.bgTop or options.bgLeft
      top  = add origin.bgTop,  (options.bgTop  || 0)
      left = add origin.bgLeft, (options.bgLeft || 0)

      $this.css
        backgroundPosition: "#{left} #{top}"

    $this.fadeIn()  if fadeIn
