async function saveToDB(docs){	
	Documento.insertMany(docs, function(err, svDocs){
		if(!err){
			return true;
		}
		else{
			console.log("Error on saving: "+ err);
			return false;
		}
	});
}

module.exports.saveToDB = saveToDB;