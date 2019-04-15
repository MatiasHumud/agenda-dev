var socket = io();

socket.on("new document", function(data){
	var data = JSON.parse(data);
	var dataRow = document.querySelector("#documentos");
	var source = document.querySelector("#documento-template").innerHTML;

	var template = Handlebars.compile(source);
	dataRow.innerHTML = template(data) + dataRow.innerHTML;
});