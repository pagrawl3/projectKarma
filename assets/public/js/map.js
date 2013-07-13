//var main = require('../../../app/controllers/main.js');
var iconStar;
var iconStarTwo;
var infowindow;
var markersArray = [];

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDc4bUWerMbRWFK6oldh4vUBS2tiTyL5W8&sensor=true&callback=initialize";
  document.body.appendChild(script);
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

function initialize() {
  console.log("Calling initialize for maps")
  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(50, -45),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  iconStar = new google.maps.MarkerImage("../img/icons/iconmonstr-location-16-icon.svg",
                  null, 
                  null,
                 null,
                 new google.maps.Size(50, 50));
  iconStarTwo = new google.maps.MarkerImage("../img/icons/iconmonstr-location-17-icon.svg",
                  null, 
                  null,
                 null,
                 new google.maps.Size(50, 50));

  infowindow = new google.maps.InfoWindow();

   /*var pt = new google.maps.LatLng(-34.397, 150.644);
   var marker = new google.maps.Marker({
                position: pt,
              // icon: "../img/icons/iconmonstr-location-16-icon.svg",
                map: map
            });
   marker.setIcon(iconStarTwo);*/
  console.log('Initialized Google Maps API');
  putAllMarkers();
}

function addMarker(coords, type, name) {
  var pt = new google.maps.LatLng(coords[1], coords[0]);
  var marker = new google.maps.Marker ({
    position: pt,
    map: map,
    title : name
});
  console.log(name);

  if(type == "ngo") {
  marker.setIcon(iconStar);
  }
  else {
    marker.setIcon(iconStarTwo);
  }
  markersArray.push(marker);
   google.maps.event.addListener(marker, 'click', function() {
    var contentString = '<h3 style="font-family:lato;font-weight:300">' + name + '</h3';
    infowindow.setContent(contentString);
    infowindow.open(map,marker);
  });
  console.log("Marker added");
}

function putAllMarkers() {
  clearOverlays();
var socket = io.connect('/');
console.log("In putallmarksers");
socket.emit('retrieveAll', {loc : 0})
socket.on('retrieveAllSuccess', function (data) {
  for (var i in data.result) {
    console.log(data.result[i].body.coords);
    console.log(data.result[i].type);
    addMarker(data.result[i].body.coords, data.result[i].type, data.result[i].body.name);
  }
})
}

function codeLoc(place, callback) {
	var geocoder = new google.maps.Geocoder();
  var thisloc=[];
  geocoder.geocode( { 'address': place}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        thisloc[1]=results[0].geometry.location.lat();
        thisloc[0]=results[0].geometry.location.lng();
        var socket = io.connect('/');
        console.log(thisloc)
        socket.emit('searchByLocation', {loc : thisloc, radius : 50000/3959})
        socket.on('locationSearchSuccess', function (data) {
              clearOverlays();
              for (var i in data.result) {
                addMarker(data.result[i].body.coords, data.result[i].type, data.result[i].body.name);
                console.log(data.result[i].type);
              }
              callback(data.result);
        })
       // main.searchByLocation(loc);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
     // display(loc);
    });
}

function codeScale(thisScale, callback) {
  var socket = io.connect('/');
  socket.emit('searchByScale', {scale : thisScale})
  socket.on('scaleSearchSuccess', function (data) {
   clearOverlays();
   for (var i in data.result) {
      addMarker(data.result[i].body.coords, data.result[i].type, data.result[i].body.name);
   }
   console.log(data);
   callback(data.result);
   })
}

function codeWork(thisWork, callback) {
  var socket = io.connect('/');
  socket.emit('searchByWork', {keyword : thisWork})
  socket.on('workSearchSuccess', function (data){
    clearOverlays();
    console.log(data);
    for (var i in data.result) {
    addMarker(data.result[i].body.coords, data.result[i].type, data.result[i].body.name);
  }
    callback(data.result)
   })
}

function findType(typeVal, callback) {
  console.log('here');
  console.log(typeVal);
  if(typeVal.type == "loc") {
      codeLoc(typeVal.value, callback);
  }
  else if(typeVal.type == "scale") {
      codeScale(parseInt(typeVal.value), callback);
  }
  else {
      codeWork(typeVal.value, callback);
  }

}

function display(loc) {
	alert(loc);
}