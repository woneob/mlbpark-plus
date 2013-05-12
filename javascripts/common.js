var doc = document;
chrome.extension.sendMessage({action:'width'}, function(response) {
	var widthVar = response.width,
	widthValVar = response.widthVal;

	//custom container width
	if (widthVar == '1') {
		var customWidth = doc.createElement('style'); 
		customWidth.appendChild(doc.createTextNode('#wrap {max-width:' + widthValVar + 'px !important;}'));
		doc.documentElement.insertBefore(customWidth);
	}
});

$(doc).ready(function() {
	// Remove AD-Wrapper
	var adContainer = doc.querySelectorAll('.ad_left_w,.ad_left_w2,.ad_right_w');
	for (var i = 0, adContainerLen = adContainer.length; i < adContainerLen; i++){
		adContainer[i].innerHTML = '';
	}

	// Remove Ad-Frame
	var adFrame = doc.querySelectorAll('iframe[src*="donga.com"]');
	for (var i = 0, adFrameLen = adFrame.length; i < adFrameLen; i++){
		var t = adFrame[i];
		t.parentNode.removeChild(t);
	}

	//user toolbox remove
	$(doc).on('click',function(){
		$('div[id^="nik_"]').css('display','none');
	});
});