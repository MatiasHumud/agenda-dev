var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var photoSchema = new Schema({path: {type: String}, caption: {type: String}});
module.exports = mongoose.model("photos",photoSchema);

mongoose.connect("mongodb://localhost/UsersDB")

var options = {discriminatorKey: "permission"};

var recordSchema = new Schema({
    usuario:{type: Schema.Types.ObjectId, ref: "User", required: "User is blank"},
    a1:{type: String},
    a2:{type: String},
    a2fech:{type: String},
    photoInjury:{type: String}
},options);

var Record = mongoose.model("Record", recordSchema);
module.exports.Record = Record;