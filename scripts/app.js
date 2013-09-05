/*

http://stackoverflow.com/a/7557433/546030

- requestRenderFrame
*/

var smoothScrollList = (function() {

  var xhrJSONGet = function(url, success, error) {
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE 8 and older
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          success(JSON.parse(this.responseText));
        } else {
          error('There was a problem with the request.');
        }
      }
    };
    xhr.open('GET', url);
    xhr.send();
    return xhr;
  }

  //http://jsperf.com/innerhtml-vs-dogfragment/10 TODO do own perf test
  var createDomNode = function(item) {
    /*
      <li data-id="1">
        <img src="img/default-image-1.png" alt="">
        <p>John Doe</p>
      </li>
    */
    var li = document.createElement('li');
    
    var img = document.createElement('img');
    img.src = item.img;
    li.appendChild(img);

    var name = document.createElement('p');
    var content = document.createTextNode(item.name);
    name.appendChild(content);
    li.appendChild(name);

    return li;
  }

  //http://stackoverflow.com/a/7557433/546030
  isElementInViewport = function (el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
        );
  }

  var renderList = function(listData) {
    var ul = document.getElementsByTagName('ul')[0];
    for(var i = 0; i < 400; i++) {
      ul.appendChild(createDomNode(listData[i]));
    }
  }

  var _init = function() {
    var dataUrl = 'https://rawgithub.com/hc2p/smoothbiglist/master/scripts/data.json';
    xhrJSONGet(dataUrl, renderList);
  };

  return {
    init: _init
  }
})()