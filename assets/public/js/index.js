$(document).ready(function () {

	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	//Establish a socket conenction with the server for future stuff
	var socket = io.connect('/');
	socket.emit('test',{success: true});
	socket.on('testCallback', function(data) {
		console.log('client side test successful');
		console.log(data);
	});

	loadScript();

	
	// socket.emit('createNgo', {})

	socket.emit('searchByLocation', {loc : [37.61, 55.75], radius : 250000/3959})
	socket.on('locationSearchSuccess', function(data) {
		console.log(data)
	})

});