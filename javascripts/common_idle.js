chrome.extension.sendRequest({action:'imageSearch'}, function(response) {
	var imageSearchVar = response.imageSearch;

	if (imageSearchVar === '1') {
		//google search by image
		var $container = $('#container');
		var $article = $('.G13 > div[align="justify"]');
		$contentImg = $article.find('img');

		$(document).ready(function() {
			$contentImg.each(function(){
				var src = $(this).attr('src');
				var pos = $(this).position();
				pos.bottom = pos.top + $(this).height();
				pos.right = pos.left + $(this).width();

				if(src.substr(0,7) != 'http://'){
					src = 'http://mlbpark.donga.com' + src;
				}

				$('<a/>',{
					class: 'btn_iSearch',
					href: 'https://www.google.com/searchbyimage?image_url=' + src,
					target: '_blank',
					title: '구글에서 이미지 검색'
				}).css({
					top: pos.bottom,
					left: pos.right
				}).appendTo($container);
			});
		});
	}
});

function getCookie(name) {
	var nameOfCookie = name + "=";
	var x = 0;

	while ( x <= document.cookie.length ) {
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 ) break;
	}
	return "";
}

if ($('#loginArea a:first-child').text() == '로그아웃'){
	var userId = getCookie("dongauserid");

	$.ajax({
		type: "GET",
		url: 'http://mlbpark.donga.com/mypage/memo.php?id='+userId,
		dataType: "html",
		cache: false,
		success: function(response) {
			if (!(response.indexOf('정상적인 접근이 아닙니다') >= 0)){
				var responseWrapper = $('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, ''));
				from = responseWrapper.find('tr:first-child td[height="25"] strong').text();
				text = responseWrapper.find('textarea').text();
				$('body').append(
					'<div id="memoAlarm">\n'+
					'	<h3>'+from+' 쪽지가 도착했습니다.</h3>\n'+
					'	<p>'+text+'</p>\n'+
					'	<div>\n'+
					'		<a href="http://mlbpark.donga.com/mypage/my_message.php">쪽지함 가기</a>\n'+
					'		<a id="toasterClose" href="#">닫기</a>\n'+
					'	</div>\n'+
					'</div>\n'
				);
				$('#toasterClose').bind('click',function(){
					$('#memoAlarm').fadeOut(300,function(){
						$(this).remove();
					});
					return false;
				});
			}
		}
	});
}

