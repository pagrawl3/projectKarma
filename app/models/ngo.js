/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var ngoSchema = new mongoose.Schema({
	//schema here
	scale : String, 
	coords : [Number, Number],
	location : String,
	name : String,
	inits : [{type : mongoose.Schema.Types.ObjectId, ref: 'initiatives'}],
	reqs : [String],
	resources : [String],
	desc : String,
	email : String
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('ngo', ngoSchema);