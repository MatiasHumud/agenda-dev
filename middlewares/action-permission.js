

module.exports = function(req, res){
	switch(req.path)
	case "/session/agenda":
		if(res.locals.user.permission == undefined)
			return false;
		return true;
		break;
	case "/session/servicios":
		if(res.locals.user.permission == undefined ||
			res.locals.user.permission == "Resource")
			return false;
		return true;
		break;
	case "/session/org":
		if(res.locals.user.permission == "Admin" ||
			res.locals.user.permission == "Branch")
			return true;
		return false;
		break;
	default:
		return true;	
}