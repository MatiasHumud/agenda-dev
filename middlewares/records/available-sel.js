var Record = require("../../models/record").Record;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					User.find({permission: "Branch"}).then(function(brnchs){
						if(brnchs){
							User.find({permission: "Resource"}).then(function(resrcs){
								if(resrcs){
									Record.find({}).then(function(rcrd){
										if(!err){
											if(rcrd){
												res.locals.users = usrs;
												res.locals.branches = brnchs;
												res.locals.resources = resrcs;
												res.locals.record = rcrd;
												next();
											}
											else{
												console.log("No se encontraron fichas clínicas");
												res.redirect("/session");
											}
										}else{
											console.log(String(err));
											console.log("Error no se encontraron fichas clinicas en la base de datos");
											res.redirect("/session");
										}
									});
								}
								else{
									console.log("No se encontraron recursos");
									res.redirect("/session");
								}
							}, function(err){
								console.log(String(err));
								console.log("Error al buscar recursos en la base de datos")
								res.redirect("/session");
							});
						}
						else{
							console.log("No se encontraron sucursales");
							res.redirect("/session");
						}
					}, function(err){
						console.log(String(err));
						console.log("Error al buscar sucursales en la base de datos")
						res.redirect("/session");
					});
					}else{
						console.log("No se encontraron usuarios");
						res.redirect("/session");
					}
				}, function(err){
					console.log(String(err));
					console.log("Error al buscar usuarios en la base de datos")
					res.redirect("/session");
				});
			break;
		case "Branch":
			User.find({permission: undefined}).then(function(usrs){
			if(usrs){
				User.find({permission: "Resource", parentBranch: res.locals.user._id}).then(function(resrcs){
					if(resrcs){
						Record.find({}).then(function(rcrd){
							if(!err){
								if(rcrd){
									res.locals.users = usrs;
									res.locals.branches = [res.locals.user];
									res.locals.resources = resrcs;
									res.locals.record = rcrd;
									next();
								}
								else{
									console.log("No se encontraron fichas clínicas");
									res.redirect("/session");
								}
							}else{
								console.log(String(err));
								console.log("Error no se encontraron fichas clinicas en la base de datos");
								res.redirect("/session");
							}
						});
					}
					else{
						console.log("No se encontraron recursos");
						res.redirect("/session");
					}
				}, function(err){
					console.log(String(err));
					console.log("Error al buscar recursos en la base de datos")
					res.redirect("/session");
				});
				}else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			}, function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en la base de datos")
				res.redirect("/session");
			});
			break;
		case "Resource":
			User.find({permission: undefined}).then(function(usrs){
			if(usrs){
				User.find({permission: "Branch", _id: res.locals.user.parentBranch}).then(function(brnchs){
					if(brnchs){
						Record.find({}).then(function(rcrd){
							if(!err){
								if(rcrd){
									res.locals.users = usrs;
									res.locals.branches = [res.locals.user];
									res.locals.resources = resrcs;
									res.locals.record = rcrd;
									next();
								}
								else{
									console.log("No se encontraron fichas clínicas");
									res.redirect("/session");
								}
							}else{
								console.log(String(err));
								console.log("Error no se encontraron fichas clinicas en la base de datos");
								res.redirect("/session");
							}
						});
					}
					else{
						console.log("No se encontraron recursos");
						res.redirect("/session");
					}
				}, function(err){
					console.log(String(err));
					console.log("Error al buscar recursos en la base de datos")
					res.redirect("/session");
				});
				}else{
					console.log("No se encontraron sucursales");
					res.redirect("/session");
				}
			}, function(err){
				console.log(String(err));
				console.log("Error al buscar sucursales en la base de datos")
				res.redirect("/session");
			});
			break;
		default:
			Record.find({}).then(function(rcrd){
				if(rcrd){
					res.locals.users = [res.locals.user];
					next();
				}
				else{
					console.log("No se encontraron datos de ficha clinica");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar ficha clinica en base de datos");
				res.redirect("/session");
			});
	}
}
