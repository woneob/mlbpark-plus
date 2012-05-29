$(document).ready(function() {
	//ScoreBoard load
	$('.right_cont').append(
		'<div id="score">\n' +
		'	<div id="score_tab">\n' +
		'		<ul>\n' +
		'			<li class="tab1"><a href="#score_rank" class="selected">프로야구순위</a></li>\n' +
		'			<li class="tab2"><a href="#score_result">지난경기결과</a></li>\n' +
		'		</ul>\n' +
		'	</div>\n' +
		'	<div id="score_rank" style="display:block;"></div>\n' +
		'	<div id="score_result" style="display:none;"></div>\n' +
		'</div>\n'
	);
	$.get('http://mlbpark.donga.com/poll/score.html', function(response){
		var responseWrapper = $('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, ''));

		$('#score_rank').append(responseWrapper.find('.scoreBoard'));
		$('#score_result').append(responseWrapper.find('#baseball2 div[id^="tab"]'));
		$('#tab7').css('display','block');

		//controller
		var $controller = $('a[href^="javascript:onclick=show_tab"]');
		$tab = $('#score_result > div');

		$controller.bind('click',function(e){
			var el = $(this).attr('href').match(/[0-9]/);
			if ((el > 0) && (el <= 7)){
				$tab.css('display','none');
				$('#tab' + el).css('display','block');
			}
			e.preventDefault();
		});
	});

	//scoreBoard tab
	var content = '#score_rank, #score_result';
	tab = '#score_tab a';
	$(tab).click(function(e){
		$(tab).removeClass('selected');
		$(this).addClass('selected');
		$(content).css('display','none');
		$($(this).attr('href')).css('display','block');
		e.preventDefault();
	});

	//equal height
	$('.article_box, .right_cont').addClass('eHeight');
	maxHeight = 0;
	$('.eHeight').each(function() {
		maxHeight = Math.max(maxHeight, $(this).outerHeight());
	});
	$('.eHeight').css({ height: maxHeight + 'px' });

	//loginbox tabIndex
	$('#bid').attr('tabindex','1');
	$('#bpw').attr('tabindex','2');
	$('#idremember').attr('tabindex','3');
	$('input[alt="로그인"]').attr('tabindex','4');

	//mypage href fix
	$('a[href="http://idolpark.donga.com/mypage/"]').attr('href','http://mlbpark.donga.com/mypage/');
});