var doc = document;
var win = window;

chrome.extension.sendMessage({action:'width'}, function(response) {
	var o = {
		isEnableContainerWidth: response.isEnableContainerWidth === 'true',
		containerWith: response.containerWith
	};

	//custom container width
	if (o.isEnableContainerWidth) {
		var customWidth = doc.createElement('style'); 
		var customStyle = doc.createTextNode('#wrap {max-width:' + o.containerWith + 'px !important;}');
		customWidth.appendChild(customStyle);
		doc.documentElement.insertBefore(customWidth);
	}
});

//user toolbox remove
doc.onclick = function(){
	var userMenu = doc.querySelectorAll('div[id^="nik_"], #voterList');
	for (var i = 0, userMenuLen = userMenu.length; i < userMenuLen; i++){
		userMenu[i].style.display = 'none';
	}
}

$(doc).ready(function() {
	// Remove AD-Wrapper
	var adContainer = doc.querySelectorAll('.ad_left_w,.ad_left_w2,.ad_right_w');
	for (var i = 0, adContainerLen = adContainer.length; i < adContainerLen; i++){
		adContainer[i].innerHTML = '';
	}

	// Remove Ad-Frame
	var adFrame = doc.querySelectorAll('iframe[src*="donga.com"], #ADhead1');
	for (var i = 0, adFrameLen = adFrame.length; i < adFrameLen; i++){
		var t = adFrame[i];
		t.parentNode.removeChild(t);
	}
});