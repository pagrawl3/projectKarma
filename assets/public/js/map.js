//var main = require('../../../app/controllers/main.js');

var icons;

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDc4bUWerMbRWFK6oldh4vUBS2tiTyL5W8&sensor=true&callback=initialize";
  document.body.appendChild(script);
}

function initialize() {
  console.log("Calling initialize for maps")
  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(25, 30),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var iconStar = new google.maps.MarkerImage("../img/icons/iconmonstr-location-16-icon.svg",
                  null, 
                  null,
                 null,
                 new google.maps.Size(50, 50));
  var iconStarTwo = new google.maps.MarkerImage("../img/icons/iconmonstr-location-17-icon.svg",
                  null, 
                  null,
                 null,
                 new google.maps.Size(50, 50));
   var pt = new google.maps.LatLng(-34.397, 150.644);
   var marker = new google.maps.Marker({
                position: pt,
              // icon: "../img/icons/iconmonstr-location-16-icon.svg",
                map: map
            });
   marker.setIcon(iconStarTwo);
  console.log('here');
}

function codeLoc(place) {
	var geocoder = new google.maps.Geocoder();
  var thisloc=[];
  geocoder.geocode( { 'address': place}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        thisloc[1]=results[0].geometry.location.lat();
        thisloc[0]=results[0].geometry.location.lng();
        var socket = io.connect('/');
        console.log(thisloc)
        socket.emit('searchByLocation', {loc : thisloc, radius : 50000/3959})
        socket.on('locationSearchSuccess', function(data) {
              for (var i in data.result) {
                // console.log(data);
                console.log(data.result[i].type);
              }
        })
       // main.searchByLocation(loc);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
     // display(loc);
    });
}

function codeScale(thisScale) {
  var socket = io.connect('/');
  socket.emit('searchByScale', {scale : thisScale})
}

function codeWork(thisWork) {
  var socket = io.connect('/');
  socket.emit('searchByWork', {work : thisWork})
}

function findType(typeVal) {
  console.log('here');
  console.log(typeVal);
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