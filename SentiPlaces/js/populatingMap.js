function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {

	    // Check if the XMLHttpRequest object has a "withCredentials" property.
	    // "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined") {
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	return xhr;
}

function addingMarkers() {
	document.getElementById("tips_area").style.visibility="visible";
	
	// Declare and set location variables
	var myCenter = map.getCenter();
	var lat = myCenter.lat();
	var lng = myCenter.lng();
	var rdbRadius = document.getElementsByName("radius");	
	for(var i = 0; i < rdbRadius.length; i++)
		if(rdbRadius[i].checked) 
			radius = rdbRadius[i].value*1000; // Radius value must be sent to API in meters

	console.log("Lat: " + lat);
	console.log("Lng: " + lng);
	console.log("Radius: " + radius);

	// API Call handle
	var xhr = new XMLHttpRequest();
	var closestVenuesURL = ("http://150.164.11.206:8080/deliverable8s/rest/foursquare/closestvenues?lat=" + lat + 
		"&lng=" + lng + "&rd=" + radius);
	//console.log(closestVenuesURL);
	/*xhr.open("GET", closestVenuesURL, false);
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.send();
	console.log(xhr.status);
	console.log(xhr.statusText);

	var json_response = JSON.parse(xhr.responseText);
	console.log(json_response);*/
	var xhr = createCORSRequest('GET', closestVenuesURL);
	if (!xhr) {
		throw new Error('CORS not supported');
	}
	// This function parse the JSON response and put the places in the map
	xhr.onload = function() { 
		// process the response.
		var json_response = JSON.parse(xhr.responseText);
		var location = [];
		for (var i = 0; i < json_response.length; i++){
			//console.log(json_response[i].name);
			var aux_array = [json_response[i].name, json_response[i].location.lat, json_response[i].location.lng,
			 	json_response[i].polarityAux.positiveCount, json_response[i].polarityAux.negativeCount];
			location.push(aux_array);
		}

		var geocoder, i;
		var markerColor, markerOpacity;
		
	    // Loop through our array of markers & place each one on the map  
	    for (i = 0; i < location.length; i++) {
	        var position = new google.maps.LatLng(location[i][1], location[i][2]);
			var polarity = location[i][3] - location[i][4];
			
			markerColor = markersColors(polarity);
			markerOpacity = markersOpacity(polarity);
			
			var restaurantMarker = { // marker's icon
				path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
				fillColor: markerColor,
				fillOpacity: markerOpacity,
				scale: 0.16,
				strokeColor: "black",
				strokeWeight: 0.5
			};
			
			marker = new google.maps.Marker({
				position: position,
				icon: restaurantMarker,
				map: map,
				title: location[i][0]
			});

			markersInfoBox(i, location);
			getReviews();
	    }
	};
	xhr.onerror = function() {
		console.log('An error occurred while retrieving venues from server');
	};

	xhr.send();
		
	console.log("data received:");
	console.log(location);
}

function markersColors(polarity) { // polarity = location[i][3]
	var color = ["#900000", "#FF0000", "white", "#00FF00", "#009900"]; // strong red, red, white, green, strong green 
	if (polarity < 0) {
		if (polarity < -6) markerColor = color[0];
		else markerColor = color[1];
	}
	else if (polarity == 0) markerColor = color[2];
	else { //else if (polarity > 0)
		if (polarity > 6) markerColor = color[4];
		else markerColor = color[3];
	}
	return markerColor;
}

function markersOpacity(polarity) {
	var opacity = [0, 0.2, 0.4, 0.6, 0.8, 1];
	if (polarity <= -10 || polarity >= 10) markerOpacity = opacity[5];
	else if (polarity <= -8 || polarity >= 8) markerOpacity = opacity[4];
	else if (polarity <= -6 || polarity >= 6) markerOpacity = opacity[3];
	else if (polarity <= -4 || polarity >= 4) markerOpacity = opacity[2];
	else if (polarity <= -2 || polarity >= 2) markerOpacity = opacity[1];
	else if (polarity == 0) markerOpacity = opacity[5];
	return markerOpacity;	
}

function markersInfoBox(i, location) {
	infowindow = new google.maps.InfoWindow()
	google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				position = new google.maps.LatLng(location[i][1], location[i][2]);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': position}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							qtdReviews = location[i][3] + location[i][4];
							infowindow.setContent("<b><center>" + location[i][0] + "</b><br>" + results[1].formatted_address + "<br>Number of reviews: " + qtdReviews + "<br>+" + location[i][3] + " | -" + location[i][4]);
							infowindow.open(map, marker);
						}
					}
					document.getElementById("restaurants_name").innerHTML = location[i][0]; //adicionando o nome do restaurante ao HTML
					map.setCenter(position);
					map.setZoom(14);
				});
			}
			
      })(marker, i));
}

function removingMarkers() {
	
}

function choosingPlacesCategory() {
	var placeCategory = document.getElementById("category").value;
	console.log(placeCategory);
	document.getElementById("positive_reviews").innerHTML = ""; //limpa o campo de reviews positivos
	document.getElementById("negative_reviews").innerHTML = ""; //limpa o campo de reviews negativos
	addingMarkers(placeCategory);
}

function getReviews() {	
	google.maps.event.addListener(marker, 'click', (function(marker, i) {
		document.getElementById("positive_reviews").innerHTML = ""; //limpa o campo de reviews positivos
		document.getElementById("negative_reviews").innerHTML = ""; //limpa o campo de reviews negativos
		
		positiveReviews = [ "INICIO POSITIVO, DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE",
							"DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE",
							"DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "FIM POSITIVO"];
		negativeReviews = [ "INICIO NEGATIVO, DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE",
							"DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE",
							"DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE DADOS TESTE", "DADOS TESTE", "FIM NEGATIVO"];
		
		for (i = 0; i < positiveReviews.length; i++) {
			document.getElementById("positive_reviews").innerHTML += "<li>" + positiveReviews[i] + "</li>"; // adiciona os reviews positivos
		}
		for (i = 0; i < negativeReviews.length; i++) {
			document.getElementById("negative_reviews").innerHTML += "<li>" + negativeReviews[i] + "</li>"; // adiciona os reviews negativos
		}
	}));
}