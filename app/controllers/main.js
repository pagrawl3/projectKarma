//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	ngoModel	= mongoose.model('ngo'),
	initiativeModel = mongoose.model('initiatives'),
	fs = require('../../config/data.json')
	// mock_data = JSON.parse(fs)

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
			var dist = calcDistance(docs[i].coords, data.loc)
			if ( dist < data.radius) {
				console.log(docs[i].name)
				results.push({ngo : docs[i], distance : dist})
			}
		}
		results.sort(function(a,b){
			return a.distance - b.distance
		})
		socket.emit('locationSearchSuccess', {result : results})
	})
}

exports.searchByWork = function (data, socket) {
	console.log('Inside searchByWork', data)
	var results = []
	ngoModel.find({}, function (err, docs) {
		for (var i in docs) {
			console.log(docs[i].work.toString())
			var searchString = docs[i].work.toString().split(',').join(' ').toString()
			if (searchString.indexOf(data.keyword) > -1) {
				console.log(docs[i].name)
				results.push(docs[i])
			}
		}
		socket.emit('workSearchSuccess', {result : results})
	})
}

exports.searchByScale = function (data, socket) {
	console.log('Inside searchByScale')
	console.log(data.scale)
	var lower  = eval(data.scale) - 250,
		upper  = eval(data.scale) + 250,
		results = []
	ngoModel.find({}, function (err, docs) {
		for (var i in docs) {
			console.log(docs[i].scale, lower, upper)
			if (docs[i].scale > lower && docs[i].scale < upper) {
				console.log(docs[i].name)
				results.push(docs[i])
			}
		}
		socket.emit('scaleSearchSuccess', {result : results})
	})
}

exports.addNGO = function (data, socket) {
	for (var i in fs.ngos){
		var ngo = new ngoModel(fs.ngos[i])
		ngo.save()
	}
	console.log('NGO objects saved')
}