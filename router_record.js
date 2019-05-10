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

router.all("/", svcCollFinder);
router.route("/:id")
    .get(function(req, res){
        res.render("session/records/show", {record: res.locals.record});
    })
    .post(function(req, res){
        res.locals.records.usr = req.body.usr;
        res.locals.records.dscrpa1 = req.body.dscrpa1;
        res.locals.records.dscrpa1 = req.body.dscrpa2;
        res.locals.records.dateInjury = req.body.dateInjury;
        res.locals.records.photoInjury = req.body.photoInjury;
		res.locals.records.save(function(err){
			if(!err){
				res.redirect("/session/records");
			}
			else{
				console.log(err);
				res.redirect("/session/records/show");
			}
		})
	});

module.exports = router;
