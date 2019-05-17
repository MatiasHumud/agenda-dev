var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/UsersDB")

var options = {discriminatorKey: "permission"};

var recordSchema = new Schema({
    usuario: {type: Schema.Types.ObjectId, ref: "User"},
    dscrpa1 : {type: String},
    dscrpa2 : {type: String},
    dateInjury : {type: String},
    photoInjury: {type: String}
},options);

var Record = mongoose.model("Record", recordSchema);

module.exports.Record = Record;

