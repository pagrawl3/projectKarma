$(document).ready(function () {

	//JSLint told me to put for some ECMAScript5 optimizations
	"use strict";

	//Establish a socket conenction with the server for future stuff
	var socket = io.connect('/');
	socket.emit('test',{success: true});
	socket.on('testCallback', function(data) {
		console.log('client side test successful');
	});
	loadScript();

	$('#desc').on('keyup', function(){
		socket.emit('beingEdited', {field: '#desc', value: $('#desc').val()})
	});

	$('#name').on('keyup', function(){
		socket.emit('beingEdited', {field: '#name', value: $('#name').val()})
	});

	$('#req').on('keyup', function(){
		socket.emit('beingEdited', {field: '#req', value: $('#req').val()})
	});

	$('#deadline').on('change', function(){
		socket.emit('beingEdited', {field: '#deadline', value: $('#deadline').val()})
	});


	$('.description').blur(function(){
		socket.emit('finishedEditing', {field: 'description', value: $('.description').val()})
	})

	socket.emit('getTasks', {scale: 2120})

	socket.on('getTasksSuccess', function (data) {
		console.log(data.length);
		var average = 500/data.length;
		console.log(average);
		$('ul.tasks').empty();
		data.sort(function(a,b){
 		 a = new Date(a.deadline);
 		 b = new Date(b.deadline);
  		return a<b?-1:a>b?1:0;
		});
		for (var j in data) {
			var top = (average);
			console.log("TOP " + top);
			var myDate = new Date(Date.parse(data[j].deadline))
			var tasks = "<li class='task' style='top: "+top+"px;'> <span class='date'>"+myDate.getDate() + '/' +  myDate.getMonth()+ '/' + myDate.getFullYear() + "</span> <span class='entypo-cd icon'></span> <span class='text'>"+data[j].name+"</span></li>";
			$('ul.tasks').append(tasks);
		}
	})

	socket.on('greyOutField', function (data) {
		console.log(data.field);
		$(data.field).val(data.value)
		$(data.field).text(data.value)
	})

	socket.on('editingCompleted', function (data) {
		console.log("THIS IS DATA FIELD " + data.field);
		// if(data.field[0] == '#') {
			// data.field.text(data.value);
			//$('#random').removeAttr('random');
		// }
		// else {
		$('.description').val(data.value)
	});

	socket.on('blah', function (data) {
		registerClick();
	})

	$('.get-started').click(function(){
		alert(sessionStorage.getItem("username"))
	})
	$('.login-button').click(function() {
		var username = $('.username').val()
		var password = $('.password').val()
		sessionStorage.setItem("username",username)
		sessionStorage.setItem("password",password)
		$('nav.header-nav').css('opacity', '0');
		$('nav.header-create').css('display', 'inline-block');
		window.setTimeout(function(){
			$('nav.header-nav').css('display', 'none');
			$('nav.header-create').css('opacity', '1');
		}, 200);
	})
	// socket.emit('createNgo', {})

	// socket.emit('createInit', {})

	// socket.emit('searchByLocation', {loc : [37.61, 55.75], radius : 250000/3959})
	// socket.on('locationSearchSuccess', function(data) {
	// 	console.log(data)
	// })

	// socket.emit('searchByWork', {keyword : "Nutrition"})
	// socket.on('workSearchSuccess', function(data){
	// 	console.log(data)
	// })

	// socket.emit('searchByScale', {scale : '1234'})
	// socket.on('scaleSearchSuccess', function (data) {
	// 	console.log(data)
	// })

	initializeFormClickHandlers(socket)
	initializeMapClickHandlers()

	functionForLogin()

});

var provIndex =0;

function functionForLogin() {
	if (sessionStorage.getItem('username')) {
		$('nav.header-nav').css('display', 'none');
		$('nav.header-create').css('opacity', '1');
		$('nav.header-create').css('display', 'inline-block');
	}
}

function registerClick() {
	var val = $('#req').val();
	$('.table .column.ten.status').append('<div class="row main entypo-check icon selected tick"></div>');
	$('.table .column.forty.name').append('<div class="row main">'+val+'</div>');
	$('.table .column.forty.providers').append('<div class="row main" id="prov'+provIndex+'"><em>none</em></div>');
	$('.table .column.ten.actions').append('<div class="row main entypo-thumbs-up icon thumbs"></div>');
	provIndex++;
}

function initializeFormClickHandlers(socket) {
	console.log('here');
	$('span.entypo-plus-circled.icon').on('click', function(e) {
		console.log('click registered');
		socket.emit('reqClicked', {success : true})
		registerClick();
	});
	$(document).on('click', '.thumbs', function(e) {
		console.log("WE ARE GETTING CLICKED HEHE");
		//$(this).parents('.table').find('.providers .main').attr('id', 'random');
		$(this).parents('.table').find('.providers .main').text(sessionStorage.getItem("username"));
		console.log($(this).parents('.table').find('.providers .main').attr('id'));
		var id = '#'+$(this).parents('.table').find('.providers .main').attr('id');
		socket.emit('beingEdited', {field : id, value : sessionStorage.getItem("username")})
		//.val(sessionStorage.getItem("username"));
	})
	$("form.create-task").submit(function(e) {
        e.preventDefault();
        var obj = {}
        obj.name = $('form.create-task #name').val();
        obj.desc = $('form.create-task #desc').val();
        obj.req = [];
       	var req = {};
        $('form.create-task .table .column.forty.name .row.main').each(function(i, e){
        	console.log(i);
        	req.name = $(e).text();
        	obj.req.push (req);
        });
        $('form.create-task .table .column.forty.providers .row.main').each(function(i, e){
        	obj.req[i].providers = [$(e).text()];
        });
        obj.deadline = $('form.create-task #deadline').val();
        console.log(obj);
        socket.emit('createNewTask', {task : obj, scale: 2120});
        socket.on('createNewTaskSuccessful',function(data){
        	socket.emit('getTasks', {scale : 2120});
        	console.log(data);
        });
        return false
    });
}

function initializeMapClickHandlers() {
	var prev = 0;
	$("#scale-slider").slider({ animate: 'fast', min: 0, max: 5000, step: 500, slide: function(event, ui) {
		var value = ui.value;
		$('span.scale-slider').text(value);
	}});
	$('button.filter').on('click', function(e){
		if (!$(this).hasClass('selected')) {
			$('.selected').removeClass('selected');
			$(this).addClass('selected');
			if (!$(this).hasClass('text')) {
				$('input.search').css('opacity',0);
				window.setTimeout(function(){
					$('input.search').css('display', 'none');
					$('.scale-slider').css('display', 'block');
					$('.scale-slider').css('opacity', '1');
				}, 200);
			}
			else {
				$('.scale-slider').css('opacity',0);
				window.setTimeout(function(){
					$('.scale-slider').css('display', 'none');
					$('input.search').css('display', 'inline-block');
					$('input.search').css('opacity', '1');
				}, 200);
			}
		}
	});
	var done = false;
	$('button.submit').on('click', function(e){
		$('section.search-results .results').empty();
		if (!done) {
			var leftO = ($('section.map-overlay').offset().left) - 50;
			$('section.map-overlay').css('left', '-'+leftO + 'px');
			done = true;
		}
		var data = {};
		data.type = $('.selected').attr('id');
		if ($('.selected').hasClass('text'))
			data.value = $('input.search').val();
		else
			data.value = $('span.scale-slider').text();
		console.log(data);
		findType(data, function(data){

			function createNode(name, location, work, type, scale) {
				return	'<a href="/ngo/'+scale+'"><article class="result '+type+'">'+
							'<div class="result-logo">'+type+'</div>'+
							'<header class="result-title">'+
								name+
							'</header>'+
							'<span class="string">'+
								'<span class="entypo-location"></span> &nbsp'+
								location + ' &nbsp; &nbsp;'+
								'<span class="entypo-flag"></span>'+
								work.toString()+
							'</span>'+
						'</article></a>';
			}
			for (var i in data) {
				console.log(data[i])
				if (data[i].type == 'ngo') {
					var node = createNode(data[i].body.name, data[i].body.location, data[i].body.work, 'NGO', data[i].body.scale);
					$('section.search-results .results').append(node);
				}
				else {
					var node = createNode(data[i].body.name, data[i].body.location, data[i].body.work, 'INIT', data[i].body.scale);
					$('section.search-results .results').append(node);
				}
			}
			console.log(data);


			$('section.search-results').css('display', 'block');
			$('#search-title').css('display', 'inline-block');
			window.setTimeout(function(){
				$('section.search-results').css('padding', '30px');
				$('section.search-results').css('margin', '20px 0');
				$('section.search-results').css('height', 'auto');
			}, 200);
			window.setTimeout(function(){
				$('section.search-results').css('opacity', '1');
				$('#search-title').css('opacity', '1');
			}, 400);
		});
	});
}























