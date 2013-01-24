### HTML

``` html
<div class="slideshow">
  <ul class="slides">
    <li class="slide"> ... </il>
    <li class="slide"> ... </li>
    <li class="slide"> ... </li>
  </ul>
</div>
```

### CSS

``` sass
# Stylus
horizontal-slideshow(width, height)
  &, .slides, .slide
    display: block
    width: width
    height: height

    margin: 0
    padding: 0
    list-style: none

  &
    overflow: hidden
    position: relative

  .slides
    width: 99999px

    position: absolute
    top: 0
    left: 0

  .slide
    float: left


.slideshow
  horizontal-slideshow(450px, 270px)
```

### JS

``` javascript
$(".slideshow").each(function() {
  var $slideshow = $(this);
  var $container = $slideshow.find('> .slides');
  var $slides    = $container.find('> .slide');

  var width = $slideshow.width();

  new Cycler($slides, {
    interval: 3000,
    onactivate: function(current, i, prev, j) {
      $container.animate({ left: -1 * width * i });
    }
  });
});
```
