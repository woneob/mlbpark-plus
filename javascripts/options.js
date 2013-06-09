var doc = document;
var optionName = [
	'titIcon',
	'team',
	'blind',
	'block',
	'blockInfo',
	'blockInput',
	'blockType_1',
	'blockType_2',
	'blockUser',
	'blockUserInfo',
	'blockUserInput',
	'userHistory',
	'reply',
	'userCommentView',
	'video',
	'imageSearch',
	'passwd',
	'notice',
	'shortcut',
	'width',
	'widthVal',
	'slideCurrent',
	'range'
];

for (var k = 0; k < optionName.length; k++){
	optionName[k] = doc.getElementById(optionName[k]);
}

function reset(){
	titIcon.checked = true ;
	team.checked = true ;
	blind.checked = true;
	block.checked = false;
	blockInfo.classList.add('hide');
	blockInput.value = '';
	blockType_1.checked = true;
	blockUser.checked = false;
	blockUserInfo.classList.add('hide');
	blockUserInput.value = '';
	userHistory.checked = false;
	reply.checked = true;
	userCommentView.checked = true;
	video.checked = true;
	imageSearch.checked = true;
	passwd.checked = false;
	notice.checked = false;
	shortcut.checked = true;
	width.checked = false;
	widthVal.value = '858';
	slideCurrent.innerText = '858';
	range.classList.add('hide');
}

(function restore(){
	if (localStorage['titIcon'] == 1 || localStorage['titIcon'] == null) {
		titIcon.checked = true;
	} else {
		titIcon.checked = false;
	}

	if (localStorage['team'] == 1 || localStorage['team'] == null) {
		team.checked = true;
	} else {
		team.checked = false;
	}

	if (localStorage['blind'] == 1 || localStorage['blind'] == null) {
		blind.checked = true;
	} else {
		blind.checked = false;
	}

	if (localStorage['block'] == 0 || localStorage['block'] == null) {
		block.checked = false;
		blockInfo.classList.add('hide');
		blockInput.disabled = true;
	} else {
		block.checked = true;
		blockInfo.classList.remove('hide');
		blockInput.disabled = false;
	}

	if (!(localStorage['blockInput'] == null)) {
		blockInput.value = localStorage['blockInput'];
	} 

	if (localStorage['blockType'] == '2') {
		blockType_2.checked = true;
	} else {
		blockType_1.checked = true;
	}

	if (localStorage['blockUser'] == 0 || localStorage['blockUser'] == null) {
		blockUser.checked = false;
		blockUserInfo.classList.add('hide');
		blockUserInput.disabled = true;
	} else {
		blockUser.checked = true;
		blockUserInfo.classList.remove('hide');
		blockUserInput.disabled = false;
	}

	if (!(localStorage['blockUserInput'] == null)) {
		blockUserInput.value = localStorage['blockUserInput'];
	} 

	if (localStorage['userHistory'] == 1) {
		userHistory.checked = true;
	} else {
		userHistory.checked = false;
	}

	if (localStorage['reply'] == 1 || localStorage['reply'] == null) {
		reply.checked = true;
	} else {
		reply.checked = false;
	}

	if (localStorage['userCommentView'] == 1 || localStorage['userCommentView'] == null) {
		userCommentView.checked = true;
	} else {
		userCommentView.checked = false;
	}

	if (localStorage['video'] == 1 || localStorage['video'] == null) {
		video.checked = true;
	} else {
		video.checked = false;
	}

	if (localStorage['imageSearch'] == 1 || localStorage['imageSearch'] == null) {
		imageSearch.checked = true;
	} else {
		imageSearch.checked = false;
	}

	if (localStorage['passwd'] == 1) {
		passwd.checked = true;
	} else {
		passwd.checked = false;
	}

	if (localStorage['notice'] == 1) {
		notice.checked = true;
	} else {
		notice.checked = false;
	}

	if (localStorage['shortcut'] == 1 || localStorage['shortcut'] == null) {
		shortcut.checked = true;
	} else {
		shortcut.checked = false;
	}

	if (localStorage['width'] == null) {
		width.checked = false;
		range.classList.add('hide');
		slideCurrent.innerText = '858';
	} else if (localStorage['width'] == 0) {
		width.checked = false;
		range.classList.add('hide');
		slideCurrent.innerText = localStorage['widthVal'];
	} else {
		width.checked = true;
		range.classList.remove('hide');
		slideCurrent.innerText = localStorage['widthVal'];
	}

	if (localStorage['widthVal']) {
		widthVal.value = localStorage['widthVal'];
	}
}());

function save(){
	if (titIcon.checked == true) {localStorage['titIcon'] = 1;}
	else {localStorage['titIcon'] = 0;}

	if (team.checked == true) {localStorage['team'] = 1;}
	else {localStorage['team'] = 0;}

	if (blind.checked == true) {localStorage['blind'] = 1;}
	else {localStorage['blind'] = 0;}

	if (block.checked == true) {localStorage['block'] = 1;}
	else {localStorage['block'] = 0;}

	if (!(blockInput.value.length == 0)) {
		var blockInputVar = blockInput.value
			.replace(/\n/g, '') // Remove Linebreak
			.replace(/^[;\s]+|[;]+$/g, '') // Remove starting and ending semicolons
			.replace(/;[;\s]*;/g, ';'); // Remove 2 or more semicolons
		localStorage['blockInput'] = blockInputVar;
		blockInput.value = localStorage['blockInput'];
	} else {
		localStorage['blockInput'] = '';
	}

	if (blockType_1.checked == true) {localStorage['blockType'] = 1;}
	else {localStorage['blockType'] = 2;}

	if (blockUser.checked == true) {localStorage['blockUser'] = 1;}
	else {localStorage['blockUser'] = 0;}

	if (!(blockUserInput.value.length == 0)) {
		var blockUserInputVar = blockUserInput.value
			.replace(/\n/g, '') // Remove Linebreak
			.replace(/^[;\s]+|[;]+$/g, '') // Remove starting and ending semicolons
			.replace(/;[;\s]*;/g, ';'); // Remove 2 or more semicolons
		localStorage['blockUserInput'] = blockUserInputVar;
		blockUserInput.value = localStorage['blockUserInput'];
	} else {
		localStorage['blockUserInput'] = '';
	}

	if (userHistory.checked == true) {localStorage['userHistory'] = 1;}
	else {localStorage['userHistory'] = 0;}

	if (reply.checked == true) {localStorage['reply'] = 1;}
	else {localStorage['reply'] = 0;}

	if (userCommentView.checked == true) {localStorage['userCommentView'] = 1;}
	else {localStorage['userCommentView'] = 0;}

	if (video.checked == true) {localStorage['video'] = 1;}
	else {localStorage['video'] = 0;}

	if (imageSearch.checked == true) {localStorage['imageSearch'] = 1;}
	else {localStorage['imageSearch'] = 0;}

	if (passwd.checked == true) {localStorage['passwd'] = 1;}
	else {localStorage['passwd'] = 0;}

	if (notice.checked == true) {localStorage['notice'] = 1;}
	else {localStorage['notice'] = 0;}

	if (shortcut.checked == true) {localStorage['shortcut'] = 1;}
	else {localStorage['shortcut'] = 0;}

	if (width.checked == true) {localStorage['width'] = 1;}
	else {localStorage['width'] = 0;}

	localStorage['widthVal'] = widthVal.value;

	saveComplete('저장되었습니다.');
}

function removeSaveMsg(){
	var saveMsg = doc.getElementById('saveMsg');
	if (saveMsg){
		saveMsg.parentNode.removeChild(saveMsg);
	}
}

var timeout;
function saveComplete(message){
	removeSaveMsg();

	actionEl = doc.getElementById('action');
	saveMsg = doc.createElement('span');
	saveMsg.id = 'saveMsg';
	saveMsg.innerText = message;
	actionEl.appendChild(saveMsg);

	clearTimeout(timeout);
	timeout = setTimeout(function(){
		actionEl.removeChild(saveMsg);
	}, 1000);
}

window.onload = function(){
	width.onchange = function(){
		console.log(11)
		if (this.checked) {
			range.classList.remove('hide');
		} else {
			range.classList.add('hide');
		}
	}

	widthVal.onchange = function(){
		var newValue = this.value;
		slideCurrent.textContent = newValue;
	}

	block.onchange = function(){
		if (this.checked) {
			blockInfo.classList.remove('hide');
			blockInput.removeAttribute('disabled');
		} else {
			blockInfo.classList.add('hide');
			blockInput.setAttribute('disabled','disabled');
		}
	}

	blockUser.onchange = function(){
		if (this.checked) {
			blockUserInfo.classList.remove('hide');
			blockUserInput.removeAttribute('disabled');
		} else {
			blockUserInfo.classList.add('hide');
			blockUserInput.setAttribute('disabled','disabled');
		}
	}

	var saveBtn = doc.getElementById('save');
	var resetBtn = doc.getElementById('reset');
	saveBtn.onclick = save;
	resetBtn.onclick = reset;
};