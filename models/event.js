var mongoose = require("mongoose");
var moment = require("moment");
var Schema = mongoose.Schema;

// define schema
var eventSchema = new Schema({
	title:{type: String, default: "sesión"},
	start:{type: Date, required: "event start is blank"},
	end:{type: Date, required: "event end is blank"},
	allDay:{type: Boolean, default: false}
});

var Event = mongoose.model("Event", eventSchema);

module.exports.Event = Event;