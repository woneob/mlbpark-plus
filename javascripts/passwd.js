;(function(win) {
  var getParameterByName = function(val) {
    var result;
    var tmp = [];
    var urlParams = win.location.search.substr(1);
    var urlParamArray = urlParams.split('&');

    urlParamArray.forEach(function(item) {
      tmp = item.split('=');

      if (tmp[0] === val) {
        result = decodeURIComponent(tmp[1]);
      }
    });

    return result;
  };

  chrome.extension.sendMessage({
    action: 'passwd'
  }, function(res) {
    if (res.isSkipPasswordChange === 'true') {
      win.location = getParameterByName('gourl');
    }
  });
})(window);
