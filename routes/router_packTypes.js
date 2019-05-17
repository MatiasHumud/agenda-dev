var express = require("express");
var PackType = require("../models/packType").PackType;
var User = require("../models/user").User;
var router = express.Router();
//var fs = require("fs");
var packTypeFinder = require("../middlewares/packTypes/find-document");
var packTypeCollectionFinder = require("../middlewares/packTypes/find-collection");
var availableSelection = require("../middlewares/packTypes/available-sel");
//var moment = require("moment");
var redis = require("redis");
var client = redis.createClient();

/* Arquitectura para el manejo de packs: CRUD = "Create Read Update Delete" */
/*REST - Documentos*/

// Assign "availableSelection" middleware to every packType creation request
router.all("/new", availableSelection);
router.get("/new", function(req, res){
	res.render("session/packTypes/new", { tipos: res.locals.tipos });
});

// Assign "packTypeFinder" middleware to every packTypes/id request
router.all("/:id*", packTypeFinder);
// Assign "availableSelection" middleware to every packTypes/id/edit request
router.all("/:id/edit", availableSelection);
// Despliega el formulario para edición de un packType específico
router.get("/:id/edit", function(req, res){
	res.render("session/packTypes/edit", { packType: res.locals.packType });
});

// Assign "packTypeCollectionFinder" middleware to every packType collection request
router.all("/", packTypeCollectionFinder);

//CRUD packs específicos
router.route("/:id")
	.get(function(req, res){//Mostrar documento seleccionado
		res.render("session/packTypes/show", {packType: res.locals.packType});
	})
	.put(function(req, res){//Editar documento seleccionado
		res.locals.packType.title = req.body.title;
		res.locals.packType.nZones = req.body.nZones;
		res.locals.packType.zoneTypes = req.body.zoneTypes;
		res.locals.packType.nSessions = req.body.nSess;

		res.locals.packType.save(function(err){
			if(!err){
				res.redirect("/session/packTypes/");
			}
			else{
				console.log(err);
				res.redirect("/session/packTypes/"+req.params.id+"/edit");
			}
		})
	})
	.delete(function(req, res){//Borrar pack seleccionado
		PackType.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/session/packTypes");
			}
			else{
				res.redirect("/session/packTypes/"+req.params.id)
			}
		});
	});
//CRUD colección de packTypes propios
router.route("/")
	.get(function(req, res){//Retorna todos los packTypes del usuario
		res.render("session/packTypes/collection", {packTypes: res.locals.packTypes});
	})
	.post(function(req, res){//Crea un nuevo packType
		var packType = new PackType({
			title: req.body.title,
			nZones: req.body.nZones,
			zoneTypes: req.body.zonesString,
			nSessions: req.body.nSessions
		});

		packType.save(function(err){
			if(!err){
				client.publish("packType", JSON.stringify(packType));
				res.redirect("/session/packTypes/"+packType._id);
			}
			else{
				console.log("error creando packType");
				res.send(err);
			}
		});
	});

/*REST - Packs*/

module.exports = router;