var loc = win.location;
var locHref = loc.href;
var path = loc.pathname;
var titIcons = {
	game: /디아|\[스타|프야매|lol|게임/i,
	female: /여자|처자|ㅊㅈ|여친|녀 |여성/,
	twitter: /트윗|트위터/,
	warn: /혐짤|\[혐오|혐오\]|\(혐오|혐오\)|주의\]|주의\)/,
	adult: /19금|\[19\] |\(19\)|주번나|성진국/,
	tv: /swf|avi|플짤|영상|flv/i,
	vs: /(vs)/i,
	music: /브금|bgm|음악|가수|노래|뮤직/i,
	question: /질문|요\?|여\?|죠\?|나요/,
	img: /짤방|jpg|gif|jyp/i,
	mobile: /맛폰/
};
var teams = {
	kia: {
		teamName: /(\[기아\]\s?|\[kia\]\s?)/i,
		searchKeyword: 'kia+OR+%B1%E2%BE%C6'
	},
	nexen: {
		teamName: /(\[넥센\]\s?)/,
		searchKeyword: '%B3%D8%BC%BE'
	},
	doosan: {
		teamName: /(\[두산\]\s?)/,
		searchKeyword: '%B5%CE%BB%EA'
	},
	lotte: {
		teamName: /(\[롯데\]\s?)/,
		searchKeyword: '%B7%D4%B5%A5'
	},
	samsung: {
		teamName: /(\[삼성\]\s?)/,
		searchKeyword: '%BB%EF%BC%BA'
	},
	sk: {
		teamName: /(\[sk\]\s?)/i,
		searchKeyword: 'sk+OR+%BF%A1%BD%BA%C4%C9%C0%CC'
	},
	nc: {
		teamName: /(\[엔씨\]\s?|\[nc\]\s?)/i,
		searchKeyword: 'nc+OR+%BF%A3%BE%BE'
	},
	lg: {
		teamName: /(\[엘지\]\s?|\[lg\]\s?)/i,
		searchKeyword: 'lg+OR+%BF%A4%C1%F6'
	},
	hanwha: {
		teamName: /(\[한화\]\s?)/,
		searchKeyword: '%C7%D1%C8%AD'
	}
};

// Repeat parentNode
function up(el, n) {
	var parent = el;
	for(var i = 0; i < n; i++) {
		parent = parent.parentNode;
	}

	return parent;
}

function readCookie(key) {
	return (doc.cookie.match('(^|; )' + key + '=([^;]*)') || 0)[2];
}

function blockedTitle(elem, originTitle, keyword){
	var blockedTitleConfirm = function(e){
		if(!confirm('차단된 글을 열람하시겠습니까?')){
			e.preventDefault();
		}
	};

	elem.innerText = '차단 키워드('+ keyword +')가 포함된 글 입니다';
	elem.className = 'blockTitle';
	elem.title = '제목: ' + originTitle;
	elem.addEventListener('click', blockedTitleConfirm, false);
}

function createBlindButton(keyword, target){
	var containerClassName,
		buttonId,
		buttonText1,
		buttonText2;

	if (keyword === 'warn') {
		containerClassName = 'grayscale';
		buttonId = 'btn_color';
		buttonText1 = '경고 문구가 포함되어 본문을 흑백처리 합니다.';
		buttonText2 = ' 원문을 보시려면 클릭하세요.';
	} else {
		containerClassName = 'blind';
		buttonId = 'btn_blind';
		buttonText1 = '댓글에 '+ keyword + '가 포함된 글 입니다.';
		buttonText2 = ' 본문을 보시려면 클릭하세요.';
	}

	var buttonClick = function(){
		this.className = 'displayNone';

		if (keyword === 'warn') {
			target.classList.remove('grayscale');
		} else {
			target.style.maxHeight = target.offsetHeight + 'px';
			target.className += ' slide';
		}
	};

	target.className = containerClassName;

	var btnTitle = doc.createElement('span');
	btnTitle.innerText = buttonText1;

	var btnText = doc.createTextNode(buttonText2);
	var button = doc.createElement('div');

	button.id = buttonId;
	button.className = 'warnBtn';
	button.appendChild(btnTitle);
	button.appendChild(btnText);
	button.addEventListener('click', buttonClick, false);

	target.insertAdjacentElement('beforeBegin', button);
}

function Options(res) {
	this.isShowTitleIcon = res.isShowTitleIcon === 'true';
	this.isShowTeamIcon = res.isShowTeamIcon === 'true' && locHref.indexOf('mbsC=kbotown') > -1;
	this.isBlindContent = res.isBlindContent === 'true';
	this.blockKeywords = res.blockKeywords;
	this.blockKeywordslength = this.blockKeywords.length;
	this.isBlockArticle = res.isBlockArticle === 'true' && this.blockKeywordslength;
	this.blockType = res.blockType;
	this.blockNicknames = res.blockNicknames;
	this.blockNicknamesLength = this.blockNicknames.length;
	this.isBlockNickname = res.isBlockNickname === 'true';
	this.isShowUserHistory = res.isShowUserHistory === 'true';
	this.isInsertReplyButton = res.isInsertReplyButton === 'true';
	this.isEnableCommentView = res.isEnableCommentView === 'true';
	this.isResizeVideo = res.isResizeVideo === 'true';
	this.isBlockNotice = res.isBlockNotice === 'true';
	this.isEnableShortcutKey = res.isEnableShortcutKey === 'true';
}

function subjectLoop(links, linkDepth) {
	var teamSearchUrl = '/mbs/articleL.php?mbsC=kbotown&mbsW=search&keyword=';

	var subjectBlocker = {
		hidden: function(t) {
			up(t, 6).className = 'displayNone';
		},
		replace: function(t, title, keyword) {
			blockedTitle(t, title, keyword);
		}
	};

	var createTeamIcon = function(t, k, matchKeyword) {
		var label = doc.createElement('a');
		label.href = teamSearchUrl + teams[k].searchKeyword;
		label.className = 'teamIcon';
		label.setAttribute('data-team', k);
		t.innerText = title.replace(matchKeyword, '');
		t.parentNode.insertBefore(label, t);
	};

	listLinkLoop:
	for (var i = 0, len = links.length; i < len; i++) {
		var t = links[i].childNodes[linkDepth];
		var title = t.innerText.toLowerCase();

		// block subject
		if (o.isBlockArticle) {
			for (var b = 0; b < o.blockKeywordslength; b++) {
				var keyword = o.blockKeywords[b];

				if (title.indexOf(keyword) !== -1) {
					subjectBlocker[o.blockType](t, title, keyword);
					continue listLinkLoop;
				}
			}
		}

		// title icon
		if (o.isShowTitleIcon) {
			for (var key in titIcons) {
				if (titIcons[key].test(title)) {
					t.className = 'ico ico_' + key;
					break;
				}
			}
		}

		// team icon
		if (o.isShowTeamIcon) {
			for (var k in teams) {
				var matched = teams[k].teamName.exec(title);
				if (matched) {
					createTeamIcon(t, k, matched[1]);
					break;
				}
			}
		}
	}
}

function blockNotice() {
	//notice blind
	if (!o.isBlockNotice) {
		return;
	}

	doc.documentElement.classList.add('blockedNotice');
}

function nicknameLoop(nickEl, upCount) {
	//user block
	if (!o.isBlockNickname) return;

	for (var i = 0, len = nickEl.length; i < len; i++) {
		if (o.blockNicknames.indexOf(nickEl[i].text) > -1) {
			up(nickEl[i], upCount).className = 'displayNone';
		}
	}
}

function bestArticleLoop() {
	if (!o.isBlockArticle) return;

	var bestLink = doc.querySelectorAll('td[width="190"] a');
	var bestLinkLen = bestLink.length;

	var blocker = {
		hidden: function(t) {
			var upCount = t.parentNode.tagName == 'STRONG' ? 3 : 2;
			up(t, upCount).className = 'displayNone';
		},
		replace: function(t, title, keyword) {
			blockedTitle(t, title, o.blockKeywords[b]);
		}
	};

	for (var i = 0; i < bestLinkLen; i++) {
		var t = bestLink[i];
		var title = t.text.toLowerCase();

		for (var b = 0; b < o.blockKeywordslength; b++) {
			if (title.indexOf(o.blockKeywords[b]) !== -1) {
				blocker[o.blockType](t, title, o.blockKeywords[b]);
				break;
			}
		}
	}
}

function userBlock_cmt(){
	if (o.isBlockNickname) {
		var CmtNickEl = doc.querySelectorAll('td[width="140"] > font > a');

		for (var u = 0, len = CmtNickEl.length; u < len; u++) {
			for (var i = 0; i < o.blockNicknamesLength; i++) {
				if (CmtNickEl[u].innerText === o.blockNicknames[i]) {
					up(CmtNickEl[u], 7).className = 'displayNone';
					break;
				}
			}
		}
	}
}

function userBlockClick(nickname) {
	win.postMessage({
		action: 'userBlockDelivery',
		content: nickname
	}, '*');
}

function addUserBlock(scop){
	var userMenu = scop.querySelectorAll('div[id^=nik_]');

	var insertMenu = function(t) {
		var nickname = t.nextElementSibling.innerText;
		var blockLiEl = doc.createElement('li');
		blockLiEl.innerText = '닉네임 차단';
		blockLiEl.addEventListener('click', userBlockClick.bind(null, nickname), false);

		t.getElementsByTagName('ul')[0].appendChild(blockLiEl);
	};

	for (var i = 0, len = userMenu.length; i < len; i++) {
		insertMenu(userMenu[i]);
	}
}

function showUserHistory(nickname, userId, article) {
	var historyTitleEl = doc.createElement('h3');
	historyTitleEl.innerText = nickname;
	historyTitleEl.title = userId;

	var historyMoreBtn = doc.createElement('button');
	historyMoreBtn.type = 'button';
	historyMoreBtn.innerText = '[더 보기]';
	historyMoreBtn.setAttribute('onclick','MlbNewWindow2(\'http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid='+userId+'\',\'550\',\'500\')');

	var historyHeadEl = doc.createElement('div');
	historyHeadEl.className = 'historyHead';
	historyHeadEl.appendChild(historyTitleEl);
	historyHeadEl.appendChild(historyMoreBtn);

	var historyListEl = doc.createElement('div');
	historyListEl.id = 'historyList';

	var historyEl = doc.createElement('div');
	historyEl.id = 'history';
	historyEl.appendChild(historyHeadEl);
	historyEl.appendChild(historyListEl);

	article.insertAdjacentElement('afterEnd',historyEl);

	$.ajax({
		type: 'GET',
		url: 'http://mlbpark.donga.com/mypage/my_bulletin2011.php',
		data: {mbsUid: userId},
		cache: false,
		timeout: 5000,
		success: function(response){
			$(historyListEl).append($(response).find('td[bgcolor="#FFFFFF"] > table:nth-child(2)')[0].outerHTML)
				.find('a[target]')
				.removeAttr('target');
		},
		error: function(xhr, textStatus, errorThrown){
			var errorEl = doc.createElement('p');
			errorEl.id = 'errerMessage';
			errorEl.innerText = '오류가 발생하여 최근 글을 불러올 수 없습니다. ';
			historyListEl.appendChild(errorEl);
		}
	});
}

function prerender(arr) {
	var target = doc.head;

	for (var i = 0, len = arr.length; i < len; i++) {
		var elem = doc.createElement('link');
		elem.rel = 'prerender';
		elem.href = arr[i];
		target.appendChild(elem);
	}
}

String.prototype.urlReplace = function() {
	// http://, https://, ftp://
	var urlPattern = /[^'"](\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

	// www. sans http:// or https://
	var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

	return this
		.replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
		.replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>');
};


$.expr[':'].Contains = function(a,i,m){
	return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
};

function blibdContent(subject, article, myArea) {
	if(titIcons.warn.test(subject)) {
		createBlindButton('warn', article);
		return;
	}

	var $myArea = $(myArea);

	if ($myArea.find('.G12:Contains("COB")').length > 0) {
		createBlindButton('COB', article);
	} else if ($myArea.find('.G12:contains("비누")').length > 0) {
		createBlindButton('비누', article);
	}
}

function showUserId(userEl, userId) {
	var idEl = doc.createElement('span');
	idEl.className = 'userIdVal';
	idEl.innerText = '(' + userId + ')';
	userEl.parentNode.appendChild(idEl);
}

function resizeVideo() {
	var vdoCss = doc.createElement('link');
	vdoCss.rel = 'stylesheet';
	vdoCss.href = chrome.extension.getURL('/css/video.css');
	doc.head.appendChild(vdoCss);
}

function viewVoter(mbsC, mbsIdx, container){
	var voterGroud = doc.querySelector('td.D11[width="117"]');

	var child;
	while (true) {
		child = voterGroud.lastChild;

		if (!child) break;
		voterGroud.removeChild(child);
	}

	var removeUserMenu = function() {
		var userMenuElems = doc.getElementsByClassName('userMenu');

		for (var i = 0, len = userMenuElems.length; i < len; i++) {
			userMenuElems[i].remove();
		}
	};

	var createUserMenu = function(e) {
		removeUserMenu();

		var userId = this.getElementsByTagName('em')[0].textContent.trim();
		var nickname = this.firstChild.textContent.trim();
		var menu = [
			{
				name: '쪽지보내기',
				action: 'MlbNewWindow("http://mlbpark.donga.com/mypage/memo_write.php?mode=send&id='+ userId +'")'
			},
			{
				name: '자기소개',
				action: 'MlbNewWindow2("http://mlbpark.donga.com/mbs/userIntroV.php?mbsUid='+ userId +'", "530", "390")'
			},
			{
				name: '등급확인',
				action: 'UserAja("'+ userId +'","G")'
			},
			{
				name: '가입일',
				action: 'UserAja("'+ userId +'","R")'
			},
			{
				name: '게시물보기',
				action: 'MlbNewWindow2("http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid='+ userId +'", "550", "500")'
			}
		];

		var ul = doc.createElement('ul');
		ul.className = 'userMenu';

		var liFrag = doc.createDocumentFragment();
		var li;

		for (var i = 0, len = menu.length; i < len; i++) {
			li = doc.createElement('li');
			li.setAttribute('onclick', menu[i].action);
			li.textContent = menu[i].name;
			li.addEventListener('click',removeUserMenu, false);
			liFrag.appendChild(li);
		}

		if (o.isBlockNickname) {
			li = doc.createElement('li');
			li.textContent = '닉네임 차단';
			li.addEventListener('click', function() {
				userBlockClick(nickname);
				removeUserMenu();
			}, false);
			liFrag.appendChild(li);
		}

		ul.appendChild(liFrag);
		ul.style.top = e.pageY + 10 +'px';
		ul.style.left = e.pageX + 10 + 'px';

		doc.body.appendChild(ul);
		win.addEventListener('resize', removeUserMenu, false);
	};

	var voterList;
	var voterOl;

	var loadList = function(callback) {
		var listFrag = doc.createDocumentFragment();

		$.ajax('http://mlbpark.donga.com/mbs/articleVoteList.php', {
			type: 'GET',
			data: {
				bbs: mbsC,
				article_id: mbsIdx
			},
			success: function(data){
				if(data === ''){
					var emptyMsg = doc.createElement('li');
					emptyMsg.className = 'emptyMsg';
					emptyMsg.innerText = '아직 추천한 사람이 없습니다';
					listFrag.appendChild(emptyMsg);
				} else {
					var regexp = /<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g;
					var dataArray = data.match(regexp);
					var elem;
					var userNick;

					for (var i = 0, len = dataArray.length; i < len; i++) {
						elem = doc.createElement('ul');
						elem.innerHTML = dataArray[i];
						elem = elem.firstChild;
						userNick = elem.firstChild.textContent;

						if (o.isBlockNickname && o.blockNicknames.indexOf(userNick) > -1) {
							elem.className = 'blockUser';
						}

						elem.addEventListener('click', createUserMenu, false);
						listFrag.appendChild(elem);
					}
				}
			},
			complete: function() {
				callback(listFrag);
			}
		});
	};

	var createContents = function() {
		var voterListHeadding = doc.createElement('h3');
		voterListHeadding.innerText = '추천한 사람들';

		var voterListClose = doc.createElement('span');
		voterListClose.id = 'voterListClose';
		voterListClose.innerText = 'X';
		voterListClose.addEventListener('click', function(){
			voterList.style.display = 'none';
			removeUserMenu();
		});

		var voterListHead = doc.createElement('header');
		voterListHead.className = 'voterListHead';
		voterListHead.appendChild(voterListHeadding);
		voterListHead.appendChild(voterListClose);

		voterOl = doc.createElement('ol');
		loadList(function(res) {
			voterOl.appendChild(res);
		});

		voterList = doc.createElement('div');
		voterList.id = 'voterList';
		voterList.appendChild(voterListHead);
		voterList.appendChild(voterOl);
		voterList.addEventListener('click', function(e){
			e.stopPropagation();
		});

		voterGroud.appendChild(voterList);
	};

	var isLoaded = false;

	var viewVoterBtn = doc.createElement('span');
	viewVoterBtn.id = 'viewVoter';
	viewVoterBtn.innerText = '추천인 보기';
	viewVoterBtn.addEventListener('click', function(e) {
		e.stopPropagation();

		if (!isLoaded) {
			createContents();
			isLoaded = true;
		}

		voterList.style.display = voterList.style.display === 'block' ? 'none': 'block';
	}, false);

	voterGroud.appendChild(viewVoterBtn);
}

function commentLoop(nickname, mbsC, wday, mbsIdx) {
	var cmtName = myArea.querySelectorAll('td[width="140"] a');

	var removeModal = function() {
		var modal = doc.getElementsByClassName('commentModal');
		for (var i = 0, len = modal.length; i < len; i++) {
			modal[i].remove();
		}
	};

	var createModal = function(t, res) {
		removeModal();

		var selectUser = t.previousSibling.innerText;
		var resWrapper = doc.createElement('div');
		resWrapper.innerHTML = res.replace(/<script(.|\s)*?\/script>/g, '');

		var $cmt = $(resWrapper).find('a[title=" 에게 메모 보내기"]:contains("' + selectUser + '")');
		var cmtCount = $cmt.length;
		var commentFrag = doc.createDocumentFragment();

		$cmt.each(function(i, v) {
			var parsedHTML = $(this).closest('td').nextAll();

			var content = doc.createElement('div');
			content.className = 'content';
			content.innerHTML = parsedHTML[0].querySelector('.G12').innerHTML.trim();

			var datetime = doc.createElement('span');
			datetime.className = 'datetime';
			datetime.innerHTML = parsedHTML[1].querySelector('font[color="666666"]').innerHTML.trim();

			var li = doc.createElement('li');
			li.appendChild(content);
			li.appendChild(datetime);
			commentFrag.appendChild(li);
		});

		var userEl = doc.createElement('string');
		userEl.textContent = selectUser;

		var h3Text = doc.createTextNode(' 님이 이 글에 남긴 댓글');

		var cmtCountEl = doc.createElement('span');
		cmtCountEl.id = 'cmtCount';
		cmtCountEl.textContent = ['(', cmtCount, ')'].join('');

		var h3El = doc.createElement('h3');
		h3El.appendChild(userEl);
		h3El.appendChild(h3Text);
		h3El.appendChild(cmtCountEl);

		var closeBtnEl = doc.createElement('button');
		closeBtnEl.type = 'button';
		closeBtnEl.id = 'commentModalClose';
		closeBtnEl.title = '닫기';
		closeBtnEl.textContent = 'close';
		closeBtnEl.addEventListener('click', removeModal, false);

		var modalHeadEl = doc.createElement('div');
		modalHeadEl.id = 'modalHead';
		modalHeadEl.appendChild(h3El);
		modalHeadEl.appendChild(closeBtnEl);

		var cmtList = doc.createElement('ul');
		cmtList.id = 'userCmtList';
		cmtList.appendChild(commentFrag);

		var modalTextareaEl = doc.createElement('textarea');
		modalTextareaEl.id = 'modalFormTextarea';
		modalTextareaEl.name = 'line_content';
		modalTextareaEl.cols = 75;
		modalTextareaEl.rows = 3;
		modalTextareaEl.setAttribute('autocomplete', 'off');
		modalTextareaEl.value = selectUser + '// ';

		if (!readCookie('mlbuserid')) {
			modalTextareaEl.readOnly = true;
			modalTextareaEl.addEventListener('click', function() {
				if (confirm('로그인 후 사용 가능합니다.\n로그인 페이지로 이동하시겠습니까?')) {
					win.location = 'http://www.donga.com/members/login.php?gourl=' + escape(locHref);
				}
			}, true);
		}

		var modalSubmitBtn = doc.createElement('button');
		modalSubmitBtn.type = 'submit';
		modalSubmitBtn.textContent = '댓글 등록';

		var modalForm = doc.createElement('form');
		modalForm.id = 'modalForm';
		modalForm.name = 'writeForm2';
		modalForm.method = 'post';
		modalForm.action = 'commentWE.php';
		modalForm.appendChild(modalTextareaEl);
		modalForm.appendChild(modalSubmitBtn);

		var commentModalMaskEl = doc.createElement('div');
		commentModalMaskEl.id = 'commentModalMask';
		commentModalMaskEl.addEventListener('click', removeModal, false);

		var commentModalBoxEl = doc.createElement('div');
		commentModalBoxEl.id = 'commentModalBox';
		commentModalBoxEl.appendChild(modalHeadEl);
		commentModalBoxEl.appendChild(cmtList);
		commentModalBoxEl.appendChild(modalForm);

		var commentModalEl = doc.createElement('div');
		commentModalEl.id = 'commentModal';
		commentModalEl.className = 'commentModal';
		commentModalEl.appendChild(commentModalMaskEl);
		commentModalEl.appendChild(commentModalBoxEl);

		doc.body.insertAdjacentElement('beforeEnd', commentModalEl);
	};

	var commentLoad = function() {
		var t = this;

		$.ajax('http://mlbpark.donga.com/mbs/commentRV.php', {
			type: 'GET',
			data: {
				mbsC: mbsC,
				comment_ymd: wday,
				comment_idx: mbsIdx
			},
			cache: false,
			beforeSend: function() {
				t.classList.add('userCmtLoading');
			},
			success: function(res) {
				createModal(t, res);
			},
			complete: function() {
				t.classList.remove('userCmtLoading');
			}
		});
	};

	var createCmtViewBtn = function() {
		var viewCmt = doc.createElement('button');
		viewCmt.type = 'button';
		viewCmt.className = 'btn_userCmt';
		viewCmt.title = '이 글에 단 댓글 보기';
		viewCmt.innerText = '?';
		viewCmt.addEventListener('click', commentLoad, false);

		return viewCmt;
	};

	for (var i = 0, len = cmtName.length; i < len; i++) {
		var t = cmtName[i];

		//highlight comment writer
		if (t.innerText === nickname) {
			t.className = 'me';
		}

		//view userComment
		if (o.isEnableCommentView) {
			t.parentNode.appendChild(createCmtViewBtn());
		}
	}
}

function replyButton(textarea, myArea){
	var cmtTxt = myArea.querySelectorAll('.G12');
	var cmtTxtLen = cmtTxt.length;
	var buttonClick = function() {
		if (textarea.value !== '' && !confirm('아직 작성 중인 댓글이 있습니다.\n다시 작성하시겠습니까?')){
			return false;
		}

		var thisId = this.dataset.idx;

		var cmtUsername = up(cmtTxt[thisId], 5).children[0].getElementsByTagName('a')[0].innerText;
		textarea.focus();
		textarea.value = cmtUsername + '// ';
	};

	if (o.isInsertReplyButton && cmtTxtLen > 0) {
		for (var i = 0; i < cmtTxtLen; i++) {
			var replyBtn = doc.createElement('button');
			replyBtn.type = 'button';
			replyBtn.className = 'btn_reply';
			replyBtn.title = '답글 달기';
			replyBtn.innerText = '[답글]';
			replyBtn.dataset.idx = i;
			replyBtn.addEventListener('click', buttonClick, false);
			cmtTxt[i].appendChild(replyBtn);
		}
	}
}

chrome.extension.sendMessage({action:'mbs'}, function(response) {
	o = new Options(response);

	blockNotice();

	doc.addEventListener('DOMContentLoaded', function(){
		var container =  doc.getElementById('container');
		var listLink;
		var linkDepth;
		var nickEl;
		var upCount;

		if (path !== '/mbs/commentV.php') {
			listLink = container.getElementsByClassName('G12read');

			if (path == '/bbs/mlb_today.php') {
				linkDepth = 0;
				nickEl = container.querySelectorAll('td[width="82"] > font');
				upCount = 6;
			} else {
				linkDepth = 1;
				nickEl = container.querySelectorAll('td[width="82"] > font > a');
				upCount = 7;
			}

			// KBL bbs only
			if (o.isShowTeamIcon) {
				doc.body.id = 'team_show';
			}

			subjectLoop(listLink, linkDepth);
			nicknameLoop(nickEl, upCount);
			bestArticleLoop();
		}

		var myArea;
		var subject;
		var article;
		var userEl;
		var userId;
		var nickname;
		var images;
		var mbsC;
		var mbsIdx;
		var wdayKey;
		var wday;

		if (locHref.indexOf('V.php') > -1){
			myArea = doc.getElementById('myArea');

			mbsC = doc.getElementsByName('mbsC')[0].value;
			mbsIdx =  doc.getElementsByName('mbsIdx')[0].value;
			wdayKey = (path == '/mbs/commentV.php') ? 'co_day' : 'wday';
			wday = doc.getElementsByName(wdayKey)[0].value;

			userBlock_cmt();

			if (path == '/mbs/articleV.php') {
				subject = container.getElementsByTagName('strong')[0].innerText;
				article = doc.querySelector('.G13 > div[align="justify"]');
				userEl = doc.querySelector('div[id^="nik_"]');
				userId =  userEl.children[0].children[0].getAttribute('onclick').match(/id=([^&]+)\'/)[1];
				nickname = userEl.nextElementSibling.innerText;

				//content blind
				if (o.isBlindContent) {
					blibdContent(subject, article, myArea);
				}

				//add userId
				showUserId(userEl, userId);

				//user history
				if (o.isShowUserHistory) {
					showUserHistory(nickname, userId, article);
				}

				//videoCss
				if (o.isResizeVideo) {
					resizeVideo();
				}

				commentLoop(nickname, mbsC, wday, mbsIdx);

				// View voter
				viewVoter(mbsC, mbsIdx, container);
			}

			//text URL replacement
			$(myArea).find('.G12').html(function(i, val) {
				return val.replace(val, val.urlReplace());
			});

			//reply button
			var textarea = doc.getElementsByName('line_content')[0];
			replyButton(textarea, myArea);

			//comment refresh
			var cmtLoader = doc.createElement('div');
			var cmtLoadBtn = doc.createElement('button');
			cmtLoader.id = 'cmtLoader';
			cmtLoadBtn.id = 'btn_cmtLoad';
			cmtLoadBtn.type = 'button';
			cmtLoadBtn.innerText = '최신 댓글 불러오기';
			cmtLoader.appendChild(cmtLoadBtn);

			cmtLoadBtn.onclick = function(){
				$.ajax({
					type: 'post',
					async: true,
					url: 'http://mlbpark.donga.com/mbs/commentRV.php',
					data: {
						mbsC: mbsC,
						comment_ymd: wday,
						comment_idx: mbsIdx
					},
					beforeSend: function() {
						cmtLoader.className = 'loaderShow';
					},
					success: function(data) {
						$(myArea).html(data);
						if (path !== '/mbs/articleL.php') {
							userBlock_cmt();
						}
						if (path == '/mbs/articleV.php') {
							commentLoop(nickname, mbsC, wday, mbsIdx);
						}
					},
					complete: function() {
						$(myArea).find('.G12').html(function(i, val) {
							return val.replace(val, val.urlReplace());
						});
						replyButton(textarea, myArea);
						addUserBlock(myArea);
						cmtLoader.className = 'loaderHide';
					}
				});
			};

			myArea.parentNode.insertBefore(cmtLoader, myArea.nextSibling);
		}

		if (path !== '/mbs/commentV.php' && path !== '/bbs/mlb_today.php') {
			//shotcut keys
			var paging = container.getElementsByClassName('paging');
			var $currentPage = $(paging).find('font');

			$(paging).find('> img').remove();

			var pLink = $currentPage[0].previousSibling.href;
			var nLink = $currentPage[0].nextSibling.href;

			if (o.isEnableShortcutKey) {
				var listEl = doc.querySelector('table[height="31"]');

				doc.addEventListener('keyup', function(e) {
					if (path === '/mbs/commentV.php') return;
					if ($(e.target).is('input, textarea')) return;

					switch(e.which) {
						case 65:
							win.location.href = pLink;
						break;
						case 83:
							win.location.href = nLink;
						break;
						case 68:
							var listElTop = listEl.getBoundingClientRect().top + win.pageYOffset;
							var currentTop = doc.body.scrollTop;
							var topVal = listElTop - currentTop;

							doc.body.style.cssText = '-webkit-transform:translate(0, '+ topVal +'px)';
							win.scroll(0,listElTop);
							doc.body.style.cssText = '-webkit-transform:translate(0,0);transition:-webkit-transform .5s ease;';

							$(doc.body).on('webkitTransitionEnd transitionend', function(){
								doc.body.style.transition = 'none';
							});
						break;
					}
				}, false);
			}

			//prerender
			prerender([nLink, pLink]);
		}

		// Add a 'User Block' to User Menu
		if (o.isBlockNickname) {
			addUserBlock(doc);
		}
	}, false);
});

win.addEventListener('message', function(e) {
	if (win != e.source) return;

	switch(e.data.action) {
		case 'userBlockDelivery' :
			chrome.extension.sendMessage({
					action: e.data.action,
					data: e.data
				},
				function(response) {
					if(response.result) {
						alert('"' + response.content + '" 님을 닉네임 차단에 등록했습니다.');
						location.reload();
					} else {
						alert('닉네임 차단을 실패했습니다.\n' + response.content);
					}
				}
			);
		break;
	}
}, false);