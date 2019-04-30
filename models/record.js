var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/UsersDB")

var email_match = [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    "Invalid email"];

var rut_math = ["^(\d{1}|\d{2})\.(\d{3}\.\d{3}-)([a-zA-Z]{1}$|\d{1}$)", "Invalid RUT"];

var options = {discriminatorKey: "permission"};

var recordSchema = new Schema({
    photoCli:{type: String, required: "Photo is blank"},
    nameCli:{type: String, required: "Name is blank"},
    lastNameCli:{type: String, required: "Last Name is blank"},
    rutCli:{type: String, required: "RUT is blank", match: rut_math},
    fechNac:{type: Date, required: "Birth is blank"},
    genderCli:{
		type: String, required: "Gender is blank",
		enum: {values: ["H", "M"], message: "Incorrect category"}
    },
    locationCli:{type: String, required: "Location is blank"},
    emailCli:{type: String, required: "Email is blank", match:email_match},
    fonoCli:{type: Number, required: "Telephone is blank"},
    descCli:{type: String, required: "Description is blank"},
    a2:{type: String, required: "A2 is blank"}
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
