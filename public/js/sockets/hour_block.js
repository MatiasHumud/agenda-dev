var socket = io();

socket.on("new hrBlock", function(data){

	var data = JSON.parse(data);

	var dataRow = document.querySelector("#bloqueos");
	var source = document.querySelector("#bloqueos-template").innerHTML;

	var template = Handlebars.compile(source);
	dataRow.innerHTML = template(data) + dataRow.innerHTML;
});