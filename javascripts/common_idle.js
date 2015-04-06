(function($, win, doc) {
	function getCookie(name) {
		var nameOfCookie = name + '=';
		var x = 0;

		while (x <= doc.cookie.length) {
			var y = (x+nameOfCookie.length);
			if (doc.cookie.substring(x, y) == nameOfCookie) {
				if ((endOfCookie=doc.cookie.indexOf(';', y)) == -1) {
					endOfCookie = doc.cookie.length;
				}

				return unescape(doc.cookie.substring(y, endOfCookie));
			}

			x = doc.cookie.indexOf(' ', x) + 1;

			if (x == 0) {
				break;
			}
		}

		return '';
	}

	if (win.location.pathname !== '/mbs/commentV.php') {
		var loginArea = doc.getElementById('loginArea');
		var loginStatus = loginArea.firstElementChild.textContent;

		if (loginStatus === '로그아웃'){
			var userId = getCookie('dongauserid');
			$.ajax({
				type: 'GET',
				url: 'http://mlbpark.donga.com/mypage/memo.php?id='+userId,
				dataType: 'html',
				cache: false,
				success: function(response) {
					if (!(response.indexOf('정상적인 접근이 아닙니다') >= 0)) {
						var responseWrapper = $('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, ''));
						from = responseWrapper.find('tr:first-child td[height="25"] strong').text();
						text = responseWrapper.find('textarea').text();
						doc.body.insertAdjacentHTML('beforeEnd',
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
})(jQuery, window, document);
