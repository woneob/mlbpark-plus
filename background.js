chrome.webRequest.onBeforeRequest.addListener(
	function() {
		return {redirectUrl:"about:blank"};
	}, {
		urls:[
			"http://idolpark.donga.com/*",
			"http://sports.donga.com/*",
			"http://mlbpark.donga.com/poll/*",
			"http://openapi.donga.com/SPORTS/suggestion"
		], types: ["sub_frame"]
	}, ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
	function() {
		return {redirectUrl:"about:blank"};
	}, {
		urls:[
			"http://ar.donga.com/*",
			"http://cad.donga.com/*",
			"http://mlbpark.donga.com/acecounter/*",
			"http://210.115.150.117/log/*",
			"http://mlbpark.donga.com/mypage/memo_read.php",
			"http://www2.donga.com:8080/*",
			"http://sports.donga.com/pictorial/*"
		]
	}, ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
	function() {
		return {redirectUrl:chrome.extension.getURL('/images/userIcon.gif')};
	}, {
		urls:[
			"http://mlbpark.donga.com/data/",
			"http://mlbpark.donga.com/data/emoticon/0.gif",
			"http://mlbpark.donga.com/data/emoticon/1.gif"
		]
	}, ["blocking"]
);

function storeDefaultOptionValueIfNotExists() {
	if(null == localStorage['titIcon']) localStorage['titIcon'] = 1;
	if(null == localStorage['team']) localStorage['team'] = 1;
	if(null == localStorage['blind']) localStorage['blind'] = 1;
	if(null == localStorage['block']) localStorage['block'] = 0;
	if(null == localStorage['blockInput']) localStorage['blockInput'] = '';
	if(null == localStorage['blockType']) localStorage['blockType'] = 1;
	if(null == localStorage['blockUser']) localStorage['blockUser'] = 0;
	if(null == localStorage['blockUserInput']) localStorage['blockUserInput'] = '';
	if(null == localStorage['userHistory']) localStorage['userHistory'] = 0;
	if(null == localStorage['reply']) localStorage['reply'] = 1;
	if(null == localStorage['userCommentView']) localStorage['userCommentView'] = 1;
	if(null == localStorage['video']) localStorage['video'] = 1;
	if(null == localStorage['imageSearch']) localStorage['imageSearch'] = 1;
	if(null == localStorage['passwd']) localStorage['passwd'] = 0;
	if(null == localStorage['notice']) localStorage['notice'] = 0;
	if(null == localStorage['shortcut']) localStorage['shortcut'] = 1;
	if(null == localStorage['width']) localStorage['width'] = 0;
	if(null == localStorage['widthVal']) localStorage['widthVal'] = 858;
}

function onMessage(request, sender, sendResponse) {
	switch (request.action){
		case 'mbs':
			sendResponse({
				titIcon: localStorage["titIcon"],
				team: localStorage["team"],
				blind: localStorage["blind"],
				block: localStorage["block"],
				blockInput: localStorage["blockInput"],
				blockType: localStorage["blockType"],
				blockUser: localStorage["blockUser"],
				blockUserInput: localStorage["blockUserInput"],
				userHistory: localStorage["userHistory"],
				reply: localStorage["reply"],
				userCommentView: localStorage["userCommentView"],
				video: localStorage["video"],
				notice: localStorage["notice"],
				shortcut: localStorage["shortcut"],
				imageSearch: localStorage["imageSearch"]
			});
		break;
		case 'width':
			sendResponse({
				width: localStorage["width"],
				widthVal: localStorage["widthVal"]
			});
		break;
		case 'passwd':
			sendResponse({
				passwd: localStorage["passwd"]
			});
		break;
	}
}
chrome.extension.onMessage.addListener(onMessage);
storeDefaultOptionValueIfNotExists();