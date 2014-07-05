var doc = document;
var form = doc.forms.popupForm;
var formElements = form.elements;
var formElementLength = formElements.length;
var ls = localStorage;

function restore() {
	for (var i = 0; i < formElementLength; i++) {
		var thisElem = formElements[i];

		if (ls[thisElem.name] === 'true') {
			thisElem.checked = true;
			thisElem.parentNode.classList.add('checked');
		}
	}
}

var timeout;

function saveCpmplete(message){
	var messageBox = doc.getElementById('message');
	messageBox.innerText = message;
	messageBox.style.display = 'block';

	timeout = setTimeout(function() {
		messageBox.style.display = 'none';
	}, 1000);
}

(function bindEvent() {
	formElements.blockBtn.addEventListener('click', function(){
		var input = formElements.blockInput;

		if (!input.value.trim()) return;

		window.postMessage({
			action: 'titleBlockDelivery',
			title: input.value,
			inputName: input.id
		}, '*');
	}, false);

	formElements.blockUserBtn.addEventListener('click', function(){
		var input = formElements.blockUserInput;
		if (!input.value.trim()) return;

		window.postMessage({
			action: 'userBlockDelivery',
			user: input.value,
			inputName: input.id
		}, '*');
	}, false);

	$('.txtInput').keyup(function(event){
		if(event.keyCode == 13){
			$(this).next('button').click();
		}
	});

	$(':checkbox').on('change', function(event) {
		ls[this.name] = this.checked;
		this.parentNode.classList.toggle('checked');

		clearTimeout(timeout);
		saveCpmplete('저장되었습니다.');
	});
}());

$(doc).ready(function(){
	restore();

	chrome.management.get(chrome.i18n.getMessage('@@extension_id'), function(result) {
		doc.getElementById('version').innerText = 'ver. ' + result.version;
	});
});

window.addEventListener('message', function(event) {
	if (window != event.source) return;

	switch(event.data.action) {
		case 'titleBlockDelivery' :
		case 'userBlockDelivery' :
			chrome.extension.sendMessage({action:event.data.action, data:event.data}, function(response) {
				formElements[event.data.inputName].value = '';

				if(response.result) {
					saveCpmplete('저장되었습니다.');
				} else {
					saveCpmplete(response.message);
				}
			});
		break;
	}
	clearTimeout(timeout);
}, false);