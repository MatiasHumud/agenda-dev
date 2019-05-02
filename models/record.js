var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/UsersDB")

var rut_math = [/^(\d{1}|\d{2})\.(\d{3}\.\d{3}-)([a-zA-Z]{1}$|\d{1}$)/, "Invalid RUT"];

var phone_math = [/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, "Invalid Number Phone"];

var options = {discriminatorKey: "permission"};

var recordSchema = new Schema({
    photoCli:{type: String, required: "Photo is blank"},
    usuario:{type: Schema.Types.ObjectId, ref: "User", required: "User is blank"},
    rutCli:{type: String, match: rut_math},
    locationCli:{type: String, required: "Location is blank"},
    fonoCli:{type: Number, required: "Telephone is blank", match: phone_math},
    a1:{type: String, required: "Description is blank"},
    a2:[{type: Date, require: "Date injury is blank", default: Date.now},
        {type: String, required: "Description injury is blank"},
        {type: String, require: "Photo injuty is blank"}]
},options);

// Resource User
var resourceSchema = new Schema({
	parentBranch: {type: Schema.Types.ObjectId, ref: "Branch", required: "Branch is blank"},
	workHours: {
		type: Array,
		default: [
			{
				dow: [1, 2 ,3 ,4 ,5],
				start: "08:00",
				end: "19:00"
			},
			{
				dow: [6],
				start: "08:00",
				end: "14:00"
			}
		]
	}
}, options);
var Resource = User.discriminator("Resource", resourceSchema);

// Admin User
var adminSchema = new Schema({
	workHours: {
		type: Array,
		default: [
			{
				dow: [1, 2 ,3 ,4 ,5, 6, 7],
				start: "00:00",
				end: "24:00"
			}
		]
	}
}, options);
var Admin = User.discriminator("Admin", adminSchema);

// Module Exports
module.exports = {
	User: User,
	Resource: Resource,
	Branch: Branch,
	Admin: Admin
};

var Record = mongoose.model("Record", recordSchema);
module.exports.Record = Record;
