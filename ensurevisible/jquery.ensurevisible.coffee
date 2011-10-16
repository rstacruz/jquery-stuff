# ### jQuery.fn.ensureVisible([speed], [callback])
# Ensures that a given item is visible in its scroll pane.
jQuery.fn.ensureVisible = (speed, cb) ->
  [speed, cb] = [null, speed]  if typeof speed == 'function'
  speed ?= 400

  parent = @offsetParent()
  oflow  = parent.css('overflow-y') or parent.css('overflow')

  return this  unless oflow == 'auto' or oflow == 'scroll'

  paneMin    = parent.scrollTop()
  paneMax    = paneMin + parent.innerHeight()

  itemMin    = @.position().top + paneMin
  itemMax    = itemMin + @outerHeight()

  if itemMax > paneMax
    parent.stop().animate scrollTop: itemMax - parent.innerHeight(), speed, cb

  else if itemMin < paneMin
    parent.stop().animate scrollTop: itemMin, speed, cb

  else
    cb()  if typeof cb == 'function'

  this
