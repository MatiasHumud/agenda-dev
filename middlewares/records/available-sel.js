var Client = require("../../models/record").Client;
var PackType = require("../../models/PackType").PackType;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			Client.find({permission:undefined}).then(function(clnt){
				if(clnt){
					PackType.find({isAvailable: true}).then(function(pTyp){
						if(pTyp){
							res.locals.Client = clnt;
							res.locals.packTypes = pTyp;
							next();
						}
						else{
							console.log("No se encontraron packTypes");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar packTypes en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Branch":
			Client.find({permission: undefined}).then(function(clnt){
				if(clnt){
					PackType.find({isAvailable: true}).then(function(pTyp){
						if(pTyp){
							res.locals.users = clnt;
							res.locals.packTypes = pTyp;
							next();
						}
						else{
							console.log("No se encontraron packTypes");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar packTypes en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Resource":
		Client.find({permission: undefined}).then(function(clnt){
			if(clnt){
				PackType.find({isAvailable: true}).then(function(pTyp){
					if(pTyp){
						res.locals.Client = clnt;
						res.locals.packTypes = pTyp;
						next();
					}
					else{
						console.log("No se encontraron packTypes");
						res.redirect("/session");
					}
				},function(err){
					console.log(String(err));
					console.log("Error al buscar packTypes en base de datos");
					res.redirect("/session");
				});
			}
			else{
				console.log("No se encontraron usuarios");
				res.redirect("/session");
			}
		},function(err){
			console.log(String(err));
			console.log("Error al buscar usuarios en base de datos");
			res.redirect("/session");
		});
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session");
	}
}
