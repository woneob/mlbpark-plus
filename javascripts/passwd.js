chrome.extension.sendMessage({action:'passwd'}, function(response) {
	var passwdVar = response.passwd;

	if (passwdVar == '1') {
		function getParameterByName(name) {
			name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
			var regexS = '[\\?&]' + name + '=([^&#]*)';
			var regex = new RegExp(regexS);
			var results = regex.exec( window.location.href );
			if( results == null ) {
				return '';
			} else {
				return decodeURIComponent(results[1].replace(/\+/g, ' '));
			}
		}
		window.location = getParameterByName('gourl');
	}
});