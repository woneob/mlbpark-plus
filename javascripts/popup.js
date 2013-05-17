var doc = document;
var titIcon = doc.getElementById('titIcon'),
	team = doc.getElementById('team'),
	block = doc.getElementById('block'),
	titleBlockInput = doc.getElementById('blockInput'),
	titleBlockBtn = doc.getElementById('blockBtn'),
	blockUser = doc.getElementById('blockUser'),
	userBlockInput = doc.getElementById('blockUserInput'),
	userBlockBtn = doc.getElementById('blockUserBtn'),
	userHistory = doc.getElementById('userHistory'),
	messageBox = doc.getElementById('message');

function restore() {
	if (localStorage['titIcon'] == 1 || localStorage['titIcon'] == null) {
		titIcon.checked = true;
	}

	if (localStorage['team'] == 1 || localStorage['team'] == null) {
		team.checked = true;
	}

	if (localStorage['block'] == 1) {
		block.checked = true;
	}

	if (localStorage['blockUser'] == 1) {
		blockUser.checked = true;
	}

	if (localStorage['userHistory'] == 1) {
		userHistory.checked = true;
	}

	var checkedEl = doc.querySelectorAll(':checked');
	for (var i=0; i < checkedEl.length; i++) {
		checkedEl[i].parentNode.classList.add('checked');
	}
}

function bindEvent() {
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

	$(':checkbox').on('change', function(event) {
		if (this.checked) {
			localStorage[this.id] = 1;
			this.parentNode.classList.add('checked');
		} else {
			localStorage[this.id] = 0;
			this.parentNode.classList.remove('checked');
		}
		saveCpmplete('저장되었습니다.');
	});
}

$(doc).ready(function(){
	chrome.management.get(chrome.i18n.getMessage('@@extension_id'), function(result) {
		doc.getElementById('version').innerText = 'ver. ' + result.version;
	});

	restore();
	bindEvent();
});

window.addEventListener('message', function(event) {
	if (window != event.source) return;

	switch(event.data.action) {
		case 'titleBlockDelivery' :
		case 'userBlockDelivery' :
			chrome.extension.sendMessage({action:event.data.action, data:event.data}, function(response) {
				$('#' + event.data.input).val('');
				if(response.result) {
					saveCpmplete('저장되었습니다.');
					restore();
				} else {
					saveCpmplete(response.message);
				}
			});
		break;
	}
}, false);

function saveCpmplete(message){
	messageBox.innerText = message;
	messageBox.style.display = 'block';

	setTimeout(function() {
		messageBox.style.display = 'none';
	}, 1000);
}