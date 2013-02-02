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

	$(document).ready(function() {
		listLnk =  document.querySelectorAll('.G12read > a');
		var loc = window.location;
		var locHref = loc.href;
		
		// title icon & team icon
		// 순서대로 먼저 매칭되는 것을 사용
		var titIcon = {
			game: {
				regex: /디아|\[스타|프야매|lol|게임/i
			},
			twitter: {
				regex: /(트윗|트위터)/
			},
			warn: {
				regex: /(혐짤|\[혐오|혐오\]|\(혐오|혐오\)|주의\]|혐오주의)/
			},
			adult: {
				regex: /(19금|\[19\] |\(19\)|주번나|성진국)/
			},
			tv: {
				regex: /(swf|avi|플짤|영상|flv)/i
			},
			vs: {
				regex: /(vs)/i
			},
			music: {
				regex: /(브금|bgm|음악|가수|노래|뮤직)|싸이|강남스타일/i
			},
			question: {
				regex: /(질문|요\?|여\?|죠\?)/
			},
			img: {
				regex: /(짤방|jpg|gif|jyp)/i
			},
			mobile: {
				regex: /(맛폰)/
			}
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
		$(listLnk).each(function() {
			// title icon
			var item, t = this.textContent;
			if ((titIconVar == '1' ) || (titIconVar === undefined)) {
				for (item in titIcon) {
					if(titIcon[item].regex.test(t)) {
						this.className = 'ico ico_' + item;
						break;
					}
				}
			}
			// team icon
			if ((teamVar == '1' ) || (teamVar === undefined)) {
				if (locHref.indexOf('mbsC=kbotown') > -1) {
					document.body.className = 'team_show';
					for(item in team) {
						var matched = team[item].regex.exec(t);
						if(matched) {
							this.textContent = t.replace(matched[1],'');
							$(this).before('<em data-team="'+item+'" onclick="location.href=\'/mbs/articleL.php?mbsC=kbotown&mbsW=search&keyword=' + team[item].searchKeyword + '\'"></em>');
							break;
						}
					}
				}
			}
		});

		$.expr[':'].Contains = function(a,i,m){
			return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
		};

		//title block
		if (blockVar == '1' ) {
			var blockValue = response.blockInput.split(/[ \t\n]*,[ \t\n]*/);

			for (var j = 0; j < blockValue.length; j++) {
				var blockMsg = '차단 키워드('+ blockValue[j] +')가 포함된 글 입니다';
				var $elem = $(listLnk).filter(':Contains("'+ blockValue[j] +'")');

				if (blockTypeVar == '1' ) {
					$elem.each(function(){
						var orginTxt = this.textContent;
						this.textContent = blockMsg;
						this.className = 'blockTitle';
						this.setAttribute('title','제목 : '+ orginTxt);
						$(this).on('click',function(){
							return confirm("차단된 글을 열람하시겠습니까?");
						});
					});
				} else {
					$elem.each(function(){
						$(this).closest('tr[height="30"]').addClass('displayNone').next().addClass('displayNone');
					});
				}
			}
		}

		//component
		var myArea = document.getElementById('myArea');
		var $user = $('td[width="18%"].D11 div[id^="nik_"]');
		var nickname = $user.next().text();

		//user block
		function userBlock(){
			if (blockUserVar == '1' ) {
				var blockUserValue = blockUserInputVar.split(/\n*,\n*/);

				if(loc.pathname == "/bbs/mlb_today.php"){
					$('td[width="82"] font').wrap('<a href="#" onclick="return false;" class="disabled" />');
				}

				for (var u = 0; u < blockUserValue.length; u++) {
					var $userNick = $('td[width="82"]').find('a:contains("'+ blockUserValue[u] +'")');
					var $userCmtNick = $(myArea).find('a:contains("' + blockUserValue[u] + '")');

					$userNick.each(function(){
						$(this).closest('tr[height="30"]').addClass('displayNone').next().addClass('displayNone');
					});
					$userCmtNick.each(function(){
						$(this).closest('table').closest('tr').addClass('displayNone').next().addClass('displayNone');
					});
				}
			}
		}userBlock();

		//notice blind
		if (noticeVar == '1') {
			var $noticeEl = $('.A11gray:contains("공지")');
			$noticeEl.each(function(){
				var parent = this.parentNode.parentNode.parentNode.parentNode.parentNode;
				parent.className = 'displayNone';
				parent.nextSibling.nextSibling.className = 'displayNone';
			});
		}

		if (locHref.indexOf('V.php') > -1){
			var $article = $('.G13 > div[align="justify"]');

			if (locHref.indexOf('articleV.php') > -1){
				var userId =  $user.find('li:first-child').attr('onclick').match(/id=([^&]+)\'/)[1];

				//content blind
				if ((blindVar == '1') || (blindVar === undefined)) {
					var cobTxt = '<div id=\"warnBtn\"><span>댓글에 COB가 포함된 글 입니다.</span> 본문을 보시려면 클릭하세요.</div>';
					var soapTxt = '<div id=\"warnBtn\"><span>댓글에 비누가 포함된 글 입니다.</span> 본문을 보시려면 클릭하세요.</div>';

					if ($(myArea).find('.G12:Contains("COB")').length > 0)  {
						$article.css('display','none').before(cobTxt);
					} else if ($(myArea).find('.G12:contains("비누")').length > 0) {
						$article.css('display','none').before(soapTxt);
					}

					$('#warnBtn').on('click',function() {
						$(this).remove();
						$article.slideDown(300);
					});
				}

				//add userId
				$user.next().after('<span class="userIdVal">(' + userId + ')</span>');

				//user history
				if (userHistoryVar == '1') {
					$article.after(
					'<div id="history">\n'+
					'	<div class="historyHead">\n'+
					'		<h3><span>'+nickname+'<span>('+userId+')</span></span> 님의 최근 글</h3>\n'+
					'		<button type="button" onclick="MlbNewWindow2(\'http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid=' + userId +'\',\'550\',\'500\')">[더 보기]</button>\n' + 
					'	</div>\n'+ 
					'	<div id="historyLoading">\n'+
					'		<div><span class="stick1"></span><span class="stick2"></span><span class="stick3"></span></div>\n'+
					'	</div>\n'+
					'	<div id="historyList"></div>\n'+
					'</div>'
					);

					$.ajax({
						type: "GET",
						url: 'http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid=' + userId,
						cache: false,
						success: function(response) {
							$('#historyList').append($(response).find('td[bgcolor="#FFFFFF"] > table:nth-child(2)').html()).find('a[target]').removeAttr('target');
						},
						complete: function(){
							$("#historyLoading").remove();
						}
					});
				}

				//google search by image
				if ((imageSearchVar == '1') || (imageSearchVar === undefined)) {
					var $contentImg = $article.find('img');
					$contentImg.each(function(){
						var $t = $(this);
						$t.load(function(){
							if ($t[0].clientWidth > 50 && $t[0].clientHeight > 50) {
								var src = this.src;
								if(src.substr(0,7) != 'http://') {
									src = 'http://mlbpark.donga.com' + src;
								}
								var imageWrap = '<span class="iWrap"></span>';
								var btn_iSearch = '<a href="https://www.google.com/searchbyimage?image_url='+ src +'" class="btn_iSearch" target="_blank" title="구글에서 이미지 검색"></a>';

								if ($t.parent('a').length) {
									$t.parent().wrap(imageWrap).after(btn_iSearch);
								} else {
									$t.wrap(imageWrap).after(btn_iSearch);
								}
							}
						});
					});
				}

				//videoCss
				if ((videoVar == '1') || (videoVar === undefined)) {
					var vdoCss = document.createElement('link');
					vdoCss.rel = 'stylesheet';
					vdoCss.type = 'text/css';
					vdoCss.href = chrome.extension.getURL('/css/video.css');
					document.head.appendChild(vdoCss);
				}

				//highlight comment writer
				function highlightWriter(){
					$(myArea).find('td[width="140"] a:contains("' + nickname +'")').each(function(){
						this.className += 'me';
					});
				}highlightWriter();

				//view userComment
				function viewUserComment(){
					if ((userCommentViewVar == '1') || (userCommentViewVar == null)) {
						var viewCmt = '<button type="button" class="btn_userCmt" title="이 글에 단 댓글 보기">?</button>';

						if(loc.pathname !== "/mbs/commentV.php"){
							$(myArea).find('a[title=" 에게 메모 보내기"]').each(function(){
								$(this).after(viewCmt);
							});
						}

						var $btn_userCmt = $('.btn_userCmt');
						$('.btn_userCmt').on('click',function(){
							var select = this;
							$('#commentModal').remove();

							$.ajax({
								type: "GET",
								url: 'http://mlbpark.donga.com/mbs/commentRV.php?mbsC='+mbsC+'&comment_ymd='+wday+'&comment_idx='+mbsIdx,
								cache: false,
								success: function(response) {
									var selectUser = select.previousSibling.textContent;
									$(document.body).append(
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
									cmtVal = cmt.closest('td').nextAll(),
									cmtCout = cmt.length,
									$modal = $('#commentModalBox');

									$('#cmtCount').text('(' + cmtCout + ')');
									$('#userCmtList').append(cmtVal);

									var vPosition = $modal.outerHeight();
									$modal.css('top',$(window).height()/2.3 - vPosition/2);
									$(window).resize(function (){
										var height = $(window).height();
										$modal.css('top',height/2.3 - vPosition/2);
									});

									$('#modalFormTextarea').on('click',function(){
										if ($('#loginArea a:first-child').text() == '로그인'){
											var loginConfirm = confirm("로그인 후 사용 가능합니다.\n로그인 페이지로 이동하시겠습니까?");
											if (loginConfirm == true){
												window.location = 'http://www.donga.com/members/login.php\?gourl=' + escape(locHref);
											}
										}
									});
								},
								beforeSend : function(){
									select.classList.add('userCmtLoading');
									$btn_userCmt.prop('disabled', true);
								},
								complete: function(){
									select.classList.remove('userCmtLoading');
									$btn_userCmt.prop('disabled', false);
								}
							});
						});

						$(document.body).on('click','#commentModalMask,#commentModalClose',function(){
							$('#commentModal').remove();
						});
					}
				}viewUserComment();
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
			}urlReplace();

			//reply button
			var textarea = document.getElementsByName('line_content');

			function replyButton(){
				if ((replyVar == '1') || (replyVar == null)) {
					var btn = '<button type=\"button\" class=\"btn_reply\" title=\"답글 달기\">[답글]</button>';
					$(myArea).find('.G12').append(btn);
					$('.btn_reply').on('click',function(){
						var username = $(this).closest('table').parent().prev().find('a').text();
						if (!$.trim($(textarea).val())){
							$(textarea).focus().val(username + '// ');
						} else {
							var question = confirm('아직 작성 중인 댓글이 있습니다.\n다시 작성하시겠습니까?');
							if (question){
								$(textarea).focus().val(username + '// ');
							} return false; 
						} return false;
					});
				}
			}replyButton();

			//comment refresh
			$(myArea).after('<div id="commentRefresh"><button type="button" id="btn_cmtLoad">최신 댓글 불러오기</button><span id="cmtLoader"></span>');

			var mbsC = document.getElementsByName('mbsC')[0].value;
			var mbsIdx =  document.getElementsByName('mbsIdx')[0].value;

			if (loc.pathname == '/mbs/commentV.php'){
				var wday = document.getElementsByName('co_day')[0].value;
			} else {
				var wday = document.getElementsByName('wday')[0].value;
			}

			$('#btn_cmtLoad').on('click',function(){
				$.ajax({
					type: 'post',
					async: true,
					url: 'http://mlbpark.donga.com/mbs/commentRV.php?mbsC='+mbsC+'&comment_ymd='+wday+'&comment_idx='+mbsIdx,
					beforeSend: function() {
						 $('#cmtLoader').css('opacity','1');
					},
					success: function(data) {
						$(myArea).html(data);
						userBlock();
						highlightWriter();
						viewUserComment();
					},
					complete: function() {
						urlReplace();
						replyButton();
						$('#cmtLoader').stop().animate({'opacity':0},200);
					}
				});
			});
		}

		//tab Navigation highlighter
		if (locHref.indexOf('mbsW=search') > -1){
			$.urlParam = function(name){
				var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(locHref);
				return results[1] || 0;
			}
			switch ($.urlParam('mbsC')) {
				case 'bullpen':
					document.getElementById('navi4').className = 'on';
				break;
				case 'kbotown':
					document.getElementById('navi3').className = 'on';
				break;
				case 'mlbtown':
					document.getElementById('navi2').className = 'on';
				break;
			}
		}

		//replace with href of link
		var elms = document.getElementsByTagName('a');
		for (i=0; i<elms.length; i++) {
			elms[i].href = elms[i].href.replace('articleVC', 'articleV');
		}

		//shotcut keys
		var paging = document.getElementsByClassName('paging');
		var $currentPage = $(paging).find('font');

		$(paging).find('> img').remove();

		var pLink = $currentPage[0].previousSibling.href;
		var nLink = $currentPage[0].nextSibling.href;

		if ((shortcutVar == '1') || (shortcutVar == null)) {
			$(document).keyup(function(e){
				if (loc.pathname !== '/mbs/commentV.php'){
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
						$(document.body).animate({scrollTop: $('table[height="31"]').offset().top}, 300);
					}
				}
			});
		}

		//prerender
		var target = document.head;
		pr1 = document.createElement('link');
		pr1.rel = 'prerender';
		pr1.href = 'http://mlbpark.donga.com/mbs/articleL.php?mbsC=bullpen';
		pr2 = document.createElement('link');
		pr2.rel = 'prerender';
		pr2.href = nLink;
		pr3 = document.createElement('link');
		pr3.rel = 'prerender';
		pr3.href = pLink;
		target.appendChild(pr1);
		target.appendChild(pr2);
		target.appendChild(pr3);
	});

	$(window).load(function(){
		// Add a 'User Block' to User Menu
		if (blockUserVar == '1' ) {
			$('div[id^=nik_]').each(function(){
				var userNick = this.nextSibling.textContent;

				$(this).find('ul').append($('<li>닉네임 차단</li>').on('click',function(){
					window.postMessage({
						action:'userBlockDelivery',
						user: userNick
					}, '*');
					return false;
				}));
			});
		}
	})
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