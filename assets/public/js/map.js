//var main = require('../../../app/controllers/main.js');

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDc4bUWerMbRWFK6oldh4vUBS2tiTyL5W8&sensor=true&callback=initialize";
  document.body.appendChild(script);
}

function initialize() {
  console.log("Calling initialize for maps")
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  console.log('here');
}

function codeLoc(place) {
	var geocoder = new google.maps.Geocoder();
  var thisloc=[];
  geocoder.geocode( { 'address': place}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        thisloc[0]=results[0].geometry.location.lat();
        thisloc[1]=results[0].geometry.location.lng();
        var socket = io.connect('/');
        socket.emit('searchByLocation', {loc : thisloc})
       // main.searchByLocation(loc);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
     // display(loc);
    });
}

function codeScale(scale) {
  
}

function codeWork(work) {
  
}

function findType(typeVal) {

  if(typeVal.type == "loc") {
      codeLoc(typeVal.value);
  }
  else if(typeVal.type == "scale") {
      codeScale(parseInt(typeVal.value));
  }
  else {
      codeWork(typeVal.value);
  }

}

function display(loc) {
	alert(loc);
}