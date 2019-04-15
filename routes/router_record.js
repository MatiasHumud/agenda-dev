var express = require("express");
var Service = require("../models/record").Record;
var router = express.Router();
var availableServices = require("../middlewares/records/available-sel");
var serviceFinder = require("../middlewares/records/find-document");
var svcCollFinder = require("../middlewares/records/find-collection");
var redis = require("redis");

var client = redis.createClient();