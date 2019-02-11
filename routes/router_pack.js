var express = require("express");
var Pack = require("../models/pack").Pack;
var User = require("../models/user").User;
var router = express.Router();
var fs = require("fs");
var packFinder = require("../middlewares/packs/find-document");
var docCollectionFinder = require("../middlewares/packs/find-collection");
var availableSelection = require("../middlewares/packs/available-sel");
var redis = require("redis");
var moment = require("moment");

var client = redis.createClient();

/* Arquitectura para el manejo de packs: CRUD = "Create Read Update Delete" */
/* En este caso, "documento" son los eventos (sesiones de tratamiento) */
/*REST - Documentos*/

// Assign "availableSelection" middleware to every document creation request
router.all("/new", availableSelection);
router.get("/new", function(req, res){
	res.render("session/packs/new", 
		{ 
			users: res.locals.users,
			packTypes: res.locals.packTypes
		});
});

// Assign "packFinder" middleware to every document/id request 
router.all("/:id*", packFinder);
// Assign "availableSelection" middleware to every document/id/edit request 
router.all("/:id/edit", availableSelection);
// Despliega el formulario para edición de un documento específico
router.get("/:id/edit", function(req, res){//Ruta innecesaria 404
	/*
	if(res.locals.pack.hasSessions){
		res.render("session/packs/edit", 
		{
			pack: res.locals.pack
		});
	}
	else{
		res.redirect("/session/packs/");
	}*/
});

// Assign "docCollectionFinder" middleware to every document collection request
router.all("/", docCollectionFinder);

//CRUD packs específicos
router.route("/:id")
	.get(function(req, res){//Mostrar packs seleccionado
		res.render("session/packs/show", {pack: res.locals.pack});
	})
	.put(function(req, res){//Editar pack seleccionado
		res.locals.pack.treatment = req.body.treatment;
		res.locals.pack.save(function(err){
			if(!err){
				res.redirect("/session/packs/");	
			}
			else{
				console.log(err);
				res.redirect("/session/packs/"+req.params.id+"/edit");
			}
		})
	})
	.delete(function(req, res){//Borrar documento seleccionado
		if(res.locals.pack.isRemovable) {
			Pack.findOneAndRemove({_id: req.params.id}, function(err){
				if(!err){
					res.redirect("/session/packs");
				}
				else{
					res.redirect("/session/packs/"+req.params.id)
				}
			});
		}
	});
//CRUD colección de packs propios
router.route("/")
	.get(function(req, res){//Retorna todos los packs del usuario
		res.render("session/packs/collection", {packs: res.locals.packs});
	})
	.post(function(req, res){//Crea un nuevo pack
		var pack = new Pack({
			packType: req.body.pTyp,
			usuario: req.body.usr,
			dateBought: Date.now()
		});

		pack.save(function(err){
			if(!err){
				client.publish("packs", JSON.stringify(pack));
				res.redirect("/session/packs/"+pack._id);
			}
			else{
				console.log("error creando pack");
				res.send(err);
			}
		});
	});	

/*REST - Packs*/

module.exports = router;