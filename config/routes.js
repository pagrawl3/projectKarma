//#######__MODULE DEPENDENCIES__#########
var sock 		= require('./socketLayer')

module.exports = function(app, io) {

	//__IMPORT ALL THE CONTROLLERS
	var	main 			= require('../app/controllers/main')
	//more can come here
	app.get('/initiative', main.initiative);
	app.get('/ngo/:id', main.ngo);
 	//__FINALLY IF THERE IS NO KNOWN URL INCL. '/' THEN GO TO HOME
 	app.get('/*', main.landing);

 	sock.get('test', function(data, socket) {
 		console.log('message on server received');
 		console.log(data);
 		socket.emit('testCallback', {success:true});
 	}, io);

 	sock.get('createNgo', main.addNGO, io)
 	sock.get('createInit', main.addInit, io)
 	sock.get('searchByLocation', main.searchByLocation, io)
 	sock.get('searchByWork', main.searchByWork, io)
 	sock.get('searchByScale', main.searchByScale, io)
 	sock.get('retrieveAll', main.retrieveAll, io)
 	sock.get('beingEdited', main.beingEdited(io), io)
 	sock.get('finishedEditing', main.finishedEditing(io), io)
 	sock.get('createNewTask', main.createNewTask, io)
 	sock.get('createNewInitiative', main.createNewInitiative, io)
 	sock.get('clientSendingInvitation', main.clientSendingInvite, io)
 	sock.get('reqClicked', main.reqClicked(io), io)
 	sock.get('getTasks', main.getTasks(io), io)
}

