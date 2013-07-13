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
<<<<<<< HEAD
  // google.maps.event.addDomListener(window, 'load', initialize);
  console.log('here');
=======
  //google.maps.event.addDomListener(window, 'load', initialize);
>>>>>>> b2fe270965019be56bd242a3a75ce75c0f1597e6
}

function codeAddress() {
	var geocoder = new google.maps.Geocoder();
	var address = document.getElementById("address").value;
    var loc=[];
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        loc[0]=results[0].geometry.location.lat();
        loc[1]=results[0].geometry.location.lng();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
      display(loc);
    });
}

function display(loc) {
	alert(loc);
}