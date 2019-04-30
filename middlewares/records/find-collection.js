var Client = require("../../models/record").Client;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			Client.find({})
				.populate("records").exec(function(err, client){
					if(!err){
						res.locals.client = client;
						next();
					}
					else{
						res.redirect("/session");
					}
				})
			break;
		case "Branch":
			Client.find({})
			.populate("records").exec(function(err, client){
				if(!err){
					res.locals.client = client;
					next();
				}
				else{
					res.redirect("/session");
				}
			})
			break;
		case "Resource":
			Client.find({})
			.populate("records").exec(function(err, client){
				if(!err){
					res.locals.client = client;
					next();
				}
				else{
					res.redirect("/session");
				}
			})
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session");
	}
}
