# Ensurevisible

Example:

``` html
<section class='items'>
  <article>..</article>
  <article>..</article>
  <article>..</article>
  <article>..</article>
  <article class='active'>..</article>
</section>
```

``` css
/* Items is a scrollable pane with a fixed height. */
.items {
  overflow: auto;
  height: 200px; }

article {
  height: 50px; }
```

So `.items .active` should be *not* visible when `.items` is scrolled all the 
way up.

``` javascript
$(".items .active").ensureVisible();
```

After calling this, `.items` will scroll down just enough to reveal `.active`.


