var Record = require("../../models/record").Record;

module.exports = function(req, res, next){
	Record.findById(req.params.id)
		.populate("usuario")
		.exec(function(err, rcrd){
			if(rcrd != null){
				res.locals.record = rcrd;
				next();
			}
			else{
				res.redirect("/session/records");
			}
	});
}
