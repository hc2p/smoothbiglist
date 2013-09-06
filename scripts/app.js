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

  var appendDomNode = function(item) {
    if (renderedElements[item.id]) return renderedElements[item.id];
    var node = createDomNode(item);
    listElement.appendChild(node);
    renderedElements[item.id] = node;
    return node;
  }

  //http://stackoverflow.com/a/7557433/546030
  var isElementInViewport = function (el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
    );
  }

  var getListItemHeight = (function() {
    var listItemHeight;
    return function(listData) {
      if (listItemHeight) return listItemHeight;
      
      //render one first element
      var node = appendDomNode(listData[0]);
      listItemHeight = node.getBoundingClientRect().height;
      return listItemHeight;
    };
  })();
  
  var getListHeight = (function() {
    var listHeight;
    return function() {
      listHeight = listElement.getBoundingClientRect().height;
      return listHeight; 
    }
  })();

  var getViewportMax = (function() {
    var viewportMax;
    
    return function(listData) {
      var heightOfView = getListHeight();
      var listItemHeight = getListItemHeight(listData);
      viewportMax = Math.round((listElement.scrollTop + heightOfView) / listItemHeight);
      return viewportMax + treshold;
    };
  })();
  
  var renderList = function(listData) {
    
    var viewportMax = getViewportMax(listData);

    for(var i = 0; i < viewportMax; i++) {
      appendDomNode(listData[i]);
    }
  }

  var addListener = function(el, event, callback) {
    // W3C model
    if (el.addEventListener) {
      el.addEventListener(event, callback, false);
      return true;
    } 
    // Microsoft model
    else if (el.attachEvent) {
      return el.attachEvent('on' + event, callback);
    }
  };

  var handleScroll = (function() {
    var time, timeout;

    return function() {
      var newTime = new Date();
      if (!timeout) {
        console.log('add timeout');
        timeout = setTimeout(function() {
          renderList(listData);
          time = new Date();
          clearTimeout(timeout);
          timeout = null;
        }, 250);
      }
    }
  })();

  var listData;
  var listElement;
  var listItemHeight;
  var treshold = 10; //elements to add regardless their visibility
  var renderedElements = {};

  var initialize = function(options) {
    if (typeof options !== 'object' || ! options.el) console.error('please initialize the list with an existing dom element');

    listElement = options.el;
    addListener(listElement, 'scroll', handleScroll);

    var dataUrl = 'https://rawgithub.com/hc2p/smoothbiglist/master/scripts/data.json';
    xhrJSONGet(dataUrl, function(result) {
      listData = result;
      renderList(listData);
    });

    // render one element, take the height and compute a max of elements to append at once
    // after a certain treshold stop appending
    // onscroll add more
  };

  return {
    init: initialize
  }
})()