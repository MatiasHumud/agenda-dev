var socket = io();

socket.on("new member", function(data){

	var data = JSON.parse(data);

	var dataRow = document.querySelector("#miembros");
	var source = document.querySelector("#miembro-template").innerHTML;

	var template = Handlebars.compile(source);
	dataRow.innerHTML = template(data) + dataRow.innerHTML;
});