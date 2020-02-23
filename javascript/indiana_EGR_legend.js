// Add the legend at the end:
var regionLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];			
var regionColor  = ["#A1D06C", "#D0A7C7", "#16BEB9", "#FBE662", 
				   	"#F89D53", "#077AC4", "#DF4674", "#51C9EB", 
				   	"#01A163", "#FB746E", "#985DA2", "#F0F4F7" ];    						// All 12 colors	
// Compute the legend for the map:

function createIndianaEGRLegend(mapProperties)
{
	var legend = mapProperties.SVG.append("g")
						.attr("transform", "translate(" + (mapProperties.width -20 ) + "," + 
														  (mapProperties.height - 750) + ")" + "rotate(-6)");

	regionLabels.forEach(function(regionLabels, i){
		var legendRow = legend.append("g")
		.attr("transform", "translate(0, " + (i * 20) + ")");

	    // Append the rectangle for the color of the legend:
	    legendRow.append("rect")
	    .attr("width", 10)
	    .attr("height", 10)
	    .attr("fill", regionColor[i])
	    .attr("stroke", "black");

	    // Append the text:
	    legendRow.append("text")
	    .attr("x", 20)
	    .attr("y", 10)
	    .attr("text-anchor", "start")
	    .style("text-transform", "capitalize")
	    .text("Region " + regionLabels);

	});	
}


function createBarGraph92CountiesLegend(barGraphProperties)
{
	var legend = barGraphProperties.SVG.append("g")
						.attr("transform", "translate(" + (barGraphProperties.width / 4 - 50 ) + "," + 
														  (barGraphProperties.height / 6 - barGraphProperties.height / 4) + ")");

	regionLabels.forEach(function(regionLabels, i){
		var legendRow = legend.append("g")
		.attr("transform", "translate(" + ((i) * (75)) + "," + 0 + ")");

	    // Append the rectangle for the color of the legend:
	    legendRow.append("rect")
	    .attr("width", 7)
	    .attr("height", 7)
	    .attr("fill", regionColor[i])
	   	.attr("stroke", "black");


	    // Append the text:
	    legendRow.append("text")
	    .attr("x", 10)
	    .attr("y", 8)
	    .attr("text-anchor", "start")
	    .attr("font-size", "12px")
	    .style("text-transform", "capitalize")
	    .text("Region " + regionLabels);

	});
}

