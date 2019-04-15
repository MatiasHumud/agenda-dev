var Pack = require("../../models/pack").Pack;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Resource":
			Pack.find({})
				.populate("usuario")
				.populate("packType")
				.populate({
					path: "treatment.docs",
					populate: {path: "servicio sucursal"} 
				})
				.exec(function(err, packs){
					if(!err){
						res.locals.packs = packs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
			break;
		case "Branch":
			Pack.find({})
				.populate("usuario")
				.populate("packType")
				.populate({
					path: "treatment.docs",
					populate: {path: "servicio sucursal"} 
				})
				.exec(function(err, packs){
					if(!err){
						res.locals.packs = packs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
			break;
		case "Admin":
			Pack.find({})
				.populate("usuario")
				.populate("packType")
				.populate({
					path: "treatment.docs",
					populate: {path: "servicio sucursal"} 
				})
				.exec(function(err, packs){
					if(!err){
						res.locals.packs = packs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
			break;
		default:
			Pack.find({usuario: res.locals.user._id})
				.populate("usuario")
				.populate("packType")
				.populate({
					path: "treatment.docs",
					populate: {path: "servicio sucursal"} 
				})
				.exec(function(err, packs){
					if(!err){
						res.locals.packs = packs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
			break;
	}
}