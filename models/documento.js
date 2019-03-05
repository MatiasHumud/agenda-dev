var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var docSchema = new Schema({
	title: {type: String, default: "default"},
	usuario:{type: Schema.Types.ObjectId, ref: "User", required: "User is blank"},
	recurso:{type: Schema.Types.ObjectId, ref: "Resource", required: "Resource is blank"},
	sucursal:{type: Schema.Types.ObjectId, ref: "Branch", required: "Branch is blank"},
	servicio:{type: Schema.Types.ObjectId, ref: "Service"},
	status:{
		type: String, required: "Status is blank", default: "agendado",
		enum: {values: ["agendado", "confirmado", "ejecutado", "abandonado"], message: "Incorrect status"}
	},
	event:{type: Object, required: "Sesión no agendada"},
	timestamp:{
		createdAt: {type: Date},
		updatedAt: {type: Date},
		ejecutedAt: {type: Date}
	} 
});

var Documento = mongoose.model("Documento", docSchema);

module.exports.Documento = Documento;
