var Pack = require("../models/pack").Pack;

async function updatePacks (req, res, docs, packBind) {
	var packIds = Object.keys(packBind);
	var packs = await Pack.find({_id: packIds}).exec();
	var treatmentRef;
	var count = 0;
	for (var i = 0; i < packs.length; i++) {
		treatmentRef = packBind[packIds[i]];
		for (var j = 0; j < treatmentRef.length; j++) {
			try {
				packs[i].treatment[treatmentRef[j]].docs.push(docs[count++]);	
			}
			catch(e) {
				packs[i].treatment[treatmentRef[j]].docs = [docs[count++]];
			}
		}
	
		packs[i].save(function(err, doc){
			if(!err){
				console.log(doc.treatment);
				return true;	
			}
			else{
				console.log(err);
				return false;
			}				
		});
	}
}

exports.updatePacks = updatePacks;