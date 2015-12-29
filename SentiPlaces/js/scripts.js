var myCity;
var map;
var myRadius;
var marker;

function initMap() { // inicializando um objeto mapa
	myRadius = 2000;
	var myCenter = new google.maps.LatLng(-31.383, 150.664);
	var myZoom = 13;
	map = new google.maps.Map(document.getElementById('googleMap'), {
		center: myCenter,
		zoom: myZoom	
	});
	myCity = new google.maps.Circle({center:myCenter});
	updateMap(map, true);
	//updateCircleRadius(map, myCenter);
	addingMarkers();
}

function updateMap(map, first) {
	var pos, marker;
	var myRadius = 2000;
	var myZoom = 13;
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

		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	}
}

function updateCircleRadius(map, myCenter) {
	removingCircles();
	var rads = document.getElementsByName("radius");
	for(var i = 0; i < rads.length; i++){
		if(rads[i].checked) {
			myRadius = rads[i].value;
		}
	} 
	myRadius = myRadius * 1000;
	myCity = new google.maps.Circle({
		center:myCenter,
		radius:myRadius,
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
	var myCenter = map.getCenter();
	var myZoom = map.getZoom();	

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
	var myRadius = 2000; // valor default
	var myZoom = 13; // valor default
	
	if (option == 0) {
		var rads = document.getElementsByName("radius");
		for(var i = 0; i < rads.length; i++){
			if(rads[i].checked) {
				console.log(rads[i].value);
				myRadius = rads[i].value;
			}
		} 
	}
	 
	var infowindow = new google.maps.InfoWindow();
	//infowindow.close();
	
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
	console.log(myCenter.lat());
	console.log(myCenter.lng());
	updateCircleRadius(map, myCenter);	
	
	$("#radius_option").click(function() { updateCircleRadius(map, myCenter) });
	
	updateMarkerPosition(map);
	
	google.maps.event.addListener(marker,'click',function() {
		map.setZoom(myZoom);
		map.setCenter(place.geometry.location);
		//infowindow.open(map, marker);
	});
	
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