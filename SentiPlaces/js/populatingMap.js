var restaurantMarker;
var place_marker;// = new Array();

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
	document.getElementById("loading").style.visibility="visible";
	//place_marker.setMap(null);
	// Declare and set location variables
	var myCenter = map.getCenter();
	var lat = myCenter.lat();
	var lng = myCenter.lng();
	/*var rdbRadius = document.getElementsByName("radius");	
	for(var i = 0; i < rdbRadius.length; i++)
		if(rdbRadius[i].checked) 
			radius = rdbRadius[i].value*1000; // Radius value must be sent to API in meters*/

	//console.log("Lat: " + lat);
	//console.log("Lng: " + lng);
	//console.log("Radius: " + radius);

	// API Call handle
	var xhr = new XMLHttpRequest();
	var closestVenuesURL = ("http://150.164.11.206:8080/deliverable8s/rest/foursquare/closestvenues?lat=" + lat + 
		"&lng=" + lng + "&rd=" + myRadius); // var closestVenuesURL = ("http://150.164.11.206:8080/deliverable8s/rest/foursquare/closestvenues?lat=" + lat + "&lng=" + lng + "&rd=" + radius);
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
			var aux_array = [json_response[i].id, json_response[i].name, json_response[i].location.lat, json_response[i].location.lng,
			 	json_response[i].polarityAux.positiveCount, json_response[i].polarityAux.negativeCount];
			location.push(aux_array);
		}

		var geocoder, i;
		var markerColor, markerOpacity;
		/*for (i=0;i<place_marker.length;i++) {
			console.log(place_marker[i]);
			place_marker[i].setMap(null);
		}*/
		
	    // Loop through our array of markers & place each one on the map  
	    for (i = 0; i < location.length; i++) {
	        var position = new google.maps.LatLng(location[i][2], location[i][3]);
			var polarity = location[i][4] - location[i][5];
			
			markerColor = markersColors(polarity);
			markerOpacity = markersOpacity(polarity);
			
			// star marker
			restaurantMarker = { // marker's icon
				//path: google.maps.SymbolPath.CIRCLE,
				path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
				fillColor: markerColor,
				fillOpacity: markerOpacity,
				scale: 0.12,
				strokeColor: "black",
				strokeWeight: 0.5
			};
			place_marker = new google.maps.Marker({
				position: position,
				icon: restaurantMarker,
				map: map,
				title: location[i][1]
			});

			/*
			// circle marker
			place_marker=new google.maps.Marker({
				position:position,
				icon: {path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: markerColor, fillOpacity: markerOpacity, strokeWeight: 1}
			});
			place_marker.setMap(map);*/				

			markersInfoBox(i, location);
			//getReviews();
			
	    }
		document.getElementById("loading").style.visibility="hidden";
	};
	xhr.onerror = function() {
		console.log('An error occurred while retrieving venues from server');
		document.getElementById("loading").style.visibility="hidden";
	};
	xhr.send();
	//console.log("data received:");
	//console.log(location);
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
	google.maps.event.addListener(place_marker, 'click', (function(place_marker, i) {
			return function() {
				position = new google.maps.LatLng(location[i][2], location[i][3]);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': position}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							qtdReviews = location[i][4] + location[i][5];
							infowindow.setContent("<b><center>" + location[i][1] + "</b><br>" + results[1].formatted_address + "<br>Number of reviews: " + qtdReviews + "<br>" + location[i][4] + "+ | " + location[i][5] + "-");
							infowindow.open(map, place_marker);
						}
					}
					document.getElementById("restaurants_name").innerHTML = location[i][1]; //adicionando o nome do restaurante ao HTML
					map.setCenter(position);
					map.setZoom(myZoom);
					getReviews(location[i]);
				});
			}
			
      })(place_marker, i));
}

function removingMarkers() {
	
}

function choosingPlacesCategory() {
	var placeCategory = document.getElementById("category").value;
	//console.log(placeCategory);
	document.getElementById("positive_reviews").innerHTML = ""; //limpa o campo de reviews positivos
	document.getElementById("negative_reviews").innerHTML = ""; //limpa o campo de reviews negativos
	addingMarkers(placeCategory);
}

function tipsColors(polarity) { //polary range: [-4, 4]
	var total = 8*12;
	var width = (polarity+4)*12;
	var positive_width = width;
	var negative_width = total - positive_width;
	console.log("Positive: " + positive_width + "Negative: " + negative_width);
	return "<div style=\"background-color:red; width: "+negative_width+"px; height:12px; display: inline-block; float:right; opacity: 0.5\"></div>"+
			"<div style=\"background-color:#53c653; width: "+positive_width+"px; height:12px; display: inline-block;float:right; opacity: 0.5\"></div>";
}

function getReviews(location) {	
	document.getElementById("tips_area").style.display="inline";
	document.getElementById("home_introduction").style.display="none";
	var xhr = new XMLHttpRequest();
	var tipsByVenueURL = ("http://150.164.11.206:8080/deliverable8s/rest/foursquare/tipsbyvenue?venueid=" + location[0]);
	console.log(tipsByVenueURL);
	var xhr = createCORSRequest('GET', tipsByVenueURL);
	if (!xhr) {
		throw new Error('CORS not supported');
	}
	// This function parse the JSON response and put the tips in the text fields
	xhr.onload = function() { 
		// process the response.
		var i;
		document.getElementById("positive_reviews").innerHTML = ""; //limpa o campo de reviews positivos
		document.getElementById("negative_reviews").innerHTML = ""; //limpa o campo de reviews negativos
		//var json_response = JSON.parse(xhr.responseText);
		var json_response = JSON.parse('[{"id":"4d72d42d0d0ca1436106b083","text":"2 for $20!!! Haha","polarity":1},{"id":"4c7728aef2473704cb7c65eb","text":"Hottest waitresses ever!","polarity":0},{"id":"4eb88cd3e5fa17fc88199ed9","text":"correction: Cjay is known as Chris at Applebee\u0027s.","polarity":0},{"id":"4eb888625c5c5a53215815a1","text":"Make sure you request Cjay or Saif for servers. Funny, polite, attentive, and accurate. Tip \u0027em nicely, say that Dan sent you!","polarity":1},{"id":"4f558f7de4b0131bc37729d6","text":"The real Rihanna is a waitress here!! She\u0027s soooo hottttttt!!!","polarity":0},{"id":"4fe2816ae4b03b7a3de9708a","text":"Amanda is the best waitress ever! Tip her big :)","polarity":1},{"id":"4f5d0ff5e4b068aa4fddbec3","text":"The service here SUCKS","polarity":0},{"id":"4ed962b729c2b91227349b4b","text":"If you don\u0027t speak Ebonics don\u0027t bother to come here!","polarity":0},{"id":"4dc0c2f2b0fb1c18ee549763","text":"This place is the best after 10pm","polarity":1},{"id":"4d2bd15c3c7954819bfbeb9b","text":"This is the best dish!!","polarity":1},{"id":"55370639498e95c4a5e0d326","text":"This place really went down hill.  Was there today had a steak that was horrible. Manager was nice though brought me another one, but still was bad. The quality of their food really went down","polarity":-1},{"id":"522e7503498e08302c3f5076","text":"Food below average, service stink. Just  don\u0027t go.","polarity":0},{"id":"51c3c0d1498e32a301f9abd2","text":"Get here after 10; you know the deal","polarity":0},{"id":"51ac037f498ebb2eff392da7","text":"They were singing a bday song for me ) it was so loud tho and made my face red hahaha","polarity":1},{"id":"516211d3498efb317dfa226d","text":"The most water down Long Island Ice Tea! Horrible!!!!","polarity":0},{"id":"503964f6e4b0bce917240bc8","text":"The service is sooooo slow. They take there sweet ass time for everything. My grandmother who has one leg moves faster then most of the people here.","polarity":0},{"id":"50396306e4b09ecf9ed5daf7","text":"Def. should check out the guy who works there and combs his beard in plain view lol what ?","polarity":0},{"id":"4f9752a5e4b0dda0643da379","text":"I go here just for the Triple Chocolate Meltdown. Nothing else :)","polarity":1},{"id":"4f807eabe4b0ac16a1cd22ae","text":"This is probably the first time here that I don\u0027t like my waiter.","polarity":0},{"id":"4f7e120ce4b0bd0c008281bd","text":"Service sucks!!","polarity":0},{"id":"4f78eac1e4b087957c131dc8","text":"Their curbside service is the worst!!!","polarity":-1},{"id":"4f5b04a6e4b03a6a1110c6f1","text":"Jasmine the waitress is sexy as all hell.. She\u0027s the only waitress I\u0027d ever want in life","polarity":1},{"id":"4e6d55882271a8cabfc57a5f","text":"25 cent wing nite","polarity":0}]');
		//console.log((json_response));
		var positiveReviews = [];
		var negativeReviews = [];
		for(i=0; i<json_response.length; i++){
			if(json_response[i].polarity == 1)
				positiveReviews.push(json_response[i].text);
			else if(json_response[i].polarity == -1){
				negativeReviews.push(json_response[i].text);
			}
		}

		for (i = 0; i < positiveReviews.length; i++) {
			document.getElementById("positive_reviews").innerHTML += "<li><i>" + positiveReviews[i] + "</i>" + tipsColors(2) + "</li><hr>"; // usando valor de teste
			// document.getElementById("positive_reviews").innerHTML += "<li><i>" + positiveReviews[i] + "</i>" + tipsColors(json_response[i].polarity) + "</li><hr>";
		}
		for (i = 0; i < negativeReviews.length; i++) {
			document.getElementById("negative_reviews").innerHTML += "<li><i>" + negativeReviews[i] + "</i>" + tipsColors(-2) + "</li><hr>"; // usando valor de teste
			// document.getElementById("negative_reviews").innerHTML += "<li><i>" + negativeReviews[i] + "</i>" + tipsColors(json_response[i].polarity) + "</li><hr>";
		}

	};
	xhr.onerror = function() {
		console.log('An error occurred while retrieving venues from server');
	};

	xhr.send();	

	/*google.maps.event.addListener(marker, 'click', (function(marker, i) {
		//console.log(marker);
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
	}));*/
}