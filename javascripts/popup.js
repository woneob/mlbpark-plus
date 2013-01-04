// extension 정보를 담는다.
var extensionInfo;

/**
 * 저장된 내용을 가져와서 화면에 보여준다.
 */
function restore() {
	if (localStorage['titIcon'] == 1 || localStorage['titIcon'] == null) {
		document.getElementById('titIcon').checked = true;
	} else {
		document.getElementById('titIcon').checked = false;
	}

	if (localStorage['team'] == 1 || localStorage['team'] == null) {
		document.getElementById('team').checked = true;
	} else {
		document.getElementById('team').checked = false;
	}

	if (localStorage['block'] == 0 || localStorage['block'] == null) {
		document.getElementById('block').checked = false;
	} else {
		document.getElementById('block').checked = true;
	}

	if (localStorage['blockUser'] == 0 || localStorage['blockUser'] == null) {
		document.getElementById('blockUser').checked = false;
	} else {
		document.getElementById('blockUser').checked = true;
	}

	if (localStorage['userHistory'] == 1) {
		document.getElementById('userHistory').checked = true;
	} else {
		document.getElementById('userHistory').checked = false;
	}
}

/**
 * 화면에 이벤트를 바인딩 시킨다.
 */
function bindEvent() {
	// 제목 차단
	$('#blockBtn').bind('click', function() {
		var blockVar = $('#blockInput').val();
		if('' != blockVar) {
			window.postMessage({
				action:'titleBlockDelivery',
				title: blockVar,
				input: 'blockInput'
			}, '*');
		}
	});
	// 사용자 차단
	$('#blockUserBtn').bind('click', function() {
		var blockUserVar = $('#blockUserInput').val();
		if('' != blockUserVar) {
			window.postMessage({
				action:'userBlockDelivery',
				user: blockUserVar,
				input: 'blockUserInput'
			}, '*');
		}
	});
	// 옵션 체크박스 - 모든 체크박스에 이벤트 바인딩
	$(':checkbox').bind('change', function(event) {
		var $messageBox = $('#status #message');
		if(this.checked) localStorage[this.id] = 1;
		else localStorage[this.id] = 0;
		$messageBox.text('저장되었습니다.').stop(true, true).show();
		setTimeout(function() {
			$messageBox.fadeOut('slow');
		}, 1000);
	});
}


$(window).load(function(){
	// extension 정보를 가져와서 버전을 보여준다.
	chrome.management.get(chrome.i18n.getMessage('@@extension_id'), function(result) {
		extensionInfo = result;
		$('#version').text(extensionInfo.version);
	});

	restore();
	bindEvent();
});

window.addEventListener('message', function(event) {
	// We only accept messages from ourselves
	if (window != event.source) return;

	switch(event.data.action) {
		case 'titleBlockDelivery' :
		case 'userBlockDelivery' :
			chrome.extension.sendMessage({action:event.data.action, data:event.data}, function(response) {
				var $messageBox = $('#status #message');
				$('#' + event.data.input).val('');
				if(response.result) {
					$messageBox.text('저장되었습니다.');
					restore();
				} else {
					$messageBox.text(response.message);
				}
				$messageBox.show();
				setTimeout(function() {
					$messageBox.fadeOut('slow');
				}, 1500);
			});
		break;
	}
}, false);
