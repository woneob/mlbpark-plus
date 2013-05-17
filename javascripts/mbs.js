var doc = document;
var loc = window.location;
var locHref = loc.href;
var path = loc.pathname;
var titIcon = {
	game: /디아|\[스타|프야매|lol|게임/i,
	female: /여자|처자|ㅊㅈ|여친|녀 |여성/,
	twitter: /(트윗|트위터)/,
	warn: /(혐짤|\[혐오|혐오\]|\(혐오|혐오\)|주의\]|주의\))/,
	adult: /(19금|\[19\] |\(19\)|주번나|성진국)/,
	tv: /(swf|avi|플짤|영상|flv)/i,
	vs: /(vs)/i,
	music: /(브금|bgm|음악|가수|노래|뮤직)/i,
	question: /(질문|요\?|여\?|죠\?|나요)/,
	img: /(짤방|jpg|gif|jyp)/i,
	mobile: /(맛폰)/
}, team = {
	kia: {
		regex: /(\[기아\]\s?|\[kia\]\s?)/i,
		searchKeyword: 'kia+OR+%B1%E2%BE%C6'
	},
	nexen: {
		regex: /(\[넥센\]\s?)/,
		searchKeyword: '%B3%D8%BC%BE'
	},
	doosan: {
		regex: /(\[두산\]\s?)/,
		searchKeyword: '%B5%CE%BB%EA'
	},
	lotte: {
		regex: /(\[롯데\]\s?)/,
		searchKeyword: '%B7%D4%B5%A5'
	},
	samsung: {
		regex: /(\[삼성\]\s?)/,
		searchKeyword: '%BB%EF%BC%BA'
	},
	sk: {
		regex: /(\[sk\]\s?)/i,
		searchKeyword: 'sk+OR+%BF%A1%BD%BA%C4%C9%C0%CC'
	},
	nc: {
		regex: /(\[엔씨\]\s?|\[nc\]\s?)/i,
		searchKeyword: 'nc+OR+%BF%A3%BE%BE'
	},
	lg: {
		regex: /(\[엘지\]\s?|\[lg\]\s?)/i,
		searchKeyword: 'lg+OR+%BF%A4%C1%F6'
	},
	hanwha: {
		regex: /(\[한화\]\s?)/,
		searchKeyword: '%C7%D1%C8%AD'
	}
};

// Repeat parentNode
function up(el, n) {
	while(n-- && (el = el.parentNode));
	return el;
}

chrome.extension.sendMessage({action:'mbs'}, function(response) {
	var titIconVar = response.titIcon,
	teamVar = response.team,
	blockVar = response.block,
	blockInputVar = response.blockInput,
	blockTypeVar = response.blockType,
	blockUserVar = response.blockUser,
	blockUserInputVar = response.blockUserInput,
	blindVar = response.blind,
	userHistoryVar = response.userHistory,
	replyVar = response.reply,
	userCommentViewVar = response.userCommentView,
	videoVar = response.video,
	noticeVar = response.notice,
	shortcutVar = response.shortcut,
	imageSearchVar = response.imageSearch;

	$(doc).ready(function() {
		if (path !== '/mbs/commentV.php') {
			var container = doc.getElementById('container');
			var listLink =  container.getElementsByClassName('G12read');

			// KBL bbs only
			if ((teamVar == '1' || teamVar === undefined) && locHref.indexOf('mbsC=kbotown') > -1) {
				doc.body.className = 'team_show';
				var teamSearchUrl = '/mbs/articleL.php?mbsC=kbotown&mbsW=search&keyword=';
			}

			listLinkLoop:
			for (var i = 0, listLinklen = listLink.length; i < listLinklen; i++) {
				if (path == '/bbs/mlb_today.php') {
					var t = listLink[i].childNodes[0];
				} else {
					var t = listLink[i].childNodes[1];
				}
				var title = t.innerText;

				//title block
				if (blockVar == '1' && blockTypeVar == '2' && blockInputVar[0] !== '') {
					for(var b = 0, blockInputVarLen = blockInputVar.length; b < blockInputVarLen; b++) {
						if (title.toLowerCase().indexOf(blockInputVar[b]) !== -1) {
							up(t,6).className = 'displayNone';
							continue listLinkLoop;
						}
					}
				}

				if (blockVar == '1' && blockTypeVar == '1' && blockInputVar[0] !== '') {
					for(var b = 0, blockInputVarLen = blockInputVar.length; b < blockInputVarLen; b++) {
						if (title.toLowerCase().indexOf(blockInputVar[b]) !== -1) {
							t.innerText = '차단 키워드('+ blockInputVar[b] +')가 포함된 글 입니다';
							t.className = 'blockTitle';
							t.setAttribute('title','제목 : '+ title);
							t.onclick = function(){
								return confirm('차단된 글을 열람하시겠습니까?');
							}
							continue listLinkLoop;
						}
					}
				}

				// title icon
				if (titIconVar == '1' || titIconVar === undefined) {
					for (key in titIcon) {
						if(titIcon[key].test(title)) {
							t.className = 'ico ico_' + key;
							break;
						}
					}
				}

				// team icon
				if ((teamVar == '1' || teamVar === undefined) && locHref.indexOf('mbsC=kbotown') > -1) {
					for(name in team) {
						var matched = team[name].regex.exec(title);
						if(matched) {
							var label = doc.createElement('em');
							label.setAttribute('data-team', name);
							label.title = name;
							label.idx = name;
							label.onclick = function(j){
								return function (){
									location.href= teamSearchUrl + team[j].searchKeyword;
								}
							}(name);
							t.innerText = title.replace(matched[1],'');
							t.parentNode.insertBefore(label, t);
							break;
						}
					}
				}
			}

			//notice blind
			if (noticeVar == '1') {
				var cat = container.getElementsByClassName('A11gray');
				for (var c = 0, catLen = cat.length; c < catLen; c++) {
					var t = cat[c];
					if (t.textContent === '공지') {
						up(t,5).className = 'displayNone';
					} else {
						break;
					}
				}
			}

			if(path == '/bbs/mlb_today.php'){
				var nickEl = container.querySelectorAll('td[width="82"] font');
				var upCount = '6';
			} else {
				var nickEl = container.querySelectorAll('td[width="82"] a');
				var upCount = '7';
			}

			//user block
			if (blockUserVar == '1') {
				for (var u = 0, nickElLen = nickEl.length; u < nickElLen; u++) {
					for (var i = 0, blockUserInputVarLen = blockUserInputVar.length; i < blockUserInputVarLen; i++) {
						if (nickEl[u].innerText === blockUserInputVar[i]) {
							up(nickEl[u],upCount).className = 'displayNone';
							break;
						}
					}
				}
			}

			if (blockVar == '1' && blockInputVar[0] !== '') {
				var bestLink = doc.querySelectorAll('td[width="190"] a');
				var bestLinkLen = bestLink.length;
				var blockInputVarLen = blockInputVar.length;

				if (bestLinkLen > 0 && blockTypeVar == '2') {
					for(var i = 0; i < bestLinkLen; i++){
						var t = bestLink[i];
						for(var b = 0; b < blockInputVarLen; b++) {
							if (t.innerText.toLowerCase().indexOf(blockInputVar[b]) !== -1) {
								if (t.parentNode.tagName.toLowerCase() == 'strong'){
									var upCount = 3;
								} else {
									var upCount = 2;
								}
								up(t,upCount).className = 'displayNone';
								break;
							}
						}
					}
				}

				if (bestLinkLen > 0 && blockTypeVar == '1') {
					for(var i = 0; i < bestLinkLen; i++){
						var t = bestLink[i];
						for(var b = 0; b < blockInputVarLen; b++) {
							if (t.innerText.toLowerCase().indexOf(blockInputVar[b]) !== -1) {
								var title = t.innerText;
								t.innerText = '차단 키워드('+ blockInputVar[b] +')가 포함된 글 입니다';
								t.className = 'blockTitle';
								t.setAttribute('title','제목 : '+ title);
								t.onclick = function(){
									return confirm('차단된 글을 열람하시겠습니까?');
								}
								break;
							}
						}
					}
				}
			}
		}

		if (locHref.indexOf('V.php') > -1){
			var myArea = doc.getElementById('myArea');

			function userBlock_cmt(){
				if (blockUserVar == '1') {
					var CmtNickEl = doc.querySelectorAll('td[width="140"] a');
					for (var u = 0, CmtNickElLen = CmtNickEl.length; u < CmtNickElLen; u++) {
						for (var i = 0, blockUserInputVarLen = blockUserInputVar.length; i < blockUserInputVarLen; i++) {
							if (CmtNickEl[u].innerText === blockUserInputVar[i]) {
								up(CmtNickEl[u],7).className = 'displayNone';
								break;
							}
						}
					}
				}
			}userBlock_cmt();

			if (path == '/mbs/articleV.php') {
				var article = doc.querySelector('.G13 > div[align="justify"]');
				var userEl = doc.querySelector('div[id^="nik_"]');
				var userId =  userEl.firstChild.firstChild.getAttribute('onclick').match(/id=([^&]+)\'/)[1];
				var nickname = userEl.nextSibling.innerText;

				//content blind
				if (blindVar == '1' || blindVar === undefined) {
					var subject = container.getElementsByTagName('strong')[0].innerText;
					var btn_cob = '<div id="btn_show" class="warnBtn"><span>댓글에 COB가 포함된 글 입니다.</span> 본문을 보시려면 클릭하세요.</div>';
					var btn_soap = '<div id="btn_show" class="warnBtn"><span>댓글에 비누가 포함된 글 입니다.</span> 본문을 보시려면 클릭하세요.</div>';
					var btn_warn = '<div id="btn_color" class="warnBtn"><span>경고 문구가 포함되어 본문을 흑백처리 합니다.</span> 원문을 보시려면 클릭하세요.</div>';

					$.expr[':'].Contains = function(a,i,m){
						return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
					};

					if ($(myArea).find('.G12:Contains("COB")').length > 0) {
						article.className = 'blind';
						article.insertAdjacentHTML('beforeBegin', btn_cob);
					} else if ($(myArea).find('.G12:contains("비누")').length > 0) {
						article.className = 'blind';
						article.insertAdjacentHTML('beforeBegin', btn_soap);
					} else if(titIcon.warn.test(subject)) {
						article.className = 'grayscale';
						article.insertAdjacentHTML('beforeBegin', btn_warn);
					}

					$(container.getElementsByClassName('warnBtn')).on('click',function(){
						this.className = 'displayNone';
						if (this.id == 'btn_color') {
							article.classList.remove('grayscale');
						} else {
							var articleHeight = article.offsetHeight;
							article.style.maxHeight = articleHeight + 'px';
							article.className += ' slide';
						}
					});
				}

				//add userId
				var idEl = doc.createElement('span');
				idEl.className = 'userIdVal';
				idEl.innerText = '(' + userId + ')';
				userEl.parentNode.appendChild(idEl);

				//user history
				if (userHistoryVar == '1') {
					article.insertAdjacentHTML('afterEnd',
					'<div id="history">\n'+
					'	<div class="historyHead">\n'+
					'		<h3><span>'+nickname+'<span>('+userId+')</span></span> 님의 최근 글</h3>\n'+
					'		<button type="button" onclick="MlbNewWindow2(\'http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid=' + userId +'\',\'550\',\'500\')">[더 보기]</button>\n' + 
					'	</div>\n'+ 
					'	<div id="historyLoading">\n'+
					'		<span></span>\n'+
					'	</div>\n'+
					'	<div id="historyList"></div>\n'+
					'</div>'
					);

					$.ajax({
						type: 'GET',
						url: 'http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid=' + userId,
						cache: false,
						success: function(response) {
							$('#historyList').append($(response).find('td[bgcolor="#FFFFFF"] > table:nth-child(2)').html()).find('a[target]').removeAttr('target');
						},
						complete: function(){
							$('#historyLoading').remove();
						}
					});
				}

				//google search by image
				if (imageSearchVar == '1' || imageSearchVar === undefined) {
					var images = article.getElementsByTagName('img');

					window.onload = function(){
						for (var i = 0, imagesLen = images.length; i < imagesLen; i++) {
							var t = images[i];
							var width = t.clientWidth;
							var height = t.clientHeight;

							if (width && height > 50) {
								var imageWrap = doc.createElement('span');
								imageWrap.className = 'iWrap';

								var src = t.src;
								if(src.substr(0,7) != 'http://') {
									var src = 'http://mlbpark.donga.com' + src;
								}

								var btn_iSearch = '<a href="https://www.google.com/searchbyimage?image_url='+ src +'" class="btn_iSearch" target="_blank" title="구글에서 이미지 검색"></a>';

								if (t.parentNode.tagName.toLowerCase() == 'a') {
									$(t.parentNode).wrap(imageWrap).after(btn_iSearch);
								} else {
									$(t).wrap(imageWrap).after(btn_iSearch);
								}
							}
						}
					};
				}

				//videoCss
				if (videoVar == '1' || videoVar === undefined) {
					var vdoCss = doc.createElement('link');
					vdoCss.rel = 'stylesheet';
					vdoCss.href = chrome.extension.getURL('/css/video.css');
					doc.head.appendChild(vdoCss);
				}

				function commentUser(){
					var cmtName = myArea.querySelectorAll('td[width="140"] a');

					for (var i = 0, cmtNameLen = cmtName.length; i < cmtNameLen; i++) {
						var t = cmtName[i];

						//highlight comment writer
						if (t.innerText === nickname) {
							t.className = 'me';
						}

						//view userComment
						if (userCommentViewVar == '1' || userCommentViewVar == null) {
							var viewCmt = doc.createElement('button');
							viewCmt.type = 'button';
							viewCmt.className = 'btn_userCmt',
							viewCmt.title = '이 글에 단 댓글 보기';
							viewCmt.innerText = '?';
							t.parentNode.appendChild(viewCmt);
						}
					}

					if (userCommentViewVar == '1' || userCommentViewVar == null) {
						var btn_userCmt = myArea.querySelectorAll('.btn_userCmt');
						$(btn_userCmt).on('click',function(){
							var t = this;
							$.ajax({
								type: 'GET',
								url: 'http://mlbpark.donga.com/mbs/commentRV.php?mbsC='+mbsC+'&comment_ymd='+wday+'&comment_idx='+mbsIdx,
								cache: false,
								success: function(response) {
									var selectUser = t.previousSibling.innerText;
									doc.body.insertAdjacentHTML('beforeEnd',
										'<div id="commentModal">\n'+
										'	<div id="commentModalMask"></div>\n'+
										'	<div id="commentModalBox">\n'+
										'		<div id="modalHead">\n'+
										'			<h3><strong>'+selectUser+'</strong> 님이 이 글에 남긴 댓글 <span id="cmtCount"></span></h3>\n'+
										'			<button type="button" id="commentModalClose" title="닫기">close</button>\n'+
										'		</div>\n'+
										'		<div id="userCmtList"></div>\n'+
										'		<form id="modalForm" name="writeForm2" method="post" action="commentWE.php">\n'+
										'			<input type="hidden" name="mbsC" value="'+mbsC+'" />\n'+
										'			<input type="hidden" name="mbsIdx" value="'+mbsIdx+'" />\n'+
										'			<input type="hidden" name="wday" value="'+wday+'" />\n'+
										'			<textarea id="modalFormTextarea" name="line_content" cols="75" rows="3" autocomplete="off">'+selectUser+'// </textarea>\n'+
										'			<button type="submit">댓글 등록</button>\n'+
										'		</form>\n'+
										'	</div>\n'+
										'</div>\n'
									);

									var responseWrapper = $('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, '')),
									cmt = responseWrapper.find('a[title=" 에게 메모 보내기"]:contains("' + selectUser + '")'),
									cmtVal = cmt.closest('td').nextAll();
									var cmtCount = cmt.length;
									var el_modal = doc.getElementById('commentModalBox');
									var el_cmtCount = doc.getElementById('cmtCount');
									var el_userCmtList = doc.getElementById('userCmtList');

									el_cmtCount.innerText = '(' + cmtCount + ')';
									$(el_userCmtList).append(cmtVal);

									var vPosition = el_modal.offsetHeight*-.5;
									el_modal.style.marginTop = vPosition + 'px';

									$('#modalFormTextarea').on('click',function(){
										if ($('#loginArea a:first-child').text() == '로그인'){
											if (confirm('로그인 후 사용 가능합니다.\n로그인 페이지로 이동하시겠습니까?') == true){
												window.location = 'http://www.donga.com/members/login.php\?gourl=' + escape(locHref);
											}
										}
									});
								},
								beforeSend : function(){
									t.classList.add('userCmtLoading');
								},
								complete: function(){
									t.classList.remove('userCmtLoading');
								}
							});
						});

						$(doc.body).on('click','#commentModalMask,#commentModalClose',function(){
							$('#commentModal').remove();
						});
					}
				}
				commentUser();
			}

			//text URL replacement
			function urlReplace(){
				var replacePattern1 = /\s(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
				replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/ig,
				replaceTxt1 = ' <a href="$1" target="_blank">$1</a>',
				replaceTxt2 = ' <a href="http://$2" target="_blank">$2</a>';

				$(myArea).find('.G12').html(function(i, val) {
					return val.replace(replacePattern1, replaceTxt1).replace(replacePattern2, replaceTxt2);
				});
			}
			urlReplace();

			//reply button
			var textarea = doc.getElementsByName('line_content')[0];

			function replyButton(){
				var cmtTxt = myArea.querySelectorAll('.G12');
				var cmtTxtLen = cmtTxt.length;
				if ((replyVar == '1' || replyVar == null) && cmtTxtLen > 0) {
					for (var i = 0; i < cmtTxtLen; i++) {
						var replyBtn = doc.createElement('button');
						replyBtn.type = 'button';
						replyBtn.className = 'btn_reply';
						replyBtn.title = '답글 달기';
						replyBtn.innerText = '[답글]';
						replyBtn.idx = i;
						replyBtn.onclick = function(j){
							return function(){
								if (textarea.value !== '' && !confirm('아직 작성 중인 댓글이 있습니다.\n다시 작성하시겠습니까?')){
									return false;
								}
								var cmtUsername = up(cmtTxt[j],5).children[0].getElementsByTagName('a')[0].innerText;
								textarea.focus();
								textarea.value = cmtUsername + '// ';
							}
						}(i);
						cmtTxt[i].appendChild(replyBtn);
					}
				}
			}
			replyButton();

			//comment refresh
			var mbsC = doc.getElementsByName('mbsC')[0].value;
			var mbsIdx =  doc.getElementsByName('mbsIdx')[0].value;

			if (path == '/mbs/commentV.php'){
				var wday = doc.getElementsByName('co_day')[0].value;
			} else {
				var wday = doc.getElementsByName('wday')[0].value;
			}

			var cmtRefreshBtn = doc.createElement('div');
			var cmtLoadBtn = doc.createElement('button');
			var cmtLoader = doc.createElement('span');
			cmtRefreshBtn.id = 'commentRefresh';
			cmtLoadBtn.id = 'btn_cmtLoad';
			cmtLoadBtn.type = 'button';
			cmtLoadBtn.innerText = '최신 댓글 불러오기';
			cmtLoader.id = 'cmtLoader';
			cmtRefreshBtn.appendChild(cmtLoadBtn);
			cmtRefreshBtn.appendChild(cmtLoader);

			cmtLoadBtn.onclick = function(){
				$.ajax({
					type: 'post',
					async: true,
					url: 'http://mlbpark.donga.com/mbs/commentRV.php?mbsC='+mbsC+'&comment_ymd='+wday+'&comment_idx='+mbsIdx,
					beforeSend: function() {
						 cmtLoader.className = 'show';
					},
					success: function(data) {
						$(myArea).html(data);
						if (path !== '/mbs/articleL.php') {
							userBlock_cmt();
						}
						if (path == '/mbs/articleV.php') {
							commentUser();
						}
					},
					complete: function() {
						urlReplace();
						replyButton();
						addUserBlock(myArea);
						cmtLoader.className = 'hide';
					}
				});
			}

			myArea.parentNode.insertBefore(cmtRefreshBtn, myArea.nextSibling);
		}

		//tab Navigation highlighter
		if (locHref.indexOf('mbsW=search') > -1){
			$.urlParam = function(name){
				var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(locHref);
				return results[1] || 0;
			}
			switch ($.urlParam('mbsC')) {
				case 'bullpen':
					doc.getElementById('navi4').className = 'on';
				break;
				case 'kbotown':
					doc.getElementById('navi3').className = 'on';
				break;
				case 'mlbtown':
					doc.getElementById('navi2').className = 'on';
				break;
			}
		}

		if (path !== '/mbs/commentV.php' && path !== '/bbs/mlb_today.php') {
			//shotcut keys
			var paging = container.getElementsByClassName('paging');
			var $currentPage = $(paging).find('font');

			$(paging).find('> img').remove();

			var pLink = $currentPage[0].previousSibling.href;
			var nLink = $currentPage[0].nextSibling.href;

			if (shortcutVar == '1' || shortcutVar == null) {
				var lisEl = doc.querySelector('table[height="31"]');


				$(doc).keyup(function(e){
					if (path !== '/mbs/commentV.php'){
						if ($(e.target).is('input, textarea')) {
							return;
						}
						if (e.which === 65) {
							window.location.href = pLink;
						}
						if (e.which === 83) {
							window.location.href = nLink;
						}
						if (e.which === 68) {
							var lisElTop = lisEl.getBoundingClientRect().top + window.pageYOffset;
							var currentTop = doc.body.scrollTop;
							var topVal = lisElTop - currentTop;

							doc.body.style.cssText = '-webkit-transform:translate(0, '+ topVal +'px)';
							window.scroll(0,lisElTop);
							doc.body.style.cssText = '-webkit-transform:translate(0,0);transition:-webkit-transform .5s ease;';

							$(doc.body).on('webkitTransitionEnd transitionend', function(){
								doc.body.style.transition = 'none';
							});
						}
					}
				});
			}

			//prerender
			var target = doc.head;
			prNext = doc.createElement('link');
			prNext.rel = 'prerender';
			prNext.href = nLink;
			prPrev = doc.createElement('link');
			prPrev.rel = 'prerender';
			prPrev.href = pLink;
			target.appendChild(prNext);
			target.appendChild(prPrev);
		}

		// Add a 'User Block' to User Menu
		if (blockUserVar == '1') {
			function addUserBlock(scop){
				var userMenu = scop.querySelectorAll('div[id^=nik_]');
				for (var i = 0, userMenuLen = userMenu.length; i < userMenuLen; i++) {
					var t = userMenu[i];
					var blockLiEl = doc.createElement('li');
					blockLiEl.setAttribute('data-user', t.nextSibling.innerText);
					blockLiEl.innerText = '닉네임 차단';

					t.getElementsByTagName('ul')[0].appendChild(blockLiEl);
				}
				$('li[data-user]').on('click',function(){
					window.postMessage({
						action:'userBlockDelivery',
						user: this.getAttribute('data-user')
					}, '*');
					return false;
				});
			}
			addUserBlock(doc);
		}
	});
});

window.addEventListener('message', function(event) {
	// We only accept messages from ourselves
	if (window != event.source) return;

	switch(event.data.action) {
		case 'userBlockDelivery' :
			chrome.extension.sendMessage({action:event.data.action, data:event.data}, function(response) {
				if(response.result) {
					alert('"' + response.user + '" 님을 닉네임 차단에 등록했습니다.');
					location.reload();
				} else {
					alert('닉네임 차단을 실패했습니다.\n' + response.message);
				}
			});
		break;
	}
}, false);