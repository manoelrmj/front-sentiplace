var myCity;
var map;
var myRadius;
var marker;
var myZoom;

$(document).ready(function() {
	 $('#ex1').slider({
		formatter: function(radius) {
			document.getElementById("radius").innerHTML = radius;
			myRadius = radius * 1000;
	        return 'Current value: ' + radius + ' km';
	    }
	});
});

function initMap() { // inicializando um objeto mapa
	document.getElementById("tips_area").style.display="none";
	myRadius = 1000;
	var myCenter = new google.maps.LatLng(-19.8714019,-43.9703503);  // UFMG Campus
	myZoom = 15;
	map = new google.maps.Map(document.getElementById('googleMap'), {
		center: myCenter,
		zoom: myZoom	
	});
	myCity = new google.maps.Circle({center:myCenter});
	place_marker = new google.maps.Marker({
		position: new google.maps.LatLng(0,0),
		map: map,
	});
	updateMap(map, true);
	
	$("#category").click(function() { choosingPlacesCategory(); });
}

function updateMap(map, first) {
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	var pos, marker;
	//var myZoom = 14;
	var myCity;
	//removingMarkers();	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {lat: position.coords.latitude,
				   lng: position.coords.longitude};

			map.setCenter(pos);
			myCenter = new google.maps.LatLng(pos);
		
			updateUsersPosition(map, 1); // detectLocation = 1 : para criar o toolbox escrito "You are here"
		
			// criando circulo de raio 2km em relacao ao myCenter
			$("#radius_option").click(function() { updateCircleRadius(map, myCenter); });	
			if (first == true) updateCircleRadius(map, myCenter); // cria o circulo default, de 2km		
			//addingMarkers();

		}, function() {
			//handleLocationError(true, infoWindow, map.getCenter());
			handleLocationError();
		});
	}	
}

function handleLocationError(){
	window.alert("We weren't able to determine your location. Please, check your browser settings.");
	myCenter = new google.maps.LatLng(-19.8714019,-43.9703503);  // UFMG Campus
}

function updateCircleRadius(map, myCenter) {
	if (myRadius == 4000) map.setZoom(14);
	else if (myRadius == 7000) map.setZoom(13);
	else if (myRadius > 7000) map.setZoom(12);
	else map.setZoom(15);
	removingCircles();
	addingMarkers(); //
	/*var rads = document.getElementsByName("radius");
	for(var i = 0; i < rads.length; i++){
		if(rads[i].checked) {
			myRadius = rads[i].value;
		}
	} 
	myRadius = myRadius * 1000;*/
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

function removingCircles() {
	myCity.setMap(null);
}

function updateMarkerPosition() {
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	// adicionando markers de acordo com latitude/longitude do myCenter
	marker=new google.maps.Marker({position:myCenter, icon: {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 9,
		fillColor: "blue",
		fillOpacity: 1,
        strokeWeight: 1
    }});
	marker.setMap(map);	
}

function updateUsersPosition(map, detectLocation) {
	document.getElementById("tips_area").style.display="none";
	document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
	document.getElementById("home_introduction").style.display="inline";
	var myCenter = map.getCenter();
	//var myZoom = map.getZoom();	

	updateMarkerPosition();
	
	// zoom no myCenter quando clica no marker	
	google.maps.event.addListener(marker,'click',function() {
		map.setZoom(myZoom);
		map.setCenter(marker.getPosition());
	});
	
	if (detectLocation == 1) { // detectLocation = 1 : para criar o toolbox escrito "You are here"
		var infowindow = new google.maps.InfoWindow();
		infowindow.setContent('You are here');
		
		var geocoder = geocoder = new google.maps.Geocoder();
		geocoder.geocode({'latLng': marker.getPosition() }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					infowindow.setContent("<center>You are here<br>" + results[1].formatted_address);
				}
			}
		});
		
		infowindow.open(map, marker);		
		google.maps.event.addListener(marker, 'click', function() { 
			infowindow.open(map,marker);
			map.setCenter(myCenter);
		});
	}
}

function updateLocation(option, autocomplete) {

	
	var infowindow = new google.maps.InfoWindow();
	infowindow.close();
	
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
	marker.setPlace(/** @type {!google.maps.Place} */ ({
		placeId: place.place_id,
		location: place.geometry.location
	}));

	infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + '<br>' + place.formatted_address + '</div>');
	infowindow.open(map, marker);
		
	myCenter = place.geometry.location;
	//console.log(myCenter.lat());
	//console.log(myCenter.lng());
	updateCircleRadius(map, myCenter);	
	
	$("#radius_option").click(function() { updateCircleRadius(map, myCenter) });
	
	updateMarkerPosition(map);
	
	google.maps.event.addListener(marker,'click',function() {
		map.setZoom(myZoom);
		map.setCenter(place.geometry.location);
		//infowindow.open(map, marker);
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
		updateLocation(1, autocomplete);
	});
	updateLocation(0, autocomplete);
}