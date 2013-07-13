/******DATABASE FILE********/

//Dependencies
var mongoose 		= require('mongoose')

//File Schema
var initiativeSchema = new mongoose.Schema({
	//schema here
})

//Publish the model to be used in other files and storage etc.
mongoose.model ('initiatives', initiativeSchema);