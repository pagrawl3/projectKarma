//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	ngoModel	= mongoose.model('ngo'),
	initiativeModel = mongoose.model('initiatives')

exports.landing = function(req, res) {
	//find all the files linked to that user and pass them on to the template
	res.render('landing');
}

calcDistance = function (loc1, loc2) {
	return Math.sqrt(((loc1[0] - loc2[0])*(loc1[0] - loc2[0])) + ((loc1[1] - loc2[1])*(loc1[1] - loc2[1])))
}

exports.searchByLocation = function (data, socket) {
	console.log('Inside searchByLocation')
	console.log(data.loc, data.radius)
	var results = []
	ngoModel.find({}, function (err, docs) {
		for (var i in docs) {
			if (calcDistance(docs[i].coords, data.loc) < data.radius) {
				console.log(docs[i].name)
			}
		}
	})
}

exports.addNGO = function (data, socket) {
	console.log(data)
	for (var i in data){
		var ngo = new ngoModel(data[i])
		ngo.save()
	}
}