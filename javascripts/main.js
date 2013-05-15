var doc = document;
var scoreTpl = 
'<div id="score">\n' +
'	<div id="score_tab">\n' +
'		<ul>\n' +
'			<li class="tab1"><a href="#score_rank" class="selected">프로야구순위</a></li>\n' +
'			<li class="tab2"><a href="#score_result">지난경기결과</a></li>\n' +
'		</ul>\n' +
'	</div>\n' +
'	<div id="score_rank" style="display:block;"></div>\n' +
'	<div id="score_result" style="display:none;"></div>\n' +
'</div>\n';

$(doc).ready(function() {
	//ScoreBoard load
	doc.getElementsByClassName('article_box')[0].insertAdjacentHTML('beforeEnd', scoreTpl);
	var scoreRank = doc.getElementById('score_rank');
	var scoreReslut = doc.getElementById('score_result');

	$.get('http://mlbpark.donga.com/poll/score.html', function(response){
		var responseWrapper = $('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, ''));
		$(scoreRank).html(responseWrapper.find('.scoreBoard'));
		$(scoreReslut).html(responseWrapper.find('#baseball2 div[id^="tab"]'));

		//controller
		var controller = scoreReslut.querySelectorAll('a[href^="javascript:onclick=show_tab"]');
		var page = scoreReslut.children;
		page[0].style.display = 'block';

		$(controller).on('click',function(e){
			var el = this.getAttribute('href').match(/[0-9]/);
			if (el > 0 && el <= 7){
				for (var p = 0; p < page.length; p++){
					page[p].style.display = 'none';
				}
				page[-(el-7)].style.display = 'block';
			}
			e.preventDefault();
		});
	});

	//scoreBoard tab
	$(doc.body).on('click','#score_tab a', function(e){
		$('#score_tab a').removeClass('selected');
		this.className = 'selected';
		scoreRank.style.display = 'none';
		scoreReslut.style.display = 'none';
		$(this.hash)[0].style.display ='block';
		e.preventDefault();
	});

	chrome.extension.sendMessage({action:'main'}, function(response) {
		var blockVar = response.block,
		blockInputVar = response.blockInput,
		blockTypeVar = response.blockType;

		if (blockVar == '1' && blockInputVar[0] !== '') {
			var bestLink = doc.querySelectorAll('.greatest_list a');
			var bestLinkLen = bestLink.length;
			var blockInputVarLen = blockInputVar.length;

			if (bestLinkLen > 0 && blockTypeVar == '2') {
				for(var i = 0; i < bestLinkLen; i++){
					var t = bestLink[i];
					for(var b = 0; b < blockInputVarLen; b++) {
						if (t.innerText.toLowerCase().indexOf(blockInputVar[b]) !== -1) {
							t.parentNode.className = 'displayNone';
							break;
						}
					}
				}
			}

			if (bestLinkLen > 0 && blockTypeVar == '1') {
				for(var i = 0; i < bestLinkLen; i++){
					var t = bestLink[i];
					for(var b = 0; b < bestLinkLen; b++) {
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
	});

	//loginbox tabIndex
	var loginBox = doc.getElementById('preViewQue2');
	if (loginBox.children[1].className == 'login') {
		doc.getElementById('bid').setAttribute('tabindex','1');
		doc.getElementById('bpw').setAttribute('tabindex','2');
		doc.getElementById('idremember').setAttribute('tabindex','3');
		loginBox.querySelector('input[alt="로그인"]').setAttribute('tabindex','4');
	}

	//mypage href fix
	var mypageLink = doc.querySelector('a[href="http://idolpark.donga.com/mypage/"]');
	if (mypageLink) {
		mypageLink.href = 'http://mlbpark.donga.com/mypage/';
	}
});