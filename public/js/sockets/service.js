var socket = io();

socket.on("new service", function(data){

	var data = JSON.parse(data);

	var dataRow = document.querySelector("#servicios");
	var source = document.querySelector("#servicio-template").innerHTML;

	var template = Handlebars.compile(source);
	dataRow.innerHTML = template(data) + dataRow.innerHTML;
});