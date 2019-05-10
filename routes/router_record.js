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
    res.render("session/records/new", {users: res.locals.users});
});

router.all("/:id*", serviceFinder);
router.all("/:id/edit", availableServices);

router.all("/:id/edit", function(req, res){
    redis.render("session/records/edit");
});

router.all("/", svcCollFinder);

router.route("/:id")
    .get(function(req, res){
        res.render("session/records/show", {record: res.locals.record});
    })
    .put(function(req, res){
        res.locals.record.usr = req.body.usr;
        res.locals.record.a1 = req.body.a1;
        res.locals.record.a2 = req.body.a2;
        res.locals.record.a2fech = req.body.a2fech;

		res.locals.packType.save(function(err){
			if(!err){
				res.redirect("/session/records/");
			}
			else{
				console.log(err);
				res.redirect("/session/records/"+req.params.id+"/edit");
			}
		})
	})
    .delete(function(req, res){
        if(res.locals.record.isRemovable) {
            record.findOneAndRemove({_id: req.params.id}, function(err){
                if(!err){
                    res.redirect("/session/records");
                }
                else{
                    res.redirect("/session/records/"+req.params.id)
                }
            });
        }
});

router.route("/:id")
    .post(function(req, res){
        var record = new Record({
            user: req.body.usr,
            a1: req.body.a1,
            a2: req.body.a2,
            a2fech: req.body.a2fech,
            photoInjury: req.body.photoInjury
        });
        record.save(function(err){
            if(!err){
                client.publish("records", JSON.stringify(record));
                res.redirect("/session/records/"+record._id);
            }else{
				console.log("error creando Ficha Clinica");
				res.send(err);
			}
        })
    });

module.exports = router;
