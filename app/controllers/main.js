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

exports.initiative = function(req, res) {
	//find all the files linked to that user and pass them on to the template
	var req_scale = req.params.id
	ngoModel.find({scale : req_scale}, function (err, docs) {
		console.log(docs[0])
		res.render('initiative', {data : docs[0]})
	})

	// var req_scale = req.params.id
	// ngoModel.find({scale : req_scale}, function (err, docs) {
	// 	console.log(docs[0])
	// 	var collabs = []
	// 	for (var i in docs[0].inits) {
	// 		initiativeModel.find({name : docs[0].inits[i]}, function (err, docs2) {
	// 			for (var j in docs2[0].ngos) {
	// 				if (docs[0].name != docs2[0].ngos[j]) {
	// 					collabs.push(docs2[0].ngos[j])
	// 				}
	// 			}
	// 		})
	// 	}
	// 	docs[0]['collabs'] = collabs
	// 	console.log(docs[0])
	// 	res.render('initiative', {data : docs[0]})
	// })
}

calcDistance = function (loc1, loc2) {
	return Math.sqrt(((loc1[0] - loc2[0])*(loc1[0] - loc2[0])) + ((loc1[1] - loc2[1])*(loc1[1] - loc2[1])))
}

exports.getAllNgos = function (data, socket) {
	ngoModel.find({}, function (err, docs) {
		socket.emit('getAllNgosSuccess', {result : docs})
	})
}

exports.getAllInitiatives = function (data, socket) {
	initiativeModel.find({}, function (err, docs) {
		socket.emit('getAllInitiativesSuccess', {result : docs})
	})
}

exports.retrieveAll = function (data, socket) {
	var results = []
	ngoModel.find({}, function (err, docs) {
		for ( var i in docs) {
			results.push({body : docs[i], type : 'ngo'})
		}
		initiativeModel.find({}, function (err, docs2) {
			for ( var i in docs2 ) {
				results.push({body : docs2[i], type : 'initiative'})
			}
			socket.emit('retrieveAllSuccess', {result : results})
		})
	})
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
				results.push({body : docs[i], type : 'ngo'})
			}
		}
		initiativeModel.find({}, function (err, docs2) {
			for (var i in docs2) {
				var dist = calcDistance(docs2[i].coords, data.loc)
				if ( dist < data.radius) {
					console.log(docs2[i].name)
					results.push({body : docs2[i], type : 'initiative'})
				}
			}
			results.sort(function(a,b){
				return a.distance - b.distance
			})
			socket.emit('locationSearchSuccess', {result : results})
		})
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
				results.push({body : docs[i], type : 'ngo'})
			}
		}
		initiativeModel.find({}, function (err, docs2) {
			console.log(docs2)
			for (var i in docs2) {
				searchString = docs2[i].work.toString().split(',').join(' ').toString()
				if (searchString.indexOf(data.keyword) > -1) {
					console.log(docs2[i].name)
					results.push({body : docs2[i], type : 'initiative'})
				}
			}
			socket.emit('workSearchSuccess', {result : results})
		})
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
			if (docs[i].scale > lower && docs[i].scale < upper) {
				console.log(docs[i].name)
				results.push({body : docs[i], type : 'ngo'})
			}
		}
		initiativeModel.find({}, function (err, docs2) {
			for (var i in docs2) {
				if (docs2[i].scale > lower && docs2[i].scale < upper) {
					console.log(docs2[i].name)
					results.push({body : docs2[i], type : 'initiative'})
				}
			}
			socket.emit('scaleSearchSuccess', {result : results})
		})
	})
}

exports.addNGO = function (data, socket) {
	for (var i in fs.ngos){
		var ngo = new ngoModel(fs.ngos[i])
		ngo.save()
	}
	console.log('NGO objects saved')
}

exports.addInit = function (data, socket) {
	for (var i in fs.initiatives){
		console.log(fs.initiatives[i].work)
		var init = new initiativeModel(fs.initiatives[i])
		init.save()
	}
	console.log('Init objects saved')
}

exports.getNgoData = function (data, socket) {
	ngoModel.find({name : data.name}, function (err, docs) {
		socket.emit('getNgoDataSuccess', docs[0])
	})
}

exports.beingEdited = function (io) {
	return function (data, socket) {
		console.log(data.value)
		socket.broadcast.emit('greyOutField', {field : data.field, value : data.value})
	}
}

exports.finishedEditing = function (io) {
	return function (data, socket) {
		console.log(data.value)
		socket.broadcast.emit('editingCompleted', {field : data.field, value : data.value})
	}
}