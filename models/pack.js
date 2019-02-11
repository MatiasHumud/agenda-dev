var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// define schema
var packSchema = new Schema({
	packType:{type: Schema.Types.ObjectId, ref: "PackType", required: "Pack type is blank"},
	usuario:{type: Schema.Types.ObjectId, ref: "User", required: "User is blank"},
	dateBought:{type: Date, required: "Date is blank"},
	isRemovable:{type: Boolean, default: true},//Si no tiene documentos asociados
	sessRemaining:{type: Boolean, default: true},
	payed:{type: Boolean, default: false},
	treatment:[{
		docs: {type: [Schema.Types.ObjectId], ref: "Documento"}
	}]
});

var Pack = mongoose.model("Pack", packSchema);

module.exports.Pack = Pack;