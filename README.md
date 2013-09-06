smoothbiglist
=============

very basic script to render a long list incrementally. Only the visibile elements get rendered.  
At first rendering it computes the maximum amount of items to display in order to fill the viewport, plus some more elements to make it scrollable.  
After that it listens on the 'scroll' event. The handler is throttled so it only runs every 250ms.  
In the scroll-eventhandler there is a simple check if the 3rd-last of the rendered list-elements became visible. If thats the case, it adds the next bunch (of fixed length) to the list.

Every bunch of list-elements before appended to the list will be appended to a ```documentFragment```

###code to generate the sample json:

```javascript
  var names = ["John Doe", "Pauline Halen", "Matt Hill", "Jessica Bedford", "Jessica Alba", "Scarlett Johansson"];
  var list = [];
  for (i = 0; i < 400; i++) {
    list.push({id: i + 1, name: names[i % 6], img: "http://placehold.it/100x100"})
  }
  document.write(JSON.stringify(list));
```
