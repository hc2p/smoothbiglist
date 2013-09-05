smoothbiglist
=============


generate json:

  var names = ["John Doe", "Pauline Halen", "Matt Hill", "Jessica Bedford", "Jessica Alba", "Scarlett Johansson"];
  var list = [];
  for (i = 0; i < 400; i++) {
    list.push({id: i + 1, name: names[i % 6], img: "http://placehold.it/100x100"})
  }
  document.write(JSON.stringify(list));