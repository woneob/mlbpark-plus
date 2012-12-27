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

function blockUser(request, sender) {
	var user = request.data.user;
	var blockUserVar = localStorage["blockUserInput"];
	if(!user) {
		return {
			result: false,
			user: user,
			message: '잘못된 닉네임: "' + user + '"'
		};
	}
	// 기존 설정된 차단 닉네임이 있는지 확인
	if(!blockUserVar || 0 > blockUserVar.search(new RegExp('(,|^)' + user.replace(/([\[\]\(\)])/g, '\\$1') + '(,|$)'))) {
		if(!blockUserVar) localStorage["blockUserInput"] = user;
		else localStorage["blockUserInput"] = blockUserVar + ',' + user;
		return {
			result: true,
			user: user
		};
	} else {
		return {
			result: false,
			user: user,
			message: '이미 포함되어 있는 닉네임: "' + user + '"'
		};
	}
};

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
		case 'blockUser':
			sendResponse(blockUser(request, sender));
		break;
	}
}
chrome.extension.onMessage.addListener(onMessage);
