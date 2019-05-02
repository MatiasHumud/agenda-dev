var Record = require("../../models/record").Record;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			Record.find({})
				.populate("records").exec(function(err, record){
					if(!err){
						res.locals.record = record;
						next();
					}
					else{
						res.redirect("/session");
					}
				})
			break;
		case "Branch":
			Record.find({})
				.populate("records").exec(function(err, record){
					if(!err){
						res.locals.record = record;
						next();
					}
					else{
						res.redirect("/session");
					}
				})
				break;
		case "Resource":
			Record.find({})
			.populate("records").exec(function(err, record){
				if(!err){
					res.locals.record = record;
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
