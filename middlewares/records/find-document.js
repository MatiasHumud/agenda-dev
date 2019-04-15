vmodule.exports = function(req, res, next){
	Record.findById(req.params.id)
		.populate("usuario")
		.exec(function(err, doc){
			if(doc != null){
				res.locals.record = doc;
				next();
			}
			else{
				res.redirect("/session");
			}
	});
}
