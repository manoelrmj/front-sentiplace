function addingMarkers() {
	document.getElementById("tips_area").style.visibility="visible";
	var myCenter = map.getCenter();
	//var lat = console.log(myCenter.lat());
	//var lng = console.log(myCenter.lng());	
	
	var location = [ // restaurant's name | lat | lng | qtdReviewsPos | qtdReviewsNeg
		['Restaurant 1', -31.387, 150.651, 20, 30],
		['Restaurant 2', -31.385, 150.652, 22, 30],
		['Restaurant 3', -31.382, 150.653, 24, 30],
		['Restaurant 4', -31.380, 150.654, 26, 30],
		['Restaurant 5', -31.387, 150.664, 28, 30],
		['Restaurant 6', -31.388, 150.651, 30, 30],
		['Restaurant 7', -31.379, 150.652, 32, 30],
		['Restaurant 8', -31.380, 150.643, 34, 30],
		['Restaurant 9', -31.383, 150.654, 36, 30],
		['Restaurant 10', -31.381, 150.664, 38, 30],
		['Restaurant 11', -31.386, 150.664, 40, 30]
    ];
	
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