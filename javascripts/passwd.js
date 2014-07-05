function getParameterByName(name) {
	name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
	var regexS = '[\\?&]' + name + '=([^&#]*)';
	var regex = new RegExp(regexS);
	var results = regex.exec( window.location.href );
	if( results == null ) {
		return '';
	} else {
		return decodeURIComponent(results[1].replace(/\+/g, ' ').replace(/%25/gi, '%'));
	}
}

chrome.extension.sendMessage({action:'passwd'}, function(response) {
	if (response.isSkipPasswordChange === 'true') {
		window.location = getParameterByName('gourl');
	}
});