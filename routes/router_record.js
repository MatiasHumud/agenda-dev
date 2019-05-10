var express = require("express");
var Record = require("../models/record").Record;
var router = express.Router();
var availableServices = require("../middlewares/records/available-sel");
var serviceFinder = require("../middlewares/records/find-document");
var svcCollFinder = require("../middlewares/records/find-collection");
var redis = require("redis");

var client = redis.createClient();

router.all("/new", availableServices);
router.get("/new", function(req, res){
    res.render("session/records/new", {record: res.locals.record});
});

router.all("/:id*", serviceFinder);
router.all("/:id/edit", availableServices);

router.get("/session/edit", function(req, res){
	res.render("session/records/edit", {record: res.locals.record});
});

router.all("/", svcCollFinder);

router.route("/:id")
    .get(function(req, res){
        res.render("session/records/show", {record: res.locals.record});
    })
    .put(function(req, res){
			if(req.body.usr) res.locals.record.usuario = req.body.usr;
			if(req.body.dscrpa1) res.locals.record.dscrpa1 = req.body.dscrpa1;
			if(req.body.dscrpa2) res.locals.record.dscrpa2 = req.body.dscrpa2;
			if(req.body.dateInjury) res.locals.record.dateInjury = req.body.dateInjury;
			if(req.body.photoInjury) res.locals.record.photoInjury = req.body.photoInjury;
			res.locals.record.save(function(err){
				if(!err){
					res.redirect("/session/records");
				}
				else{
					console.log(err);
					res.redirect("/session/records/"+req.params.id+"edit");
				}
			})
        });

router.route("/")
    .get(function(req, res){
		if(res.locals.user.permission == undefined) {
			res.render("session/records/show", {record: res.locals.record});
		}
    })
    .post(function(req, res){
        var record = new Record({
            usuario: req.body.usr,
            dscrpa1: req.body.dscrpa1,
            dscrpa2: req.body.dscrpa2,
            dateInjury: req.body.dateInjury,
            photoInjury: req.body.photoInjury
        })
		record.save(function(err){
			if(!err){
                client.publish("record", JSON.stringify(record));
				res.redirect("/session/records");
			}
			else{
				console.log(err);
				res.redirect("/session/records/show");
			}
		})
	});

module.exports = router;
