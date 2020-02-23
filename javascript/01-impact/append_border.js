// Append a border around the regions:
function appendBorder(indianaData)
{
	// Region 1:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "1"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
	
	// Region 2:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "2"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
		
	// Region 3:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "3"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
				
	// Region 4:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "4"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
		
	// Region 5:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "5"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
	
	// Region 6:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "6"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
		
	// Region 7:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "7"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
			
	// Region 8:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "8"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");	
	
	// Region 9:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "9"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
		
	// Region 10:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "10"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
	
	// Region 11:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "11"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");
				
	// Region 12:
	mapGroup.append("path")
		.datum(topojson.merge(indianaData, indianaData.objects.cb_2015_indiana_county_20m.geometries.filter(function(d) { return d.properties.REGION_ID == "12"; })))
		.attr("class", "region")
		.attr("d", path)
		.attr("class", "region_border")
		.style("fill", "transparent");		

}