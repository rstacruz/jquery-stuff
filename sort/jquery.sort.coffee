# $.sort()
# Sorts the insides of a given element.
#
# Options:
#
#  * `via` (function, required) - should return the value to be sorted.
#  * `items` (string) - the selector of the children. defaults to '*'.
#  * `order` (string) - the order ('desc' or 'asc'). defaults to 'asc'.
#
jQuery.fn.sort = (options={}) ->
  via    = options.via or (el) -> el.text()
  sel    = options.items or '*'
  sel    = "> #{sel}"
  order  = options.order or 'asc'
  parent = $(this)

  # Build the list of elements while taking them out of the DOM.
  list = []
  parent.find(sel).each -> list.push $(this).remove()

  # Sort that list then add them back in.
  list = _.sortBy list, via
  list.reverse()  if order is 'desc'
  _.each list, (element) -> parent.append element
