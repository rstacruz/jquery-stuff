# ### jQuery.fn.ensureVisible()
# Ensures that a given item is visible in its scroll pane.
jQuery.fn.ensureVisible = ->
  parent = @offsetParent()
  oflow  = parent.css('overflow-y') or parent.css('overflow')

  return this  unless oflow == 'auto' or oflow == 'scroll'

  paneMin    = parent.scrollTop()
  paneMax    = paneMin + parent.innerHeight()

  itemMin    = @.position().top + paneMin
  itemMax    = itemMin + @outerHeight()

  if itemMax > paneMax
    parent.animate scrollTop: itemMax - parent.innerHeight()

  else if itemMin < paneMin
    parent.animate scrollTop: itemMin

  this
