var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var serviceSchema = new Schema({
	name:{type: String, required: "Name is blank"},
	category:{
		type: String, required: "Service category is blank",
		enum: {values: ["XS", "S", "M", "L"], message: "Incorrect category"}
	},
	brief:{type: String},
	moduleCount:{type: Number, required: "Module count is blank"},
	isAllDay:{type: Boolean, default: false}
});

// Retorna el largo del servicio en horas
serviceSchema.virtual("length").get(function(){
	return this.moduleCount * global.moduleLength;
});

var Service = mongoose.model("Service", serviceSchema);

module.exports.Service = Service;