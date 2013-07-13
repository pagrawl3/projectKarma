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

	$('.description').keypress(function(){
		socket.emit('beingEdited', {field: 'description', value: $('.description').val()})
	})

	$('.description').blur(function(){
		socket.emit('finishedEditing', {field: 'description', value: $('.description').val()})
	})

	socket.on('greyOutField', function (data) {
		$('.description').val(data.value)
	})

	socket.on('editingCompleted', function (data) {

		$('.description').val(data.value)
	})

	$('.get-started').click(function(){
		alert(sessionStorage.getItem("username"))
	})
	$('.login-button').click(function() {
		var username = $('.username').val()
		var password = $('.password').val()
		sessionStorage.setItem("username",username)
		sessionStorage.setItem("password",password)
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

	initializeMapClickHandlers()

});

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

			function createNode(name, location, work, type) {
				return	'<article class="result '+type+'">'+
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
						'</article>';
			}
			for (var i in data) {
				console.log(data[i])
				if (data[i].type == 'ngo') {
					var node = createNode(data[i].body.name, data[i].body.location, data[i].body.work, 'NGO');
					$('section.search-results .results').append(node);
				}
				else {
					var node = createNode(data[i].body.name, data[i].body.location, data[i].body.work, 'INIT');
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























