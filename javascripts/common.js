chrome.extension.sendMessage({action:'width'}, function(response) {
	var widthVar = response.width,
	widthValVar = response.widthVal;

	//custom container width
	if (widthVar == '1') {
		var customWidth = document.createElement('style'); 
		customWidth.appendChild(document.createTextNode('#wrap {max-width:' + widthValVar + 'px !important;}'));
		document.documentElement.insertBefore(customWidth);
	}
});

$(document).ready(function() {
	//remove items
	$('.ad_left_w,.ad_right_w,script[src^="http://cad.donga.com/"],script[src^="http://mlbpark.donga.com/acecounter/"],iframe[src^="http://ar.donga.com/"],iframe[src^="http://idolpark.donga.com/"],iframe[src^="http://sports.donga.com/"],iframe[src="http://mlbpark.donga.com/mypage/memo_read.php"],iframe[src="http://mlbpark.donga.com/poll/score.html"]').remove();

	//async load
	$('script[src="./js/comm_js.js"]').attr('async','async');

	//user toolbox remove
	$(document).bind('click',function(){
		$('div[id^="nik_"]').css('display','none');
	});
});
