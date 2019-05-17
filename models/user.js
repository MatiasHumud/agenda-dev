var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/UsersDB")

var mail_match = [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					"Invalid email"];

var rut_math = [/^(\d{1}|\d{2})\.(\d{3}\\d{3}-).([a-zA-Z]{1}$|\d{1}$)/, "Invalid RUT"];

var phone_math = [/\(?([0-9]{2})\)?([ .-]?)([0-9]{4})\2([0-9]{4})/, "Invalid Number Phone"];

var options = {discriminatorKey: "permission"};

// define schema
var userSchema = new Schema({
	rut:{type: String, match: rut_math},
	name:{type: String, required: "Name is blank"},
	lastName1:{type: String, required: "Last name1 is blank"},
	lastName2:{type: String, required: "Last name2 is blank"},
	gender:{
		type: String, required: "Gender is blank",
		enum: {values: ["H", "M"], message: "Incorrect category"}
	},
	fechnac:{type: Date},
    fono:{type: Number},
	mail:{type: String},
	password:{
		type: String,
		required: "Password is blank",
		minlength: [8, "Password must be 8 characters min"],
		validate:{
			validator: function(p){
				return this.pass_confirm == p;
			},
			message: "Password does not match"
		}
	}
}, options);

userSchema.virtual("pass_confirm").get(function(){
	return this.p_c;
}).set(function(p){
	this.p_c = p;
});

// Client (Regular) User
var User = mongoose.model("User", userSchema);

// Branch User
var branchSchema = new Schema({
	address: {type: String, required: "Branch address is blank"},
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
var Branch = User.discriminator("Branch", branchSchema);

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
