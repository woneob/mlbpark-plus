var doc = document;
var form = doc.forms.form;
var formElements = form.elements;
var formElementLength = formElements.length;
var ls = localStorage;

var defaultValue = {
	isShowTitleIcon: 'true',
	isShowTeamIcon: 'true',
	isBlindContent: 'true',
	isBlockArticle: 'false',
	blockKeywords: '',
	blockType: 'replace',
	isBlockNickname: 'false',
	blockNicknames: '',
	isShowUserHistory: 'false',
	isInsertReplyButton: 'true',
	isEnableCommentView: 'true',
	isResizeVideo: 'true',
	isBlockNotice: 'false',
	isEnableShortcutKey: 'true',
	isEnableContainerWidth: 'false',
	containerWith: '858',
	isSkipPasswordChange: 'false'
};

function restore(obj) {
	var restoreElement = function(elem) {
		var isChecked;
		switch (elem.type) {
			case 'checkbox':
				isChecked = obj[elem.name] === 'true';

				elem.checked = isChecked;

				if (!isChecked && elem.className === 'toggleInput') {
					elem.parentNode.querySelector('.toggleBox').classList.add('hide');
				}

				break;
			case 'radio':
				elem.checked = elem.value == obj[elem.name];
				break;
			case 'textarea':
			case 'range':
			case 'output':
				elem.value = obj[elem.name];
				break;
		}
	};

	for (var i = 0; i < formElementLength; i++) {
		restoreElement(formElements[i]);
	}
}

function save(e) {
	e.preventDefault();

	String.prototype.trimmer = 	function() {
		return this.trim()
			.replace(/\n/g, '')
			.replace(/^[;\s]+|[;]+$/g, '')
			.replace(/;[;\s]*;/g, ';')
			.toString();
	};

	var saveIt = function(elem) {
		if (!elem.name) return;

		switch (elem.type) {
			case 'checkbox':
				ls[elem.name] = elem.checked;
				break;
			case 'radio':
				ls[elem.name] = formElements[elem.name].value;
				break;
			case 'textarea':
				ls[elem.name] = elem.value.trimmer();
				break;
			case 'range':
			case 'output':
				ls[elem.name] = elem.value;
				break;
		}
	};

	for (var i = 0; i < formElementLength; i++) {
		saveIt(formElements[i]);
	}

	saveComplete('저장되었습니다.');
}

function removeSaveMsg() {
	var saveMsg = doc.getElementById('saveMsg');
	if (saveMsg) {
		saveMsg.parentNode.removeChild(saveMsg);
	}
}

var timeout;
function saveComplete(message) {
	removeSaveMsg();

	actionEl = doc.getElementById('action');
	saveMsg = doc.createElement('span');
	saveMsg.id = 'saveMsg';
	saveMsg.innerText = message;
	actionEl.appendChild(saveMsg);

	clearTimeout(timeout);
	timeout = setTimeout(function() {
		actionEl.removeChild(saveMsg);
	}, 1000);
}

function toggleContent() {
	var toggleInput = doc.querySelectorAll('.toggleInput');
	var toggle = function() {
		this.parentNode.querySelector('.toggleBox').classList.toggle('hide');
	};

	for (var i = 0, len = toggleInput.length; i < len; i++) {
		toggleInput[i].addEventListener('change', toggle, false);
	}
}

window.onload = function() {
	restore(ls);
	toggleContent();

	formElements.containerWith[0].addEventListener('change', function() {
		formElements.containerWith[1].textContent = this.value;
	}, false);

	formElements.save.addEventListener('click', save, false);

	formElements.reset.addEventListener('click', function() {
		restore(defaultValue);
	}, false);
};
