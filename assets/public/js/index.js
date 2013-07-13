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
		findType(data);
	});
}
