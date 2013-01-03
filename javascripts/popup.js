// extension 정보를 담는다.
var extensionInfo;

function displayExtensionVersion(version) {
	if(version) $('#version').text(version);
	else $('#version').text(extensionInfo.version);
}


$(window).load(function(){
	// extension 정보를 가져온다.
	window.postMessage({action:'extensionInfo'}, '*');
});

window.addEventListener('message', function(event) {
	// We only accept messages from ourselves
	if (window != event.source) return;

	switch(event.data.action) {
		case 'extensionInfo' :
			chrome.extension.sendMessage({action:event.data.action}, function(response) {
				extensionInfo = response;
				displayExtensionVersion();
			});
			console.log('test');
			return 'test';
		break;
	}
}, false);
