//var Documento = require("../models/documento").Documento;

module.exports = function(documento, req, res){
	if(
		(documento.usuario._id.toString() == res.locals.user._id) ||
		(documento.recurso._id.toString() == res.locals.user._id) ||
		(documento.sucursal._id.toString() == res.locals.user._id) ||
		(res.locals.user.permission == "Admin")
		){
		return true;
	}
	return false;
}