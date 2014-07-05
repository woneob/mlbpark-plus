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
function showMessage(message) {
	var messageBox = doc.getElementById('message'),

	show = function() {
		messageBox.innerText = message;
		messageBox.style.display = 'block';
	},

	hide = function() {
		messageBox.removeAttribute('style');
	},

	init = (function() {
		show();
		clearTimeout(timeout);
		timeout = setTimeout(hide, 1000);
	})();
}

(function bindEvent() {
	formElements.blockBtn.addEventListener('click', function(){
		var input = formElements.blockInput;

		if (!input.value.trim()) return;

		window.postMessage({
			action: 'titleBlockDelivery',
			content: input.value,
			inputName: input.id
		}, '*');
	}, false);

	formElements.blockUserBtn.addEventListener('click', function(){
		var input = formElements.blockUserInput;
		if (!input.value.trim()) return;

		window.postMessage({
			action: 'userBlockDelivery',
			content: input.value,
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

		showMessage('저장되었습니다.');
	});
}());

$(doc).ready(function(){
	restore();

	chrome.management.get(chrome.i18n.getMessage('@@extension_id'), function(result) {
		doc.getElementById('version').innerText = 'ver. ' + result.version;
	});
});

window.addEventListener('message', function(e) {
	if (window != e.source) return;

	switch(e.data.action) {
		case 'titleBlockDelivery':
		case 'userBlockDelivery':
			chrome.extension.sendMessage(
				{
					action: e.data.action,
					data: e.data
				},
				function(response) {
					formElements[e.data.inputName].value = '';

					if(response.result) {
						showMessage('저장되었습니다.');
					} else {
						showMessage(response.message);
					}
				}
			);
		break;
	}
}, false);