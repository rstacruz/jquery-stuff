# ### jQuery.fn.ensureVisible([speed], [callback])
# ### jQuery.fn.ensureVisible({ offset: 30, speed: 50 }, [speed], [callback])
# Ensures that a given item is visible in its scroll pane.
jQuery.fn.ensureVisible = ->
  args = Array::slice.apply arguments
  opts =
    speed: 400
    offset: 0

  $.extend opts,  args.shift()  if typeof args[0] is 'object'
  opts.speed    = args.shift()  if typeof args[0] is 'number'
  opts.callback = args.shift()  if typeof args[0] is 'function'

  parent = @offsetParent()
  oflow  = parent.css('overflow-y') or parent.css('overflow')

  return this  unless oflow is 'auto' or oflow is 'scroll'

  paneMin    = parent.scrollTop()
  paneMax    = paneMin + parent.innerHeight()

  itemMin    = @position().top + paneMin - opts.offset
  itemMax    = itemMin + @outerHeight() + opts.offset

  if itemMax > paneMax
    parent.stop().animate scrollTop: itemMax - parent.innerHeight(),
      opts.speed, opts.callback

  else if itemMin < paneMin
    parent.stop().animate scrollTop: itemMin,
      opts.speed, opts.callback

  else
    opts.callback()  if typeof opts.callback is 'function'

  this
