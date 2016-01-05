var myCity;
var map;
var myRadius;
var locationMarker;
var myZoom;
var infoWindowLocation;
var infoWindowPlace;

$("#radius_option").click(function() { updateCircleRadius(map, myCenter) });
$("#category").click(function() { choosingPlacesCategory(); });

$(document).ready(function() {
	 $('#radius_slider').slider({
		formatter: function(radius) {
			document.getElementById("radius").innerHTML = "Filter by Radius: " + radius;
			myRadius = radius * 1000;
	        return 'Current value: ' + radius + ' km';
	    }
	});
});

function initMap() { // inicializando um objeto mapa
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	document.getElementById("slider_bar").style.visibility="hidden";
	
	myRadius = 1000;
	var myCenter = new google.maps.LatLng(38.8833,-98.0167);  // US lat and lng
	myZoom = 4;
	map = new google.maps.Map(document.getElementById('googleMap'), {
		center: myCenter,
		zoom: myZoom	
	});
	myCity = new google.maps.Circle({center:myCenter});
	updateMap(map, true);
}

function updateMap(map, first) {
	var pos, myCity;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {lat: position.coords.latitude,
				   lng: position.coords.longitude};

			map.setCenter(pos);
			myCenter = new google.maps.LatLng(pos);
		
			updateUsersPosition(map, 1); // detectLocation = 1 : para criar o toolbox escrito "You are here"
			updateCircleRadius(map, myCenter); // cria o circulo default, de 1km	
		}, function() {
			handleLocationError();
		});
	}	
}

function handleLocationError(){
	window.alert("We weren't able to determine your location. Please, check your browser settings.");
	myCenter = new google.maps.LatLng(38.8833,-98.0167);  // UFMG Campus
	document.getElementById("loading").style.visibility="hidden";
}

function updateCircleRadius(map, myCenter) {
	document.getElementById("slider_bar").style.visibility="visible";		
	if (myRadius == 4000) myZoom = 13;
	else if (myRadius == 7000) myZoom = 13;
	else if (myRadius > 7000) myZoom = 12;
	else myZoom = 15;
	map.setZoom(myZoom);
	
	myCity.setMap(null); // remove the circle to update with the new radius
	addingMarkers(); //

	myCity = new google.maps.Circle({
		center:myCenter,
		radius:myRadius+200,
		strokeColor:"#0000FF",
		strokeOpacity:0.2,
		strokeWeight:2,
		fillColor:"#0000FF",
		fillOpacity:0.1
	});
	myCity.setMap(map);
	map.setCenter(myCenter);
}

function updateMarkerPosition() {
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	// adicionando markers de acordo com latitude/longitude do myCenter
	locationMarker=new google.maps.Marker({position:myCenter, icon: {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 9,
		fillColor: "blue",
		fillOpacity: 1,
        strokeWeight: 1
    }});
	locationMarker.setMap(map);	
}

function updateUsersPosition(map, detectLocation) {
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	var myCenter = map.getCenter();

	updateMarkerPosition();
	
	// zoom no myCenter quando clica no marker	
	google.maps.event.addListener(locationMarker,'click',function() {
		map.setZoom(myZoom);
		map.setCenter(locationMarker.getPosition());
		infowindowLocation.open(map,locationMarker);
	});
	
	if (detectLocation == 1) { // detectLocation = 1 : para criar o toolbox escrito "You are here"
		infowindowLocation = new google.maps.InfoWindow();
		
		var geocoder = geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng': locationMarker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					infowindowLocation.setContent("<center>You are here<br>" + results[1].formatted_address);
				}
			}
		});
		
		infowindowLocation.open(map, locationMarker);		
		google.maps.event.addListener(locationMarker, 'click', function() {
			infowindowPlace.close(); 
			infowindowLocation.open(map,locationMarker);
			map.setCenter(myCenter);
		});
	}
}

function updateLocation(autocomplete) {
	infowindowLocation = new google.maps.InfoWindow();
	infowindowLocation.close();
	
	var place = autocomplete.getPlace();
	if (!place.geometry) { return; }
		
	map = new google.maps.Map(document.getElementById('googleMap')); // preciso recriar o mapa para atualizar a localizacao
		
	updateMarkerPosition();

	if (place.geometry.viewport) {
		map.fitBounds(place.geometry.viewport);
		map.setCenter(place.geometry.location);
		map.setZoom(myZoom);
	} else {
		  map.setCenter(place.geometry.location);
		  map.setZoom(myZoom);
	}
	
	// Set the position of the marker using the place ID and location.
	locationMarker.setPlace(/** @type {!google.maps.Place} */ ({
		placeId: place.place_id,
		location: place.geometry.location
	}));

	infowindowLocation.setContent('<div><strong>' + place.name + '</strong><br>' + '<br>' + place.formatted_address + '</div>');
	infowindowLocation.open(map, locationMarker);
		
	myCenter = place.geometry.location;
	updateCircleRadius(map, myCenter);	
	
	updateMarkerPosition(map);
	
	google.maps.event.addListener(locationMarker,'click',function() {
		map.setZoom(myZoom);
		map.setCenter(place.geometry.location);
		infowindowPlace.close();
		infowindowLocation.open(map, locationMarker);
	});
	
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	
	addingMarkers();	
}

function getSearchLocation() {
	var input = /** @type {HTMLInputElement} */(
    document.getElementById('pac-input'));

	// Create the autocomplete helper, and associate it with an HTML text input box.
	var autocomplete = new google.maps.places.Autocomplete(input);
	
	$('#pac-input').keypress(function(e) { // aceitar enter para realizar a busca
		if (e.which == 13) {
			google.maps.event.trigger(autocomplete, 'place_changed');
    		return false;
		}
	});
	
	// Get the full place details when the user selects a place from the list of suggestions.
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		updateLocation(autocomplete);
	});
}
