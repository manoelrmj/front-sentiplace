<!DOCTYPE html>
<?php
	// Endpoint data
	$server = "150.164.11.206"; // pinkbird
	$port = "8080";
	$api_path = "deliverable8s/rest/foursquare";
?>
<html lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<title>Sentiplace</title>
		<meta name="generator" content="Bootply" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href="css/styles.css" rel="stylesheet">
    
		<script src="http://maps.googleapis.com/maps/api/js"></script>

		<script>
		function initialize() {
			myCenter = new google.maps.LatLng(37.375987,-121.914412);

			var mapProp = {
				center:myCenter,
				zoom:13,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);

			// adicionando markers de acordo com latitude/longitude do myCenter
			var marker=new google.maps.Marker({position:myCenter,});
			marker.setMap(map);

			/*
			//These points are in Australia, they won't appear in the map when the page loads. :p
			var beaches = [
			  ['Bondi Beach', -33.890542, 151.274856, 4],
			  ['Coogee Beach', -33.923036, 151.259052, 5],
			  ['Cronulla Beach', -34.028249, 151.157507, 3],
			  ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
			  ['Maroubra Beach', -33.950198, 151.259302, 1]
			];
			for (var i = 0; i < beaches.length; i++) {
				var beach = beaches[i];
				var marker = new google.maps.Marker({
			      position: {lat: beach[1], lng: beach[2]},
			      map: map,
			      title: beach[0],
			      zIndex: beach[3]
			    });
			 }*/
		
			// criando circulo de raio 2km em relacao ao myCenter
			var myCity = new google.maps.Circle({
				center:myCenter,
				radius:2000,
				strokeColor:"#0000FF",
				strokeOpacity:0.2,
				strokeWeight:2,
				fillColor:"#0000FF",
				fillOpacity:0.1
			});
			myCity.setMap(map);

			// zoom no myCenter quando clica no marker
			google.maps.event.addListener(marker,'click',function() {
  			map.setZoom(13);
  			map.setCenter(marker.getPosition());
  		});

			// infobox com o nome do restaurante, qtdd de negativos e qtdd de positivos
			var infowindow = new google.maps.InfoWindow({content:"Restaurant's name: P=10 | N=5"});
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
		 	});
		}
		google.maps.event.addDomListener(window, 'load', initialize);
		</script>

	</head>
	<body>
<!-- begin template -->
<div class="navbar navbar-custom navbar-fixed-top">
 <div class="navbar-header"><a class="navbar-brand" href="#">Enter a location</a>
    </div>
    <div class="navbar-collapse collapse">
      <form class="navbar-form">
        <div class="form-group" style="display:inline;">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="What are searching for?">
          </div>
        </div>
      </form>
    </div>
</div>

<div class="container-fluid" id="main">
  <div class="row">
  	<div class="col-xs-5" id="left">
    
    	<h2>FourSquare Reviews</h2>
      		<?php
      			// Get parameters from URL
				$parameters = parse_url($_SERVER['REQUEST_URI']);
				if(isset($parameters['query']))
					parse_str($parameters['query'], $query);
				if(isset($query['lat']))
					$lat = $query['lat'];	
				if(isset($query['lng']))
					$lng = $query['lng'];
				if(isset($query['radius']))
					$radius = $query['radius'];

				// If not received via URL, set variables for test purposes
      			if(!isset($lat) && !isset($lng) && !isset($radius)){
      				// LG HQ
      				$lat = "37.375987";
	      			$lng = "-121.914412";
	      			$radius = 1000;	
      			}      			

      			$endpoint = "http://" . $server . ":" . $port . "/" . $api_path. "/closestvenues?lat=" . 
      				$lat . "&lng=" . $lng . "&rd=" . $radius;
      			$decoded_response = json_decode(file_get_contents($endpoint));
				// TODO: Call tips API
				foreach ($decoded_response as $venue) {
					echo "<br><h4>" . $venue->name . "</h4>
					Distance: " . $venue->location->distance . " m<br> 
					<b>Positive Reviews</b> <br>
					<i>\" - Good food!\"</i> <br>
					<b>Negative Reviews</b> <br>
					<i>\" - Bad beer!\"</i> <br>";
				}
      		?>
    </div>
    <div class="col-xs-4"> <!--map-canvas will be postioned here-->
    	<div id="googleMap" style="width:730px;height:600px;"></div>
	</div>
</div>
<!-- end template -->

	<!-- script references -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="http://maps.googleapis.com/maps/api/js?sensor=false&extension=.js&output=embed"></script>
		<script src="js/scripts.js"></script>
	</body>
</html>
