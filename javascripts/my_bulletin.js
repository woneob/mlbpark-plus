$(document).ready(function() {
  //replace with href of link
  var links = document.getElementsByTagName('a');

  for (var i = 0, len = links.length; i < len; i++) {
    links[i].href = links[i].href.replace('nmlbpark.donga.com:8090', 'mlbpark.donga.com');
  }
});
