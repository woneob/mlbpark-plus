// extension 정보를 담는다.
var extensionInfo;

/**
 * 저장된 내용을 가져와서 화면에 보여준다. 활성화 항목만 체크 표시.
 */
function restore() {
	if (localStorage['titIcon'] == 1 || localStorage['titIcon'] == null) document.getElementById('titIcon').checked = true;
	if (localStorage['team'] == 1 || localStorage['team'] == null) document.getElementById('team').checked = true;
	if (localStorage['block'] == 1) document.getElementById('block').checked = true;
	if (localStorage['blockUser'] == 1) document.getElementById('blockUser').checked = true;
	if (localStorage['userHistory'] == 1) document.getElementById('userHistory').checked = true;

	var checkedEl = document.querySelectorAll(':checked');
	for (var i=0; i < checkedEl.length; i++) {
		checkedEl[i].parentNode.classList.add('checked');
	}
}

/**
 * 화면에 이벤트를 바인딩 시킨다.
 */
function bindEvent() {
	// 제목 차단
	var titleBlockInput = document.getElementById('blockInput');
	var titleBlockBtn = document.getElementById('blockBtn');

	titleBlockBtn.onclick = function(){
		var blockVar = titleBlockInput.value;
		if ('' != blockVar) {
			window.postMessage({
				action: 'titleBlockDelivery',
				title: blockVar,
				input: 'blockInput'
			}, '*');
		}
	}

	// 사용자 차단
	var userBlockInput = document.getElementById('blockUserInput');
	var userBlockBtn = document.getElementById('blockUserBtn');

	userBlockBtn.onclick = function(){
		var blockUserVar = userBlockInput.value;
		if('' != blockUserVar) {
			window.postMessage({
				action:'userBlockDelivery',
				user: blockUserVar,
				input: 'blockUserInput'
			}, '*');
		}
	}

	$('.txtInput').keyup(function(event){
		if(event.keyCode == 13){
			$(this).next('button').click();
		}
	});

	// 옵션 체크박스 - 모든 체크박스에 이벤트 바인딩
	$(':checkbox').on('change', function(event) {
		var $messageBox = $('#message');
		if (this.checked) {
			localStorage[this.id] = 1;
			this.parentNode.classList.add('checked');
		} else {
			localStorage[this.id] = 0;
			this.parentNode.classList.remove('checked');
		}
		$messageBox.text('저장되었습니다.').stop(true, true).show();
		setTimeout(function() {
			$messageBox.fadeOut('slow');
		}, 1000);
	});
}

$(document).ready(function(){
	// extension 정보를 가져와서 버전을 보여준다.
	chrome.management.get(chrome.i18n.getMessage('@@extension_id'), function(result) {
		extensionInfo = result;
		document.getElementById('version').textContent = 'ver. ' + extensionInfo.version;
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