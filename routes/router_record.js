var express = require("express");
var Service = require("../models/record").Record;
var router = express.Router();
var availableRecord = require("../middlewares/records/available-sel");
var recordFinder = require("../middlewares/records/find-document");
var recordCollFinder = require("../middlewares/records/find-collection");
var redis = require("redis");

var client = redis.createClient();

router.all("/new",availableRecord);
router.get("/new",function(req,res){
    res.render("session/records/new", {
        tipos:res.locals.tipos,
        genders:res.locals.genders
    });
});

// Assign "serviceFinder" middleware to every servicios request
router.all("/:id*", recordFinder);
// Assign "availableSelection" middleware to every servicios/edit request
router.all("/:id/edit", availableRecord);
// Despliega el formulario para edición de un servicios específico
router.get("/:id/edit", function(req, res){
	res.render("session/records/edit", {
		tipos: res.locals.tipos,
		genders: res.locals.genders,
		service: res.locals.service
	});
});

router.all("/", recordCollFinder);

router.route("/:id")
	.get(function(req, res){//Mostrar servicio seleccionado
		res.render("session/records/show", {service: res.locals.service});
	})
	.put(function(req, res){//Editar servicio seleccionado
		res.locals.service.name = req.body.name;
		res.locals.service.category = req.body.category;
		res.locals.service.brief = req.body.brief;
		if(req.body.isAllDay == "on"){
			res.locals.service.isAllDay = true;
			res.locals.service.duration = 540;
		}
		else{
			res.locals.service.isAllDay = false;
			res.locals.service.duration = (function(cat){
				switch(cat){
					case "XS": return 5;
					case "S": return 10;
					case "M": return 20;
					case "L": return 30;
				}
			})(res.locals.service.category);
		}
		res.locals.service.gender = req.body.gender;

		res.locals.service.save(function(err){
			if(!err){
				res.redirect("/session/records/");
			}
			else{
				console.log(err);
				res.redirect("/session/records/"+req.params.id+"/edit");
			}
		})
	})
	.delete(function(req, res){//Borrar documento seleccionado
		Service.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/session/records");
			}
			else{
				res.redirect("/session/records/"+req.params.id)
			}
		});
	});



