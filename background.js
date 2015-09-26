document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({'active':true}, function(tabs){
		console.log(tabs)
		alert("It works!");
});