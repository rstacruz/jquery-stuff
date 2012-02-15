# $.sort()
Sorts the insides of a given element.

### Options

 * `via` (function, required) - should return the value to be sorted.
 * `items` (string) - the selector of the children. defaults to '\*'.
 * `order` (string) - the order ('desc' or 'asc'). defaults to 'asc'.

### Example

``` html
<table>
  <tr class='heading'>
    <th>Number</th>
    <th>Name</th>
  </tr>

  <tr>
    <td>48</td>
    <td>Rico</td>
  </tr>

  <tr>
    <td>2</td>
    <td>Michael</td>
  </tr>

  <tr>
    <td>52</td>
    <td>Ace</td>
  </tr>
</table>
```

Simple example:

``` javascript
$("table").sort({
  via: function(tr) { return parseInt(tr.find('td:eq(1)').text()); },
});
```

More complicated:

``` javascript
$("table").sort({
  via: function(tr) { return parseInt(tr.find('td:eq(1)').text()); },
  sel: 'tr:not(.heading)',
  order: 'desc'
});
```
