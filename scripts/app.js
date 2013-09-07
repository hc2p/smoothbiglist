/*
optimizations:
- remove / hide elements when moving out of view
*/

var SmoothScrollList = function(options) {
  if (typeof options !== 'object' || ! options.el) console.error('please initialize the list with an existing dom element');
  
  this.listData;
  this.listElement = options.el;
  this.listItemHeight;
  this.offset = 0;
  this.limit = 15;
  this.renderedElements = [];
  
  this.addListener(this.listElement, 'scroll', this.handleScroll.bind(this));

  var dataUrl = 'https://rawgithub.com/hc2p/smoothbiglist/master/scripts/data.json';
  var that = this;
  this.xhrJSONGet(dataUrl, function(result) {
    that.listData = result;
    that.renderList(result);
    options.callback && options.callback();
  });
};

//http://jsperf.com/innerhtml-vs-dogfragment/10
SmoothScrollList.prototype.createDomNode = function(item) {
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
  var content = document.createTextNode(item.id + ' ' + item.name);
  name.appendChild(content);
  li.appendChild(name);

  return li;
};

SmoothScrollList.prototype.getDomNode = function(item) {
  if (this.renderedElements[item.id]) return this.renderedElements[item.id];
  var node = this.createDomNode(item);
  this.renderedElements[item.id] = node;
  return node;
};

SmoothScrollList.prototype.getListItemHeight = function() {
  //render one first element
  var node = this.getDomNode(this.listData[0]);
  this.listElement.appendChild(node);
  var listItemHeight = node.getBoundingClientRect().height;
  return listItemHeight;
};


SmoothScrollList.prototype.getViewportMax = function() {
  var heightOfView = this.listElement.getBoundingClientRect().height;
  var listItemHeight = this.getListItemHeight(this.listData);
  viewportMax = Math.round((this.listElement.scrollTop + heightOfView) / listItemHeight);
  return viewportMax + 5;
};

SmoothScrollList.prototype.renderList = function() {
  var fragment = document.createDocumentFragment();
  //rendered first bunch? add a fixed set, otherwise only a few necessary to fill the view
  var limit = this.offset > 0 ? this.offset + this.limit : this.getViewportMax();
  var listSize = this.listData.length;
  for (var i = this.offset; i < limit && i < listSize; i++) {
    fragment.appendChild(this.getDomNode(this.listData[i]));
    this.offset++;
  }

  this.listElement.appendChild(fragment);
}

SmoothScrollList.prototype.handleScroll = (function() {
  var timeout;
  return function() {
    if (!timeout) {
      timeout = setTimeout(function() {
        var thirdLastElement = this.renderedElements[this.renderedElements.length - 3];
        if (this.isElementInViewport(thirdLastElement)) {
          this.renderList();
        }
        time = new Date();
        clearTimeout(timeout);
        timeout = null;
      }.bind(this), 250);
    }
  }
})();


//http://stackoverflow.com/a/7557433/546030
SmoothScrollList.prototype.isElementInViewport = function (el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
  );
}

SmoothScrollList.prototype.addListener = function(el, event, callback) {
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

SmoothScrollList.prototype.xhrJSONGet = function(url, success, error) {
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
};

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}