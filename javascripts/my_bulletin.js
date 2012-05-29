$(document).ready(function() {
	//replace with href of link
	var elms = document.getElementsByTagName('a');
	for (i=0; i<elms.length; i++) {
		elms[i].href = elms[i].href.replace('nmlbpark.donga.com:8090', 'mlbpark.donga.com');
	}
});