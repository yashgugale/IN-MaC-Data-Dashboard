// Create a bar graph:
function createBarGraph(barGraphProperties)
{
	// Create the SVG:
	var bar_svg = d3.select("#" + barGraphProperties.id)
	.append("svg")
	.attr("id", function(d){
		if(barGraphProperties.id == "bar_graph_county_viz")
			return "countySVG";
		if(barGraphProperties.id == "bar_graph_all_92_viz")
			return "all92CountiesSVG";
	})
		.attr("viewBox", function(){
			return ("0 0 " + (barGraphProperties.width  + barGraphProperties.margin.left + barGraphProperties.margin.right).toString() + " " 
						   + (barGraphProperties.height + barGraphProperties.margin.top  + barGraphProperties.margin.bottom).toString());
		})
		.attr("width", "100%")
		.attr("height", "100%")
		.append("g")
			.attr("transform", "translate(" + barGraphProperties.margin.left + "," + barGraphProperties.margin.top + ")");


	// Create the scales:
	var xScale = d3.scaleBand()							
		.rangeRound([0, barGraphProperties.width ])
		.paddingInner(0.05);

	var yScale = d3.scaleLinear()									
		.range([barGraphProperties.height - barGraphProperties.chartPadding , 0]);

	var heightScale = d3.scaleLinear()							
		.range([0, barGraphProperties.height - barGraphProperties.chartPadding]);


	// Create the axis groups:
	var x_axis_group = bar_svg.append("g")						
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + (barGraphProperties.height - barGraphProperties.chartPadding) + ")");

	var y_axis_group = bar_svg.append("g")
		.attr("class", "yAxis")
		.attr("transform", "translate(-10,0)");


	// X and Y axis labels:
	var xLabel = bar_svg.append("text")
		.attr("y", barGraphProperties.height + 26)
		.attr("x", (barGraphProperties.width) - 40)
		.attr("font-size", "14px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle")
		.text(barGraphProperties.xLabel);

	var yLabel = bar_svg.append("text")
		.attr("y", -15)
		.attr("x", barGraphProperties.xLabelPadding)
		.attr("font-size", "14px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle")
		// .attr("transform", "rotate(-90)")
		.text(barGraphProperties.yLabel);

	var bar_texts_group = bar_svg.append("g");

	graphReferences = {
		SVG : bar_svg,
		xScale : xScale,
		yScale : yScale,
		heightScale : heightScale,
		xAxis : x_axis_group,
		yAxis : y_axis_group,
		xLabel : xLabel,
		yLabel : yLabel,
		dataset : barGraphProperties.dataset,
		barPadding : barGraphProperties.barPadding,
		barTextsGroup : bar_texts_group,
		width : barGraphProperties.width,
		height : barGraphProperties.height,
		heightPadding : barGraphProperties.heightPadding,
		fontSize : barGraphProperties.fontSize,
	}

	// Draw a static bar graph:
	if(barGraphProperties.updatable == false)
		drawStaticBarGraph(graphReferences);

	return graphReferences;

}

function drawStaticBarGraph(graphReferences)
{
	var bar_rects;

	// Set the county names as the X Axis domain:
	graphReferences.xScale.domain(graphReferences.dataset.map(function(d) { return d[0]; }));
	graphReferences.yScale.domain([0, d3.max(graphReferences.dataset, function(d) { return d[1]; }) + graphReferences.heightPadding]);
	graphReferences.heightScale.domain([0, d3.max(graphReferences.dataset, function(d) { return d[1]; }) + graphReferences.heightPadding]);

	// Create the X and the Y axes:
	var xAxisCall = d3.axisBottom()
		.scale(graphReferences.xScale);

	var yAxisCall = d3.axisLeft()
		.scale(graphReferences.yScale);

	// Create/Update the axes:
	graphReferences.xAxis.call(xAxisCall)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -10)
		.attr("transform", "rotate(-45)")
		.style("text-anchor", "end");

	graphReferences.yAxis.call(yAxisCall);

	// Create the bar graph:
	bar_rects = graphReferences.SVG.selectAll("." + graphReferences.class)
		.data(graphReferences.dataset)
		.enter()
		.append("rect")
		.attr("class", graphReferences.class)
		.attr("x", function(d){
				return graphReferences.xScale(d[0]);
			})
		.attr("y", function(d){
				return graphReferences.yScale(d[1]);
			})
		// Use the following for width :
		.attr("width", function(d){
			return graphReferences.xScale.bandwidth();
		}) 
		.attr("height", function(d){
			return (graphReferences.heightScale(d[1]));
		})
		.attr("fill", function(d){
			return defualtCountyColor({county : d[0]});	// Pass the value as string
		})
		.on('mouseover', function(d){
			// Change color of bar on hover:
			d3.select(this).style("fill", hoverCountyColor({county : d[0]}));
			tooltip.transition()
				.duration(200)
				.style("opacity", 1.0)
				.style("width", function(){
					tooltipWidth = 80;
					return tooltipWidth + "px";
				});

			// Set the name to show on hover in the tooltip
			tooltip.html("<strong>" + d[0] + "</strong>")
				.style("height", function(){
					tooltipHeight = 20;
					return tooltipHeight + "px";
				})
				.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
				.style("top", (d3.event.pageY + 20) + "px");
			})
		.on('mouseout', function(d){
			// Reset color on hover out:
			d3.select(this).style("fill", defualtCountyColor({county : d[0]}));

			tooltip.transition()
			.duration(500)
			.style("opacity", 0)
		});

	var bar_texts = graphReferences.SVG.append("g")
		.selectAll("text")
		.data(graphReferences.dataset)
		.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("font-size", graphReferences.fontSize)
		.attr("x", function(d){
				 return graphReferences.xScale(d[0]) + graphReferences.xScale.bandwidth() / 2;
		})
		.attr("y", function(d){
				 return graphReferences.yScale(d[1]) -1;
		})
		.attr("fill", "black")
		.text(function(d){ return d[1]; })

}

// Function to craete and update the bar graph:
function updateBarGraph(barUpdateReferences, county_name, region_id){

	var bar_rects;

	// Create a transition element:
	var t = d3.transition()
		.duration(750);

	// Set domains of the scales for X, Y and height axes:
	barUpdateReferences.xScale.domain(barUpdateReferences.dataset.map(function(d) { return d[0];}));
	barUpdateReferences.yScale.domain([0, d3.max(barUpdateReferences.dataset, function(d) { return d[1]; })+barUpdateReferences.heightPadding]);				// Additional 5 for margin
	barUpdateReferences.heightScale.domain([0, d3.max(barUpdateReferences.dataset, function(d) { return d[1]; })+barUpdateReferences.heightPadding]);			// Additional 5 for margin

	// Create the X and the Y axes:
	var xAxisCall = d3.axisBottom()
		.scale(barUpdateReferences.xScale);

	var yAxisCall = d3.axisLeft()
		.scale(barUpdateReferences.yScale);

	// Create/Update the axes:
	barUpdateReferences.xAxis.transition(t)
		.call(xAxisCall)
		.selectAll("text")
		.attr("y", 10)
		.attr("x", 5)
		.attr("transform", "rotate(-20)")
		.style("text-anchor", "end");

	barUpdateReferences.yAxis.transition(t)
		.call(yAxisCall);

	// Create/Update the bar graph:
	bar_rects = barUpdateReferences.SVG.selectAll("rect")
		.data(barUpdateReferences.dataset);

	// REMOVE the old data:
	bar_rects.exit()
		.attr("fill", "red")
		.transition(t)
		.attr("y", barUpdateReferences.yScale(0))
		.attr("height", 0)
		.remove();

	// UPDATE the new data:
	bar_rects.enter()
		.append("rect")
		.attr("x", function(d, i){
				 return i * (barUpdateReferences.width / barUpdateReferences.dataset.length);
			})
		.attr("y", function(d){
				 return barUpdateReferences.yScale(d[1]);
			})
		// Use the following for width :
		.attr("width", barUpdateReferences.xScale.bandwidth())
		.attr("height", function(d){
			return barUpdateReferences.heightScale(d[1]);
		})
		.attr("fill", function(d){
			if(d[0] == county_name)
				return hoverCountyColor(region_id);		// Pass the value as string
			else
				return defualtCountyColor(region_id);	// Pass the value as string
		})
		.on('mouseover', function(d){
			tooltip.transition()
			.duration(200)
			.style("opacity", 1.0)
			.style("width", function(){
				tooltipWidth = 80;
				return tooltipWidth + "px";
			});
				// Set the name to show on hover in the tooltip
				tooltip.html("<strong>" + d[0] + "</strong>")
				.style("height", function(){
					tooltipHeight = 20;
					return tooltipHeight + "px";
				})
				.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
				.style("top", (d3.event.pageY + 20) + "px");
			})
		.on('mouseout', function(d){
			tooltip.transition()
			.duration(500)
			.style("opacity", 0)
		})
		// Performing updation here:
		.merge(bar_rects)
		.transition(t)
		.attr("x", function(d, i){
				 return i * (barUpdateReferences.width / barUpdateReferences.dataset.length) ;
			})
		.attr("y", function(d){
				 return barUpdateReferences.yScale(d[1]);
			})
		// Use the following for width :
		.attr("width", barUpdateReferences.xScale.bandwidth())
		.attr("height", function(d){
			return barUpdateReferences.heightScale(d[1]);
		})
		.attr("fill", function(d){
			if(d[0] == county_name)
				return hoverCountyColor(region_id.toString());		// Pass the value as string
			else
				return defualtCountyColor(region_id.toString());	// Pass the value as string
		});


	// Create/Update the text:
	var bar_texts = barUpdateReferences.barTextsGroup.selectAll("text")
		.data(barUpdateReferences.dataset);

	// REMOVE the previous text elements:
	bar_texts.exit()
		.attr("fill", "red")
		.transition(t)
		.attr("y", barUpdateReferences.yScale(0))
		.remove();

	// UPDATE the new text elemetns:
	bar_texts.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("x", function(d, i){
			return i * (barUpdateReferences.width / barUpdateReferences.dataset.length) + 
					   (barUpdateReferences.width / barUpdateReferences.dataset.length - barUpdateReferences.barPadding) / 2;
		})
		.attr("y", function(d){
			return barUpdateReferences.yScale(d[1]) - 5;	// The -5 will move it slightly above the bars
		})
		.attr("fill", "black")
		.text(function(d){
			return d[1];
		})
		// Updation calls:
		.merge(bar_texts)
		.transition(t)
		.attr("text-anchor", "middle")
		.attr("x", function(d, i){
			return i * (barUpdateReferences.width / barUpdateReferences.dataset.length) + 
					   (barUpdateReferences.width / barUpdateReferences.dataset.length - barUpdateReferences.barPadding) / 2;
		})
		.attr("y", function(d){
				return barUpdateReferences.yScale(d[1]) - 5;	// The -5 will move it slightly above the bars
			})
		.attr("fill", "black")
		.attr("font-size", "12px")
		.text(function(d){
			return d[1];
		});
	}
