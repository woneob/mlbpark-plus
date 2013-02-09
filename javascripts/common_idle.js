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

if (window.location.pathname !== '/mbs/commentV.php') {
	var loginArea = document.getElementById('loginArea');
	var loginStatus = loginArea.firstElementChild.textContent;
	if (loginStatus === '로그아웃'){
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
					document.body.insertAdjacentHTML('beforeEnd',
						'<div id="memoAlarm">\n'+
						'	<h3>'+from+' 쪽지가 도착했습니다.</h3>\n'+
						'	<p>'+text+'</p>\n'+
						'	<div>\n'+
						'		<a href="http://mlbpark.donga.com/mypage/my_message.php">쪽지함 가기</a>\n'+
						'		<a id="toasterClose" href="#">닫기</a>\n'+
						'	</div>\n'+
						'</div>\n'
					);
					$('#toasterClose').on('click',function(){
						$('#memoAlarm').fadeOut(300,function(){
							$(this).remove();
						});
						return false;
					});
				}
			}
		});
	}
}