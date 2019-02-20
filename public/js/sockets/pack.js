var socket = io();

socket.on("new pack", function(data){
	var data = JSON.parse(data);

	var dataRow = document.querySelector("#packs");
	var source = document.querySelector("#pack-template").innerHTML;

	var template = Handlebars.compile(source);
	dataRow.innerHTML = template(data) + dataRow.innerHTML;
});