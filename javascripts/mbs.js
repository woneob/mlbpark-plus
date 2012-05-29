chrome.extension.sendRequest({action:'mbs'}, function(response) {
	var titIconVar = response.titIcon;
	blockVar = response.block;
	blockInputVar = response.blockInput;
	blockTypeVar = response.blockType;
	blockUserVar = response.blockUser;
	blockUserInputVar = response.blockUserInput;
	blindVar = response.blind;
	userHistoryVar = response.userHistory;
	replyVar = response.reply;
	videoVar = response.video;

	$(document).ready(function() {
		var $listLnk = $('.G12read');

		//title icon
		if ((titIconVar == '1' ) || (!titIconVar)) {
			var $links = $listLnk.find('a');
			var txt = {
				mobile: /(맛폰)/i,
				img: /(짤방|JPG|jpg|GIF|gif|JYP|jyp)/i,
				question: /(질문|요\?|여\?|죠\?)/i,
				music: /(브금|BGM|bgm|음악|가수|노래)/i,
				vs: /(VS|vs)/i,
				tv: /(SWF|swf|AVI|avi|플짤|영상|FLV|flv)/i,
				adult: /(19금|\[19\] |\(19\)|주번나|성진국)/i,
				warn: /(혐짤|\[혐오|혐오\]|\(혐오|혐오\)|주의\]|혐오주의)/i,
				twitter: /(트윗|트위터)/i,
				game: /디아|\[스타|프야매|lol|LOL|게임/i
			}

			$links.each(function() {
				var t = $(this).text();
				for (var item in txt) {
					var re = txt[item];
					if (re.test(t)) {
						$(this).addClass('ico').addClass('ico_' + item);
					}
				}
			});
		}

		//title block
		if (blockVar === '1' ) {
			var blockValue = response.blockInput.split(/[\s,]+/);

			if (blockTypeVar == '1' ) {
				$(blockValue).each(function(i,v){
					var blockMsg = '설정에 의해 차단된 글 입니다';
					var $elem = $listLnk.find('a:contains("'+ v +'")');
					$elem.each(function(){
						var orginTxt = $(this).text();

						$(this).text(blockMsg).css('color','#aaaaaa').addClass('blockTitle').attr('title','제목 : ' + orginTxt).bind('click',function(){
							return confirm("차단된 글을 열람하시겠습니까?");
						});
					});
				});
			} else {
				$(blockValue).each(function(i,v){
					var $elem = $listLnk.find('a:contains("'+ v +'")');
					$elem.each(function(){
						$(this).closest('tr[height="30"]').css('display','none').next().css('display','none');
					});
				});
			}
		}

		//component
		var $myArea = $('#myArea');
		var $user = $('td[width="18%"].D11 div[id^="nik_"]');
		var nickname = $user.next().text();
		//var $userIdSrc = $user.find('li:first-child').attr('onclick');
		//var userId = $userIdSrc.match(/id=([^&]+)\'/)[1];
		var $article = $('.G13 > div[align="justify"]');

		//user block
		function userBlock(){
			if (blockUserVar === '1' ) {
				var blockUserValue = blockUserInputVar.split(',');

				var pathname = window.location.pathname;
				if(window.location.pathname == "/bbs/mlb_today.php"){
					$('td[width="82"] font').wrap('<a href="#" onclick="return false;" class="disabled" />');
				}

				$(blockUserValue).each(function(i,v){
					var $userNick = $('td[width="82"]').find('a:contains("'+ v +'")');
					var $userCmtNick = $myArea.find('a:contains("' + v + '")');

					$userNick.each(function(){
						$(this).closest('tr[height="30"]').css('display','none').next().css('display','none');
					});
					$userCmtNick.each(function(){
						$(this).closest('table').closest('tr').css('display','none').next().css('display','none');
					});
				});
			}
		}userBlock();

		//content blind
		if ((blindVar === '1') || (!blindVar)) {
			var cobTxt = '<div id=\"warnBtn\"><span>댓글에 COB가 포함된 글 입니다.</span> 본문을 보시려면 클릭하세요.</div>';
			var soapTxt = '<div id=\"warnBtn\"><span>댓글에 비누가 포함된 글 입니다.</span> 본문을 보시려면 클릭하세요.</div>';

			if (($myArea.find('.G12:contains("COB")').length > 0) || ($myArea.find('.G12:contains("cob")').length > 0))  {
				$article.css('display','none').before(cobTxt);
			} else if ($myArea.find('.G12:contains("비누")').length > 0) {
				$article.css('display','none').before(soapTxt);
			}

			$('#warnBtn').bind('click',function() {
				$(this).remove();
				$article.slideDown(300);
			});
		}

		//user history
		if (userHistoryVar === '1') {
			var $userIdR = $user.find('li').last().attr('onclick');
			if ($userIdR){
				var userId = $userIdR.match(/mbsUid=([^&]+)\'\,\'550/)[1];
				var historyBox ='<div id="history">\n' + '	<div class="historyHead">\n' + '		<h3><span>' + nickname + '</span> 님의 최근 글</h3>\n' + '		<button type="button" onclick="MlbNewWindow2(\'http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid=' + userId +'\',\'550\',\'500\')">[더 보기]</button>\n' + '	</div>\n' + '	<div id="historyLoading">\n' + '		<div><span class="stick1"></span><span class="stick2"></span><span class="stick3"></span></div>\n' + '	</div>\n' + '	<div id="historyList">\n' + '	</div>\n' + '</div>\n';

				$article.after(historyBox);
				$.get('http://mlbpark.donga.com/mypage/my_bulletin2011.php?mbsUid=' + userId, function(response){
					var responseWrapper = $('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, ''));
					var $hList = $('#historyList');
					$hList.append(responseWrapper.find('td[bgcolor="#FFFFFF"] > table:nth-child(2)'));
					$hList.find('a[target]').removeAttr('target');
				});
				$("#historyLoading").ajaxStop(function(){
					$(this).remove();
				});
			}
		}

		//replace with href of link
		var elms = document.getElementsByTagName('a');
		for (i=0; i<elms.length; i++) {
			elms[i].href = elms[i].href.replace('articleVC', 'articleV');
		}

		//videoCss
		if ((videoVar === '1') || (!videoVar)) {
			var vdoCss = document.createElement('link');
			vdoCss.rel = 'stylesheet';
			vdoCss.type = 'text/css';
			vdoCss.href = chrome.extension.getURL('/css/video.css');
			document.head.appendChild(vdoCss);
		}

		// hilight writer
		function highlightWriter(){
			if ($user.length > 0) {
				$myArea.find('td[width="140"] a:contains("' + nickname +'")').each(function(){
					this.classList.add('me');
				});
			}
		}highlightWriter();

		//reply button
		function replyButton(){
			if ((replyVar === '1') || (!replyVar)) {
				var btn = '<button type=\"button\" class=\"btn_reply\" title=\"답글 달기\">[답글]</button>';
				var $textarea = $('textarea[name="line_content"]');

				$myArea.find('.G12').append(btn);
				$('.btn_reply').bind('click',function(){
					var username = $(this).closest('table').parent().prev().find('a').text();
					if (!$.trim($textarea.val())){
						$textarea.focus().val(username + '// ');
					} else {
						var question = confirm('아직 작성 중인 댓글이 있습니다.\n다시 작성하시겠습니까?');
						if (question){
							$textarea.focus().val(username + '// ');
						} return false; 
					} return false;
				});
			}
		}replyButton();

		$myArea.after('<div id="commentRefresh"><button type="button" id="btn_cmtLoad">최신 댓글 불러오기</button><span id="cmtLoader"></span>');
		$('#btn_cmtLoad').bind('click',function(){
			var $writeForm = $('form[name="writeForm"]');
			mbsC = $writeForm.find('input[name="mbsC"]').val();
			mbsIdx = $writeForm.find('input[name="mbsIdx"]').val();
			cpage = $writeForm.find('input[name="cpage"]').val();
			if ($writeForm.find('input[name="wday"]').length > 0){
				wday = $writeForm.find('input[name="wday"]').val();
			} else {
				wday = $writeForm.find('input[name="co_day"]').val();
			}

			$.ajax({
				type: 'post',
				async: true,
				url: 'http://mlbpark.donga.com/mbs/commentRV.php?mbsC='+mbsC+'&comment_ymd='+wday+'&comment_idx='+mbsIdx+'&cpage='+cpage,
				beforeSend: function() {
					 $('#cmtLoader').css('opacity','1');
				},
				success: function(data) {
					$myArea.html(data);
				},
				complete: function() {
					userBlock();
					highlightWriter();
					replyButton();
					$('#cmtLoader').stop().animate({'opacity':0},200);
				}
			});
		});

		//prerender
		var target = document.head;
		pr1 = document.createElement('link');
		pr1.rel = 'prerender';
		pr1.href = 'http://mlbpark.donga.com/mbs/articleL.php?mbsC=bullpen';
		pr2 = document.createElement('link');
		pr2.rel = 'prerender';
		pr2.href = $('.paging').find('font').next().next().attr('href');
		target.appendChild(pr1);
		target.appendChild(pr2);
	});
});