var Pack = require("../../models/pack").Pack;

module.exports = function(req, res, next){
	Pack.findById(req.params.id)
		.populate("usuario")
		.populate("packType")
		.exec(function(err, pck){
			if(!err && pck != null){
				res.locals.pack = pck;
				next();			
			}
			else{
				res.redirect("/session/packs");	
			}
		});
}
