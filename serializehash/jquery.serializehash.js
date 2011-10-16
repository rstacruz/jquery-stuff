// ### jQuery.fn.serializeHash()
// Returns a form's values as a dictionary object.
// The name was inspired by ActiveRecord's serialize_hash function.
//
jQuery.fn.serializeHash = function() {
  var arr = this.serializeArray();
  var re  = {};

  for (i in arr) {
    if (arr.hasOwnProperty(i)) {
      re[arr[i].name] = arr[i].value;
    }
  }

  return re;
};
