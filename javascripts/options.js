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
	blockInfo.style.display = 'none';
	blockInput.value = '';
	blockType_1.checked = true;
	blockUser.checked = false;
	blockUserInfo.style.display = 'none';
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
	range.style.display = 'none';
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
		blockInfo.style.display = 'none';
		blockInput.disabled = true;
	} else {
		block.checked = true;
		blockInfo.style.display = 'block';
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
		blockUserInfo.style.display = 'none';
		blockUserInput.disabled = true;
	} else {
		blockUser.checked = true;
		blockUserInfo.style.display = 'block';
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
		range.style.display = 'none';
		slideCurrent.innerText = '858';
	} else if (localStorage['width'] == 0) {
		width.checked = false;
		range.style.display = 'none';
		slideCurrent.innerText = localStorage['widthVal'];
	} else {
		width.checked = true;
		range.style.display = 'block';
		slideCurrent.innerText = localStorage['widthVal'];
	}

	if (localStorage['widthVal']) {
		widthVal.value = localStorage['widthVal'];
	}
}());

function save(){
	if (titIcon.checked == true) {localStorage["titIcon"] = 1;}
	else {localStorage["titIcon"] = 0;}

	if (team.checked == true) {localStorage["team"] = 1;}
	else {localStorage["team"] = 0;}

	if (blind.checked == true) {localStorage["blind"] = 1;}
	else {localStorage["blind"] = 0;}

	if (block.checked == true) {localStorage["block"] = 1;}
	else {localStorage["block"] = 0;}

	if (!(blockInput.value.length == 0)) {
		// 설명을 위해 한 줄씩 적용 - 속도가 중요한 부분 아님
		// point: 각 라인은 콤마로 끝나도록 수정되어야 함 - 화면의 차단하는 코드에서는 라인 구분 없이 콤마로만 구분
		var blockInputVar = blockInput.value
			.replace(/,[ \t]*\n/g, ',\n')	// 각 라인의 마지막 쉼표 뒤 공백/탭 제거
			.replace(/(,*\n)+/g, ',\n')		// 연속된 쉼표 제거
			.replace(/\n,+/g, '\n')			// 쉼표로 시작되는 라인 제거
			.replace(/(^,+)|(,+$)/g, '');	// 맨 처음/마지막 쉼표 제거
		localStorage["blockInput"] = blockInputVar;
		blockInput.value = localStorage["blockInput"];
	} else {
		localStorage["blockInput"] = '';
		localStorage["block"] = 0;
		block.checked = false;
	}

	if (blockType_1.checked == true) {localStorage["blockType"] = 1;}
	else {localStorage["blockType"] = 2;}

	if (blockUser.checked == true) {localStorage["blockUser"] = 1;}
	else {localStorage["blockUser"] = 0;}

	if (!(blockUserInput.value.length == 0)) {
		// 설명을 위해 한 줄씩 적용 - 속도가 중요한 부분 아님
		// point: 각 라인은 콤마로 끝나도록 수정되어야 함 - 화면의 차단하는 코드에서는 라인 구분 없이 콤마로만 구분
		var blockUserInputVar = blockUserInput.value
			.replace(/,\t*\n/g, ',\n')		// 각 라인의 마지막 쉼표 뒤 탭 제거
			.replace(/(,*\n)+/g, ',\n')		// 연속된 쉼표 제거
			.replace(/\n,+/g, '\n')			// 쉼표로 시작되는 라인 제거
			.replace(/(^,+)|(,+$)/g, '');	// 맨 처음/마지막 쉼표 제거
		localStorage["blockUserInput"] = blockUserInputVar;
		blockUserInput.value = localStorage["blockUserInput"];
	} else {
		localStorage["blockUserInput"] = '';
	}

	if (userHistory.checked == true) {localStorage["userHistory"] = 1;}
	else {localStorage["userHistory"] = 0;}

	if (reply.checked == true) {localStorage["reply"] = 1;}
	else {localStorage["reply"] = 0;}

	if (userCommentView.checked == true) {localStorage["userCommentView"] = 1;}
	else {localStorage["userCommentView"] = 0;}

	if (video.checked == true) {localStorage["video"] = 1;}
	else {localStorage["video"] = 0;}

	if (imageSearch.checked == true) {localStorage["imageSearch"] = 1;}
	else {localStorage["imageSearch"] = 0;}

	if (passwd.checked == true) {localStorage["passwd"] = 1;}
	else {localStorage["passwd"] = 0;}

	if (notice.checked == true) {localStorage["notice"] = 1;}
	else {localStorage["notice"] = 0;}

	if (shortcut.checked == true) {localStorage["shortcut"] = 1;}
	else {localStorage["shortcut"] = 0;}

	if (width.checked == true) {localStorage["width"] = 1;}
	else {localStorage["width"] = 0;}

	localStorage['widthVal'] = widthVal.value;

	$('.saveMsg').remove();
	$('#action').append('<span class="saveMsg">저장되었습니다.</span>');
	setTimeout(function() {
		$('.saveMsg').fadeOut('slow',function(){
			$(this).remove();
		});
	}, 1000);
}

$(window).load(function(){
	$('#width').change(function(){
		var $range = $('#range');
		if (this.checked) {
				$range.slideDown(200);
		} else {
				$range.slideUp(200);
		}
	});

	$('#widthVal').change(function(){
		var newValue = this.value;
		$('#slideCurrent').text(newValue);
	});

	$('#block').change(function(){
		var $blockInfo = $('#blockInfo');
		$blockInput = $('#blockInput');

		if (this.checked) {
			$blockInfo.slideDown(200);
			$blockInput.removeAttr('disabled');
		} else {
			$blockInfo.slideUp(200);
			$blockInput.attr('disabled','disabled');
		}
	});

	$('#blockUser').change(function(){
		var $blockUserInfo = $('#blockUserInfo');
		$blockUserInput = $('#blockUserInput');

		if (this.checked) {
			$blockUserInfo.slideDown(200);
			$blockUserInput.removeAttr('disabled');
		} else {
			$blockUserInfo.slideUp(200);
			$blockUserInput.attr('disabled','disabled');
		}
	});

	var saveBtn = doc.getElementById('save');
	var resetBtn = doc.getElementById('reset');
	saveBtn.onclick = save;
	resetBtn.onclick = reset;
});