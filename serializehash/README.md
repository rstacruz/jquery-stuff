# SerializeHash

If you have a form...

``` html
<form id='book'>
  <input type='text' name='title'>
  <input type='text' name='author'>
</form>
```

...you can use `serializeHash()` to get it's contents...

``` javascript
options = $("#book").serializeHash();
console.log(options);
```

...as a dictionary object.

``` javascript
{
  title: '...',
  author: '...'
}
```


