module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			res.locals.permisos = ["Admin", "Branch"];
			next();
			break;
		case "Branch":
			//res.locals.sucursales = [res.locals.user];
			res.locals.permisos = ["Resource"];
			next();
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session/org");
	}
}