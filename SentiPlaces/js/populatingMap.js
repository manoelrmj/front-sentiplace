var restaurantMarker = [];
var placeMarker;
var placeCategory;
var category_aux;

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
		xhr.open(method, url, false);
	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	return xhr;
}

function addingMarkers() {
	document.getElementById("loading").style.visibility="visible";
	for (var i = 0; i < restaurantMarker.length; i++) {
    	restaurantMarker[i].setMap(null);
  	}
	restaurantMarker = [];

	// Declare and set location variables
	//var myCenter = map.getCenter();
	var lat = myCenter.lat();
	var lng = myCenter.lng();

	// API Call handle
	var xhr = new XMLHttpRequest();
	var closestVenuesURL;
	var category = document.getElementById("category");
	var selectedCategory = category.options[category.selectedIndex].value;
	
	if(selectedCategory == 0) 
		closestVenuesURL = ("http://200.131.6.130:8085/sentiplaces/rest/foursquare/closestvenues?lat=" + lat + 
			"&lng=" + lng + "&rd=" + myRadius);
	else 
		closestVenuesURL = ("http://200.131.6.130:8085/sentiplaces/rest/foursquare/closestvenues?lat=" + lat + 
			"&lng=" + lng + "&rd=" + myRadius + "&ctg=" + selectedCategory);
	//console.log(closestVenuesURL);
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
			var aux_array = [json_response[i].id, json_response[i].name, json_response[i].location.lat, json_response[i].location.lng,
			 	json_response[i].polarityAux.positiveCount, json_response[i].polarityAux.negativeCount];
			location.push(aux_array);
		}
		//console.log(location.length);
		var geocoder, i;
		var markerColor, markerOpacity;
		var position, polarity;
		
	    // Loop through our array of markers & place each one on the map  
	    for (i = 0; i < location.length; i++) {
	      position = new google.maps.LatLng(location[i][2], location[i][3]);
				polarity = location[i][4] - location[i][5];
			
				markerColor = markersColors(polarity);
				markerOpacity = markersOpacity(polarity);
			
					// star placeMarker
					placeIcon = { // placeMarker's icon
					path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
					fillColor: markerColor,
					fillOpacity: markerOpacity,
					scale: 0.12,
					strokeColor: "black",
					strokeWeight: 0.5
				};
				placeMarker = new google.maps.Marker({
					position: position,
					icon: placeIcon,
					title: location[i][1]
				});
				restaurantMarker.push(placeMarker);
				restaurantMarker[i].setMap(map);

				markersInfoBox(i, location, xhr);	
	    }
		document.getElementById("loading").style.visibility="hidden";
	};
	xhr.onerror = function() {
		console.log('An error occurred while retrieving venues from server');
		document.getElementById("loading").style.visibility="hidden";
	};
	xhr.send();
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

function markersInfoBox(i, location, xhr) {
	infowindowPlace = new google.maps.InfoWindow()
	google.maps.event.addListener(placeMarker, 'click', (function(placeMarker, i) {
			return function() {
				infowindowLocation.close();		
				position = new google.maps.LatLng(location[i][2], location[i][3]);
				geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': position}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						if (results[1]) {
							qtdReviews = location[i][4] + location[i][5];
							infowindowPlace.setContent("<b><center>" + location[i][1] + "</b><br>" + results[1].formatted_address + "<br>Number of reviews: " + qtdReviews + "<br>" + location[i][4] + "+ | " + location[i][5] + "-");
							infowindowPlace.open(map, placeMarker);
						}
					}
					document.getElementById("restaurants_name").innerHTML = location[i][1]; //adicionando o nome do restaurante ao HTML
					map.setCenter(position);
					map.setZoom(myZoom);
					getReviews(location[i], xhr);
				});
			}
			
      })(placeMarker, i));
}

function choosingPlacesCategory() {
	placeCategory = document.getElementById("category").value;
	if (placeCategory != category_aux) {
		document.getElementById("tips_area").style.display="none";
		document.getElementById("restaurants_name").innerHTML ="Waiting for a place...";
		document.getElementById("home_introduction").style.display="inline";
		addingMarkers(placeCategory);
	}
	category_aux = placeCategory;
}

function tipsColors(score) { //polary range: [-1, 1]
	var total = 96;
	var positive_width = total/2;
	var negative_width = total/2;
	var diff = Math.abs((total/2)*score);
	if(score > 0){
		positive_width += diff;
		negative_width -= diff;
	}else if(score < 0){
		negative_width += diff;
		positive_width -= diff;
	}
	return "<div style=\"background-color:red; width: "+negative_width+"px; height:12px; display: inline-block; float:right; opacity: 0.5\"></div>"+
			"<div style=\"background-color:green; width: "+positive_width+"px; height:12px; display: inline-block;float:right; opacity: 0.5\"></div>";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function getReviews(location, xhr) {	
	document.getElementById("tips_area").style.display="inline";
	document.getElementById("home_introduction").style.display="none";
	document.getElementById("positive_reviews").innerHTML = "";
	document.getElementById("negative_reviews").innerHTML = "";
	var tipsByVenueURL = ("http://200.131.6.130:8085/sentiplaces/rest/foursquare/tipsbyvenue/" + location[0]);
	xhr.open("GET", tipsByVenueURL, true);
	
	// This function parse the JSON response and put the tips in the text fields
	xhr.onload = function() { 
		// process the response.
		var i;
		document.getElementById("positive_reviews").innerHTML = ""; //limpa o campo de reviews positivos
		document.getElementById("negative_reviews").innerHTML = ""; //limpa o campo de reviews negativos
		var json_response = JSON.parse(xhr.responseText);
		//console.log(xhr.responseText);
		var positiveReviews = [];
		var negativeReviews = [];
		for(i=0; i<json_response.length; i++){
			var review = [];
			if(json_response[i].polarity == 1){
				review.push(json_response[i].text);
				review.push(json_response[i].polarityScore);
				positiveReviews.push(review);
			}
			else if(json_response[i].polarity == -1){
				review.push(json_response[i].text);
				review.push(json_response[i].polarityScore);
				negativeReviews.push(review);
			}
		}
		for (i = 0; i < positiveReviews.length; i++) {
			document.getElementById("positive_reviews").innerHTML += "<li><i>" + positiveReviews[i][0] + "</i></li>" +tipsColors(positiveReviews[i][1]) + " <hr>";
		}
		for (i = 0; i < negativeReviews.length; i++) {
			document.getElementById("negative_reviews").innerHTML += "<li><i>" + negativeReviews[i][0] + "</i></li>" +tipsColors(negativeReviews[i][1]) + " <hr>";
		}

	};
	xhr.onerror = function() {
		console.log('An error occurred while retrieving venues from server');
	};

	xhr.send();
}
