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
    res.render("session/records/new", {
        tipos: res.locals.tipos,
        genders: res.locals.genders
    });
});


router.all("/:id*", serviceFinder);
router.all("/:id/edit", function(req, res){
    redis.render("session/records/edit", {
        tipos: res.locals.tipos,
		genders: res.locals.genders,
		service: res.locals.service
    });
});

router.all("/", svcCollFinder);

router.route("/:id")
    .get(function(req,res){
        res.render("session/records/show", {records: res.locals.records});
    })



module.exports = router;
