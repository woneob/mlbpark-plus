function getParameterByName(val) {
	var result;
	var tmp = [];
	location.search.substr(1).split('&').forEach(function(item) {
		tmp = item.split('=');

		if (tmp[0] === val) {
			result = decodeURIComponent(tmp[1]);
		} 
	});

	return result;
}

chrome.extension.sendMessage({action:'passwd'}, function(response) {
	if (response.isSkipPasswordChange === 'true') {
		window.location = getParameterByName('gourl');
	}
});
