var express = require("express");
var Documento = require("../models/documento").Documento;
var User = require("../models/user").User;
var Service = require("../models/service").Service;
var Event = require("../models/event").Event;
var router = express.Router();
var fs = require("fs");
var documentFinder = require("../middlewares/documents/find-document");
var docCollectionFinder = require("../middlewares/documents/find-collection");
var availableSelection = require("../middlewares/documents/available-sel");
var ressEventFinder = require("../middlewares/resource-doc-collection");
var redis = require("redis");
var moment = require("moment");
var helpers = require("../utils/pack-doc-bind");

var client = redis.createClient();

/* Arquitectura para el manejo de documentos: CRUD = "Create Read Update Delete" */
/* En este caso, "documento" son los eventos (sesiones de tratamiento) */
/*REST - Documentos*/
router.all("/events", ressEventFinder);
router.get("/events", function(req, res){
	res.json(res.locals.eventos);
});

// Assign "availableSelection" middleware to every document creation request
router.all("/new", availableSelection);
router.get("/new", function(req, res){
	res.render("session/documentos/new", 
		{ 
			users: res.locals.users,
			branches: res.locals.branches,
			resources: res.locals.resources,
			services: res.locals.services,
			packs: res.locals.packs
		});
});

// Assign "documentFinder" middleware to every document/id request 
router.all("/:id*", documentFinder);
// Assign "availableSelection" middleware to every document/id/edit request 
router.all("/:id/edit", availableSelection);
// Despliega el formulario para edición de un documento específico
router.get("/:id/edit", function(req, res){
	if(res.locals.documento.status != "ejecutado"){
		res.render("session/documentos/edit", 
		{ 
			users: res.locals.users,
			branches: res.locals.branches,
			resources: res.locals.resources,
			services: res.locals.services,
			packs: res.locals.packs
		});
	}
	else{
		res.redirect("/session/documentos/");
	}
});

// Assign "docCollectionFinder" middleware to every document collection request
router.all("/", docCollectionFinder);

//CRUD documentos específicos
router.route("/:id")
	.get(function(req, res){//Mostrar documento seleccionado
		res.render("session/documentos/show", {documento: res.locals.documento});
	})
	.put(function(req, res){//Editar documento seleccionado
		res.locals.documento.usuario = req.body.usr;
		res.locals.documento.servicio = req.body.svc;
		res.locals.documento.recurso = req.body.ress;
		res.locals.documento.sucursal = req.body.brch;
		res.locals.documento.event = new Event(JSON.parse(req.body.dateSelect));
		res.locals.documento.timestamp.updatedAt = Date.now();

		res.locals.documento.save(function(err){
			if(!err){
				res.redirect("/session/documentos/");	
			}
			else{
				console.log(err);
				res.redirect("/session/documentos/"+req.params.id+"/edit");
			}				
		})
	})
	.delete(function(req, res){//Borrar documento seleccionado
		Documento.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/session/documentos");
			}
			else{
				res.redirect("/session/documentos/"+req.params.id)
			}
		});
	});
//CRUD colección de documentos propios
router.route("/")
	.get(function(req, res){//Retorna todos los documentos del usuario
		res.render("session/documentos/collection", {documentos: res.locals.documentos});
	})
	.post(function(req, res){//Crea un nuevo documento
		saveToDB(req, res);
		res.redirect("/session/documentos/");
	});	

//Save new documents to DB, separating each service into a different document
async function saveToDB(req, res){
	var evt = JSON.parse(req.body.dateSelect);
	var usr = req.body.usr;
	var svc = await Service.find({_id: req.body.svc}).exec();
	var ress = req.body.ress;
	var brch = req.body.brch;
	var docs = new Array(Documento);
	var packBind = {};
	for(var i = 0; i < svc.length; i++){
		evt.end = moment(evt.start).add(svc[i].duration, 'minutes');
		docs[i] = new Documento({
			usuario: usr,
			servicio: svc[i],
			recurso: ress,
			sucursal: brch,
			event: Event(evt)
		});
		evt.start = evt.end;
		try {
			packBind["5c6da9ff1898f237107b269d"/*req.body.pack[i]*/].push(i/*req.body.idx[i]*/);
		}
		catch(e) {
			packBind["5c6da9ff1898f237107b269d"/*req.body.pack[i]*/] = [i/*req.body.idx[i]*/];
		}
	}

	Documento.insertMany(docs, function(err, svDocs){
		if(!err){
			helpers.updatePacks(req, res, svDocs, packBind);
			return true;
		}
		else{
			console.log("Error on saving: "+ err);
			return false;
		}
	});
}

module.exports = router;
