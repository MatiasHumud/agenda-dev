module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			
			break;
		case "Branch":
			
			break;
		case "Resource":
			
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session");
	}
}
