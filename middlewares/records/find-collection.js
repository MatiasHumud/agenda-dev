var Record = require("../../models/record").Record;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			Record.find({}).populate("usuario")
			.exec(function(err, rcrd){
				if(!err){
					res.locals.record = rcrd;
					next();
				}
				else{
					res.redirect("/session");
				}
			});
			break;
		case "Branch":
			Record.find({}).populate("usuario")
			.exec(function(err, rcrd){
				if(!err){
					res.locals.record = rcrd;
					next();
				}
				else{
					res.redirect("/session");
				}
			});
			break;
		case "Resource":
			Record.find({}).populate("usuario")
			.exec(function(err, rcrd){
				if(!err){
					res.locals.record = rcrd;
					next();
				}
				else{
					res.redirect("/session");
				}
			});
			break;
		default:
			Record.find({usuario: res.locals.user._id})
			.populate("usuario")
			.exec(function(err, record){
				if(!err){
					res.locals.record = record;
					next();
				}
				else{
					res.redirect("/session");
				}
			});
	}
}
