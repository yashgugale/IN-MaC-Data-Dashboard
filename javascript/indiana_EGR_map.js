// Create the map visualization:
function createIndianaEGRMap(mapProperties, barReferences)
{
	// Add an SVG to draw the map on::  
	var mapSVG = d3.select("#map_viz")
		.append("svg")
	    	.attr("viewBox", function(){
	    		return ("0 0 " + (mapProperties.width  + mapProperties.mapMargin.left + mapProperties.mapMargin.right).toString() + " " 
	    					   + (mapProperties.height + mapProperties.mapMargin.top  + mapProperties.mapMargin.bottom).toString());
	    	})
	    	.attr("width", "100%")
	    	.attr("height", "100%")
	    	.attr("class", "element_boundary")
	        .append("g")
	        .attr("transform", "rotate(6)");

	// Create a d3 projection:
	var projection = d3.geoAlbersUsa()
		.scale(11000)
		.translate([-1150, 640]);

	// Use the projects for the path:
	var path = d3.geoPath()
		.projection(projection);

	// Append all the counties:
	var mapCounties = mapSVG.append("g")
			.attr("class", "counties")					// Add the counties class attribute
			.selectAll("path")
				.data(topojson.feature(mapProperties.indianaData, mapProperties.indianaData.objects.cb_2015_indiana_county_20m).features)
				.enter()
				.append("path")
					.attr("d", path)
					.style("fill", defualtCountyColor)			// Set default colors to the counties at initiation
					.attr("id", function(d){ return d.properties.NAME;})

				// Change the color on mouse hover and show the county name on the top:
				.on("mouseover", function(d)
				{
					tooltip.transition()
					.duration(200)
					.style("opacity", 0.9)
					.style("height", "35px");
					// Set the name to show on hover in the tooltip
					tooltip.html(
						"<strong>" + d.properties.NAME 		+ "</strong><br>Region : " + 
						"<strong>" + d.properties.REGION_ID + "</strong>")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");

					// Select the current path and change its color:
					if(d.properties.NAME != mapProperties.county_selected)
						d3.select(this).style("fill", hoverCountyColor);
				})

			// Reset the county color to default on hovering out:
			.on("mouseout", function(d){
				tooltip.transition()
				.duration(500)
				.style("opacity", 0)

				// Select the current path and reset its color:
				if(d.properties.NAME != mapProperties.county_selected)
					d3.select(this).style("fill", defualtCountyColor);

			})

			// Show microgrant data on mouse click:
			.on("click", function(d){
				// Reset the old county to the default settings:
				if(mapProperties.county_selected != null)
				{
					d3.select("#" + mapProperties.county_selected)
					.style("fill", defualtCountyColor)
					.style("stroke-width", "0.5px");
				}

				// Select the new county clicked on and then set it's color to be red to indicate selection and also
				// increase the width of the boundary:
				d3.select("#" + d.properties.NAME)
				.style("fill", "red")
				.style("stroke-width", "3.0px");
				mapProperties.county_selected = d.properties.NAME;
				updateFields(d.properties.NAME, d.properties.REGION_ID);

			});

	// Add text to show all the county names:
	var mapText = mapSVG.selectAll("text")
		.data(topojson.feature(mapProperties.indianaData, mapProperties.indianaData.objects.cb_2015_indiana_county_20m).features)
		.enter()
		.append("text")
			.attr("transform", function(d){ return "translate(" + path.centroid(d) + ") rotate(-6)"; })
			.style("fill", "black")
			.attr("font-family", "sans-serif")
			.attr("text-anchor", "middle")
			.attr("font-size", "9px")
			.text(function(d){ return d.properties.NAME; })

		// Increase the font-size on mouseover:
		.on("mouseover", function(d){
			d3.select(this)
			.attr("font-weight", "bold")
			.attr("font-size", "15px")
		})

		// Make the font-size normal on mouseout:
		.on("mouseout", function(d){
			d3.select(this)
			.attr("font-weight", "normal")
			.attr("font-size", "9px")
		});


	var mapReferences = {
		width : mapProperties.width,
		height : mapProperties.height,
		mapMargin : mapProperties.mapMargin,
		county_selected : mapProperties.county_selected,
		SVG : mapSVG,
		projection : projection,
		path : path,
		mapCounties : mapCounties,
		mapText : mapText,
	}

	return mapReferences;

}