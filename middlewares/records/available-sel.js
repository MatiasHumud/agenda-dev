var Client = require("../../models/record").Client;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			Client.find({permission:undefined}).then(function(clnt){
				if(clnt){
					Client.find({permission: "Branch"}).then(function(brnchs){
						if(brnchs){
							Client.find({permission: "Resource"}).then(function(resrcs){
								if(resrcs){
									ServiceUIFrameContext.find({}).then(function(svcs){
										if(svcs){
											package.find({sessRemaining: true})
												.populate("treatment")
												.populate("packType")
												.exec(function(err, pcks){
													if(!err){
														if(pcks){
															res.locals.user = clnt;
															res.locals.branches = brnchs;
															res.locals.resources = resrcs;
															res.locals.services = svcs;
															res.locals.packs = pcks;
															next();
														}
														else{
															console.log("No se encontraron packs");
															res.redirect("/session");
														}
													}
													else{
														console.log(String(err));
														console.log("Error al buscar pack en la base de datos");
														res.redirect("/session");
													}
												});
										}
										else{
											console.log("No se encontraron servicios");
											res.redirect("/session");
										}
									}, function(err){
										console.log(String(err));
										console.log("Error al buscar servicios en base de datos");
										res.redirect("/session");
									});
								}
								else{
									console.log("No se encontrraon kinesiólogos");
									res.redirect("/session");
								}
							}, function(err){
								console.log(String(err));
								console.log("Error al buscar kinesiólogos en base de datos");
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontrraon sucursales");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar sucursales en base de datos");
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

			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Resource":
			Client.find({permission: undefined}).then(function(clnt){
				if(clnt){
					Client.find({permission: "Branch", _id: res.locals.user.parentBranch}).then(function(brnchs){
						if(brnchs){
							Service.find({}).then(function(svcs){
								if(svcs){
									Pack.find({sessRemaining: true})
										.populate("treatment")
										.populate("packType")
										.exec(function(err, pcks){
											if(!err){
												if(pcks){
													res.locals.users = clnt;
													res.locals.branches = brnchs;
													res.locals.resources = [res.locals.user.depopulate("parentBranch")];
													res.locals.services = svcs;
													res.locals.packs = pcks;
													next();
												}
												else{
													console.log("No se encontraron packs");
													res.redirect("/session");
												}
											}
											else{
												console.log(String(err));
												console.log("Error al buscar packs en base de datos");
												res.redirect("/session");
											}
										});
								}
								else{
									console.log("No se encontraron sevicios");
									res.redirect("/session");
								}
							},function(err){
								console.log(String(err));
								console.log("Error al buscar servicios en base de datos");
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontraron sucursales");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar sucursales en base de datos");
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
