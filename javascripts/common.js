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

	//user toolbox remove
	$(document.body).on('click',function(){
		$('div[id^="nik_"]').css('display','none');
	});

	var wrap = document.getElementById('wrap');
	var navi = document.getElementById('navi');
	var naveList = $(navi).html();
	navi.getElementsByClassName('navi_bar')[0].insertAdjacentHTML('beforeEnd','<li id="moreMenu"><button id="moreMenuBtn" type="button">open</button></li>');
	var btn_moreMenu = document.getElementById('moreMenuBtn');
	status = btn_moreMenu.className;

	function AdjustMenu() {
		var windowWidth = document.body.clientWidth;
		if (windowWidth < 580) {
			$(btn_moreMenu).on('click', function(){
				if (status == '' || status == 'closed') {
					CreateMoreMenu();
				} else {
					RemoveMoreMenu();
				}
			});
		} else {
			RemoveMoreMenu();
		}
	}

	function CreateMoreMenu() {
		wrap.insertAdjacentHTML('beforeEnd','<div id="popMenu">' + naveList + '</div>');
		btn_moreMenu.className = 'opened';
		status = 'opened';
	}

	function RemoveMoreMenu() {
		$('#popMenu').remove();
		btn_moreMenu.className = 'closed';
		status = 'closed';
	}

	AdjustMenu();
	$(window).resize(AdjustMenu);
});






