/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var initiativeSchema = new mongoose.Schema({
	//schema here
	name : String,
	scale : Number,
	work : [String], 
	desc : String, 
	coords : [Number, Number],
	location : String,
	ngos : [String],
	tasks : [{
		name : String,
		desc : String,
		deadline : Date,
		progress : Number,
		reqs : [{
			provider : String,
			amount : String
		}]
	}]
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('initiatives', initiativeSchema);