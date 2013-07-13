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

	var newNgo = [
		{
			scale : '220',
			coords : [151.206,-33.867],
			location : 'Sydney, NSW',
			name : 'World Care Centre Inc',
			inits : [],
			reqs : [],
			resources : [],
			desc : '',
			email : ''
		},
		{
			scale : '1300',
			coords : [77.224, 28.6],
			location : 'New Delhi, India',
			name : 'Animal Defence League',
			inits : [],
			reqs : [],
			resources : [],
			desc : '',
			email : ''	
		},
		{
			scale : '1350',
			coords : [-122.236, 37.48],
			location : 'Red Wood City, California',
			name : 'Environmental Health Network',
			inits : [],
			reqs : [],
			resources : [],
			desc : '',
			email : ''
		},
		{
			scale : '2100',
			coords : [2.3522, 48.85],
			location : 'Paris, France',
			name : 'Gorilla Foundation',
			inits : [],
			reqs : [],
			resources : [],
			desc : '',
			email : ''
		},
		{
			scale : '765',
			coords : [18.42, -33.92],
			location : 'Cape Town, South Africa',
			name : 'Leap Now',
			inits : [],
			reqs : [],
			resources : [],
			desc : '',
			email : ''
		},
		{
			scale : '1570',
			coords : [37.61, 55.75],
			location : 'Moscow, Russia',
			name : 'Project Coyote',
			inits : [],
			reqs : [],
			resources : [],
			desc : '',
			email : ''
		}
	]
	socket.emit('createNgo', newNgo)

});