//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	ngoModel	= mongoose.model('ngo'),
	initiativeModel = mongoose.model('initiatives')

exports.landing = function(req, res) {
	//find all the files linked to that user and pass them on to the template
	res.render('landing');
}