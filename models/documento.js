var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var docSchema = new Schema({
	title: {type: String, default: "default"},
	usuario:{type: Schema.Types.ObjectId, ref: "User", required: "User is blank"},
	recurso:{type: Schema.Types.ObjectId, ref: "Resource"},
	sucursal:{type: Schema.Types.ObjectId, ref: "Branch"},
	servicio:{type: Schema.Types.ObjectId, ref: "Service"},
	status:{
		type: String, required: "Status is blank", default: "comprado",
		enum: {values: ["comprado", "agendado", "ejecutado"], message: "Incorrect status"}
	},
	event:{type: Object},
	timestamps: [Date] //dateBought, dateScheduled, dateExecuted
});

var Documento = mongoose.model("Documento", docSchema);

module.exports.Documento = Documento;