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
		<title>SentiPlaces</title>
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
				<div class="col-xs-10"> <input type="text" id="pac-input" class="controls form-control" placeholder="What are searching for?" style="width:500px" onclick="getSearchLocation()"></div></input>
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
			<div style="background-color:#D8D8D8" class="col-xs-9 text-center"><h2>FourSquare Tips</h2></div>
			<div style="background-color:#D8D8D8" class="col-xs-3 id="right"> <img  height="63px" src="css/SentiPlaces.png"/> </div>
			<div class="row">
				<div class="col-xs-8" id="left">
					<br><h4 id="restaurants_name">Waiting for a place...</h4>
				</div>
				<div class="col-xs-4 form-group">
					<br>Choose a place category
					<select class="form-control" id="category">
						<option id="all_category">All places</option>
						<option id="food_category">Food</option>
						<option id="hotel_category">Hotel</option>
						<option id="bar_category">Pubs</option>
					</select>
				</div>
			</div>
			<div class="row" id="tips_area">
				<div style="background-color:#53c653;">
					<h4 style="color: white" class="text-center"><b>Positive Reviews</b></h4>
				</div>
				<div style="background-color:rgba(255, 255, 255, 0.7); font-size:16px; height: 335px;overflow: auto;">
					<br><ul><div id="positive_reviews"></div><br>
				</div>
				<div style="background-color:#ff4d4d;">
					<h4 style="color: white" class="text-center"><b>Negative Reviews</b></h4>
				</div>
				<div style="background-color:rgba(255, 255, 255, 0.7); font-size:16px; height: 335px;overflow: auto;">
					<br><ul><div id="negative_reviews"></div></ul><br>
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
