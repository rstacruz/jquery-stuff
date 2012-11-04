(function($) {
  $.fn.instance = function (type) {
    var $this = this.first();
    $this = $this.data('instance') || ($this.data('instance', $this) && $this);

    if ((type) && ((!$this._class) || ($this._class != type))) {
      $this.extend(type);
      $this._class = type;
    }

    return $this;
  };
})(jQuery);
