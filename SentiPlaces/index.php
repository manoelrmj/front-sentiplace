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
		<title>2 column Google maps, foursquare (outer scroll)</title>
		<meta name="generator" content="Bootply" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<!--[if lt IE 9]>
			<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href="css/styles.css" rel="stylesheet">	
				
	</head>
	<body onload="initMap()"> 
	<!--<body onload="findUserLocation()">--?
<!-- begin template -->
<div class="navbar navbar-custom navbar-fixed-top">
 <div class="navbar-header"><a class="navbar-brand">Enter a location</a></div>
    <div class="navbar-collapse collapse">
      <form class="navbar-form">
        <div class="form-group" style="display:inline;">
          <div class="input-group">
			<div class="row">
				<div class="col-sm-10 "> <input type="text" id="pac-input" class="controls form-control" placeholder="What are searching for?" style="width:500px" onclick="getSearchLocation()"></div></input>
			</div>
          </div>
        </div>
      </form>
    </div>
</div>

<div id="map-canvas"></div>
<div class="container-fluid" id="main">
	<div class="jumbotron"> <!-- deixa o conteudo texto responsivo -->
	  <div class="row">
		<div class="col-xs-6" id="left">
			<div class="text-center" style="background-color:#D8D8D8">
				<br><h2>FourSquare Reviews</h2></br>
				<br><h4 id="restaurants_name">Waiting for a restaurant...</h4></br>
			</div>
			<div class="row">
				<div class="col-xs-6" style="background-color:#85e085; height: 700px;">	
					<div style="background-color:#53c653;">
						<br><h4 style="color: white" class="text-center"><b>POSITIVE REVIEWS</b></h4></br>
					</div>
					<div style="background-color:rgba(255, 255, 255, 0.7); font-size:16px; height: 590px;overflow: auto;">
						<br><ul><div id="positive_reviews"></div><br>
					</div>
  
				</div>
				<div class="col-xs-6" style="background-color:#ff8080; height: 700px ">	
					<div style="background-color:#ff4d4d;">
						<br><h4 style="color: white" class="text-center"><b>NEGATIVE REVIEWS</b></h4></br>
					</div>
					<div style="background-color:rgba(255, 255, 255, 0.7); font-size:16px; height: 590px;overflow: auto;">
						<br><ul><div id="negative_reviews"></div></ul><br>
					</div>
				</div>
			</div>

		</div>
		<div class="col-xs-6"><!--map-canvas will be postioned here-->
			<div class="well">
				Filter by Radius:<br>
				<form action="" id="radius_option">
					<div class="col-xs-2"><input type="radio" id="radius" name="radius" value="2" checked="checked">2km</div>
					<div class="col-xs-2"><input type="radio" id="radius" name="radius" value="4">4km</div>
					<div class="col-xs-2"><input type="radio" id="radius" name="radius" value="8">8km<br></div>
					<div class="col-xs-2"><input type="radio" id="radius" name="radius" value="12">12km<br></div>
					<div class="col-xs-2"><input type="radio" id="radius" name="radius" value="20">20km<br></div>
					<div class="col-xs-2"><input type="radio" id="radius" name="radius" value="30">30km<br></div><br>
				</form>
			</div>			
			<div id="googleMap" class="img-responsive"></div>
		</div>
	  </div>
	</div>
</div>
<!-- end template -->
	<!-- script references -->
		<script src="http://maps.googleapis.com/maps/api/js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="http://maps.googleapis.com/maps/api/js?sensor=false&extension=.js&output=embed"></script>
		<script src="js/scripts.js"></script>
		<script src="js/populatingMap.js"></script>
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>

	</body>
</html>
