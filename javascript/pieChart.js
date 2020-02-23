var pie_svg;
var pie_slices;

var arcGenerator;
var arcOver;

function createPieChart(pieChartProperties)
{
	arcGenerator

	// Create the SVG:
	pie_svg = d3.select("#" + pieChartProperties.id)
	.append("svg")
	.attr("id", "pieSVG")
		.attr("viewBox", function(){
			return ("0 0 " + (pieChartProperties.width  + pieChartProperties.margin.left + pieChartProperties.margin.right).toString() + " " 
						   + (pieChartProperties.height + pieChartProperties.margin.top  + pieChartProperties.margin.bottom).toString());
		})
		.attr("width", "100%")
		.attr("height", "100%")
		.append("g")
			.attr("transform", "translate(" + pieChartProperties.width / 2 + "," + pieChartProperties.height / 2 + ")");

	// Compute the position of each group on the pie:
	var pie = d3.pie()
		.value(function(d) { return d.value[1]; })
	var pieData = pie(d3.entries(pieChartProperties.dataset))

	// shape helper to build arcs:
	arcGenerator = d3.arc()
		.innerRadius(0)
		.outerRadius(pieChartProperties.radius);

	arcOver = d3.arc()
		.innerRadius(0)
		.outerRadius(pieChartProperties.radius + 10);

	// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
	pie_slices = pie_svg.selectAll('pieSlices')
		.data(pieData)
	  	.enter()
	  	.append('path')
	    	.attr('d', arcGenerator)
			.attr("fill", function(d){
				return defualtCountyColor({region : d.data.value[0]});	// Pass the value as string
			})
	    	.attr("stroke", "black")
	    	.style("stroke-width", "2px")
	    	.style("opacity", 0.7)

	    .on('mouseover', function(d){           

			// Change color of bar on hover:
			d3.select(this).style("fill", hoverCountyColor({region : d.data.value[0]}));
			tooltip.transition()
			.duration(200)
			.style("opacity", 1.0)
			.style("width", function(){
					tooltipWidth = 150;
					return tooltipWidth + "px";
				});
				// Set the name to show on hover in the tooltip
				tooltip.html(
					"<strong>Region : " + d.data.value[0] + "</strong><br>" + 
					"<strong>" + pieChartProperties.tooltipData + " : " + d.data.value[1] + "</strong>"
					)
				.style("height", function(){
					tooltipHeight = pieChartProperties.tooltipHeight;
					return tooltipHeight;
				})
				.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
				.style("top", (d3.event.pageY + 20) + "px");
			})
		.on('mouseout', function(d){           

			// Reset color on hover out:
			d3.select(this).style("fill", defualtCountyColor({region : d.data.value[0]}));

			tooltip.transition()
			.duration(500)
			.style("opacity", 0)
		});

	// Add text (Looks ugly. Thus, commented out)
	var pie_text = pie_svg
	  .selectAll('pieSlices')
	  .data(pieData)
	  .enter()
	  .append('text')
	  .text(function(d){ return d3.format(".2s")(d.data.value[2] * 100) + "%" })
	  .attr("transform", function(d) { 
	  	var d_xy = arcGenerator.centroid(d);
        d_xy[0] *= 1.7;	//multiply by a constant factor
        d_xy[1] *= 1.7;	//multiply by a constant factor
        return "translate(" + d_xy + ")";
	  })
	  .style("text-anchor", "middle")
	  .style("font-size", "8px")

}

function pieOut(region_id)
{
	pie_svg.selectAll("path")
		.attr("d", function(d){
			// Move the pie out if the corresponding region is selected:
			if(region_id.toString() == d.data.value[0]){
				d3.select(this)
	               .transition()
	               .duration(100)
	               .attr("d", arcOver);
			}
			// Otherwise move it back in or keep in the same position:
			else{
				d3.select(this)
	               .transition()
	               .duration(100)
	               .attr("d", arcGenerator);
			}
		});
}
