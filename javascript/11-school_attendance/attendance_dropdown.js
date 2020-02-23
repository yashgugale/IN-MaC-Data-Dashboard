var line_svg;
var linePath;
var circles;
var line;
var xScale;
var yScale;
var allYears;

// Input the region name and show the data for the micro grant program:
function showDropDownData(county_name, region_ID, datasetName, dataset){

	if(datasetName == "schoolAttendance")
		attendanceDataDropDown(county_name, region_ID, dataset);

}

function attendanceDataDropDown(county_name, region_ID, dataset)
{

	// Empty all the data in the drop down list:
	$("#info_drop_down").empty();

	// If the region name matches, display all the Organization names in the drop down option:
	dataset.forEach(function(d){
		// console.log(d);
		if(d["County"] == county_name){
			var option = document.createElement("option");
			option.text = d["School Name"] + "[ " + d["Region"] + "]";
			infoDropDownElement.add(option);
		}
	});
	
	// Sort the options:
	var options = $("#info_drop_down option");                    // Collect options         
	options.detach().sort(function(a,b) {               // Detach from select, then Sort
	    var at = $(a).text();
	    var bt = $(b).text();         
	    return (at > bt)?1:((at < bt)?-1:0);            // Tell the sort function how to order
	});
	options.appendTo("#info_drop_down");                          // Re-attach to select



	// Display the data when the county is clicked on for the first time:
	var selectedOption;
	// If there is any data for the county that was clicked on, note the selected option:
	if(infoDropDownElement.options.length){
		selectedOption = infoDropDownElement.options[infoDropDownElement.selectedIndex].text;
	}
	// Otherwise, set the option to null:
	else{
		selectedOption = null;
	}



	// For each data element, if the input Organization name matches it, display all the associated data:
	dataset.forEach(function(d){
		if(selectedOption == d["School Name"] + "[ " + d["Region"] + "]")
		{
			if(createLine == false)
			{
				createLineGraph(lineGraphProperties, d);
				createLine = true;
			}
			else 
			{
				updateLineGraph(lineGraphProperties, d);
			}

			infoCardElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoCardElement.classList.add("card", "region-" + d["Region"], "my-5");


			infoDropDownElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "text-black", "custom-select", 
											"region-" + d["Region"]);

			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d["County"];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Corporation Name : </strong>' + d["Corporation Name"];
			// '<h5 class="card-title"><i class="far fa-building"></i><strong> Organization : </strong>' + d[1]
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="fas fa-school"></i>' +
						'<strong> School Name : </strong>' + d["School Name"] + '<br>' +
					'<i class="fas fa-caret-right"></i>' + 
						'<strong> School ID : </strong>' + d["School ID"]+ '<br>' + 
				'</p>' + 
				// Add table:
				'<table class="table table-sm table-bordered ' + 'region-' + d["Region"] + '>"' + 
					'<thead>' + 
						'<tr>' + 
							'<th scope="col">2005-06</th>' + 
							'<th scope="col">2006-07</th>' + 
							'<th scope="col">2007-08</th>' + 
							'<th scope="col">2008-09</th>' + 
							'<th scope="col">2009-10</th>' + 
							'<th scope="col">2010-11</th>' + 
							'<th scope="col">2011-12</th>' + 
							'<th scope="col">2012-13</th>' + 
							'<th scope="col">2013-14</th>' + 
							'<th scope="col">2014-15</th>' + 
							'<th scope="col">2015-16</th>' + 
							'<th scope="col">2016-17</th>' + 
							'<th scope="col">2017-18</th>' + 
						'</tr>' +
					'</thead>' +
					'<tbody>' + 
						'<tr>' + 
							'<td>' + (Number.isNaN(d["2005-06"]) ? "No data" : d["2005-06"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2006-07"]) ? "No data" : d["2006-07"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2007-08"]) ? "No data" : d["2007-08"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2008-09"]) ? "No data" : d["2008-09"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2009-10"]) ? "No data" : d["2009-10"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2010-11"]) ? "No data" : d["2010-11"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2011-12"]) ? "No data" : d["2011-12"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2012-13"]) ? "No data" : d["2012-13"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2013-14"]) ? "No data" : d["2013-14"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2014-15"]) ? "No data" : d["2014-15"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2015-16"]) ? "No data" : d["2015-16"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2016-17"]) ? "No data" : d["2016-17"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2017-18"]) ? "No data" : d["2017-18"] + '%') + '</td>' + 
						'</tr>' + 
					'</tbody>' + 
				'</table>';

		dataForReport[0] = d["County"];
		dataForReport[1] = d["Corporation Name"];
		dataForReport[2] = d["School Name"];
		dataForReport[3] = d["School ID"];
		dataForReport[4] = [(Number.isNaN(d["2005-06"]) ? "No data" : d["2005-06"] + '%'), 
							(Number.isNaN(d["2006-07"]) ? "No data" : d["2006-07"] + '%'), 
							(Number.isNaN(d["2007-08"]) ? "No data" : d["2007-08"] + '%'), 
							(Number.isNaN(d["2008-09"]) ? "No data" : d["2008-09"] + '%'),
							(Number.isNaN(d["2009-10"]) ? "No data" : d["2009-10"] + '%'), 
							(Number.isNaN(d["2010-11"]) ? "No data" : d["2010-11"] + '%'), 
							(Number.isNaN(d["2011-12"]) ? "No data" : d["2011-12"] + '%'), 
							(Number.isNaN(d["2012-13"]) ? "No data" : d["2012-13"] + '%'),
							(Number.isNaN(d["2013-14"]) ? "No data" : d["2013-14"] + '%'),
							(Number.isNaN(d["2014-15"]) ? "No data" : d["2014-15"] + '%'),
							(Number.isNaN(d["2015-16"]) ? "No data" : d["2015-16"] + '%'),
							(Number.isNaN(d["2016-17"]) ? "No data" : d["2016-17"] + '%'),
							(Number.isNaN(d["2017-18"]) ? "No data" : d["2017-18"] + '%')];

		
		}

		// If there is no Organization data, remove the Bootstrap 4 card element:
		if(selectedOption == null)
		{
			// Empty out the class names and re-initialize with new data:
			infoCardElement.className = ""
			infoCardElement.classList.add("card", "region-" + region_ID, "my-5");

			infoDropDownElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "text-black", "custom-select", 
											"region-" + region_ID);

			// Create a new text element and use it to set the value when the data is empty:
			$("#info_card_title").empty();
			$("#info_card_header").empty();
			$("#info_card_text").empty();
			$('#info_drop_down').empty()
				.append('<option selected="selected">No Data Available</option>');

			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" +county_name;
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Corporation Name : </strong>' + "No data available";
			// '<h5 class="card-title"><i class="far fa-building"></i><strong> Organization : </strong>' + d[1]
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="fas fa-school"></i>' +
						'<strong> School Name : </strong>' + "No data available" + '<br>' +
					'<i class="fas fa-caret-right"></i>' + 
						'<strong> School ID : </strong>' + "No data available" + '<br>' + 
				'</p>';

		}

	});

	// Update the data when a new option is selected from the drop down list:
	$('#info_drop_down').change(function(){
	// Reselect the option from the drop down if a new option is selected:
	selectedOption = infoDropDownElement.options[infoDropDownElement.selectedIndex].text;

	// For each data element, if the input Organization name matches it, display all the associated data:
	dataset.forEach(function(d){
		if(selectedOption == d["School Name"] + "[ " + d["Region"] + "]")
		{
			updateLineGraph(lineGraphProperties, d);

			infoCardElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoCardElement.classList.add("card", "region-" + d["Region"], "my-5");

			infoDropDownElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "text-black", "custom-select", 
											"region-" + d["Region"]);

			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d["County"];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Corporation Name : </strong>' + d["Corporation Name"];
			// '<h5 class="card-title"><i class="far fa-building"></i><strong> Organization : </strong>' + d[1]
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="fas fa-school"></i>' +
						'<strong> School Name : </strong>' + d["School Name"] + '<br>' +
					'<i class="fas fa-caret-right"></i>' + 
						'<strong> School ID : </strong>' + d["School ID"]+ '<br>' + 
				'</p>' + 
				// Add table:
				'<table class="table table-sm table-bordered ' + 'region-' + d["Region"] + '>"' + 
					'<thead>' + 
						'<tr>' + 
							'<th scope="col">2005-06</th>' + 
							'<th scope="col">2006-07</th>' + 
							'<th scope="col">2007-08</th>' + 
							'<th scope="col">2008-09</th>' + 
							'<th scope="col">2009-10</th>' + 
							'<th scope="col">2010-11</th>' + 
							'<th scope="col">2011-12</th>' + 
							'<th scope="col">2012-13</th>' + 
							'<th scope="col">2013-14</th>' + 
							'<th scope="col">2014-15</th>' + 
							'<th scope="col">2015-16</th>' + 
							'<th scope="col">2016-17</th>' + 
							'<th scope="col">2017-18</th>' + 
						'</tr>' +
					'</thead>' +
					'<tbody>' + 
						'<tr>' + 
							'<td>' + (Number.isNaN(d["2005-06"]) ? "No data" : d["2005-06"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2006-07"]) ? "No data" : d["2006-07"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2007-08"]) ? "No data" : d["2007-08"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2008-09"]) ? "No data" : d["2008-09"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2009-10"]) ? "No data" : d["2009-10"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2010-11"]) ? "No data" : d["2010-11"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2011-12"]) ? "No data" : d["2011-12"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2012-13"]) ? "No data" : d["2012-13"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2013-14"]) ? "No data" : d["2013-14"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2014-15"]) ? "No data" : d["2014-15"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2015-16"]) ? "No data" : d["2015-16"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2016-17"]) ? "No data" : d["2016-17"] + '%') + '</td>' + 
							'<td>' + (Number.isNaN(d["2017-18"]) ? "No data" : d["2017-18"] + '%') + '</td>' + 
						'</tr>' + 
					'</tbody>' + 
				'</table>';

		dataForReport[0] = d["County"];
		dataForReport[1] = d["Corporation Name"];
		dataForReport[2] = d["School Name"];
		dataForReport[3] = d["School ID"];
		dataForReport[4] = [(Number.isNaN(d["2005-06"]) ? "No data" : d["2005-06"] + '%'), 
							(Number.isNaN(d["2006-07"]) ? "No data" : d["2006-07"] + '%'), 
							(Number.isNaN(d["2007-08"]) ? "No data" : d["2007-08"] + '%'), 
							(Number.isNaN(d["2008-09"]) ? "No data" : d["2008-09"] + '%'),
							(Number.isNaN(d["2009-10"]) ? "No data" : d["2009-10"] + '%'), 
							(Number.isNaN(d["2010-11"]) ? "No data" : d["2010-11"] + '%'), 
							(Number.isNaN(d["2011-12"]) ? "No data" : d["2011-12"] + '%'), 
							(Number.isNaN(d["2012-13"]) ? "No data" : d["2012-13"] + '%'),
							(Number.isNaN(d["2013-14"]) ? "No data" : d["2013-14"] + '%'),
							(Number.isNaN(d["2014-15"]) ? "No data" : d["2014-15"] + '%'),
							(Number.isNaN(d["2015-16"]) ? "No data" : d["2015-16"] + '%'),
							(Number.isNaN(d["2016-17"]) ? "No data" : d["2016-17"] + '%'),
							(Number.isNaN(d["2017-18"]) ? "No data" : d["2017-18"] + '%')];
		}
		});
	});

}

// Create a transition element:
var t = d3.transition()
	.duration(750);

function createLineGraph(lineGraphProperties, data)
{
	// Create the SVG:
	line_svg = d3.select("#" + lineGraphProperties.id)
	.append("svg")
	.attr("id", "lineGraphSVG")
		.attr("viewBox", function(){
			return ("0 0 " + (lineGraphProperties.width  + lineGraphProperties.margin.left + lineGraphProperties.margin.right).toString() + " " 
						   + (lineGraphProperties.height + lineGraphProperties.margin.top  + lineGraphProperties.margin.bottom).toString());
		})
		.attr("width", "100%")
		.attr("height", "100%")
		.append("g")
			.attr("transform", "translate(" + lineGraphProperties.margin.left + "," + lineGraphProperties.margin.top + ")");

	// Year range for the X Scale:
	allYears = 	[ "2005-06", "2006-07", "2007-08", "2008-09", "2009-10", "2010-11", "2011-12", 
					  "2012-13", "2013-14", "2014-15", "2015-16", "2016-17", "2017-18" ];

	// X and Y axis labels:
	var xLabel = line_svg.append("text")
		.attr("y", lineGraphProperties.height + 26)
		.attr("x", (lineGraphProperties.width) - 40)
		.attr("font-size", "14px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle")
		.text(lineGraphProperties.xLabel);

	var yLabel = line_svg.append("text")
		.attr("y", -15)
		.attr("x", lineGraphProperties.xLabelPadding)
		.attr("font-size", "14px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle")
		// .attr("transform", "rotate(-90)")
		.text(lineGraphProperties.yLabel);

	// X Scale:
	xScale = d3.scaleBand()	
		.domain(allYears)						
		.rangeRound([0, lineGraphProperties.width ])
		.paddingInner(0.05);

	// Y Scale:
	yScale = d3.scaleLinear()	
		.domain([0, 100])			
		.range([lineGraphProperties.height - lineGraphProperties.chartPadding , 0]);

	// Create the line generator:
	line = d3.line()
		.defined(d => !isNaN(d[0]))
		.x(function(d, i) { return xScale(d[1]) + (xScale.bandwidth() / 2); })
		.y(function(d) { return yScale(d[0]); })
		.curve(d3.curveMonotoneX);

	var xAxisCall = d3.axisBottom(xScale);
	var xAxis = line_svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + (lineGraphProperties.height  - lineGraphProperties.chartPadding) + ")")
		.call(xAxisCall);

	var yAxisCall = d3.axisLeft(yScale)
		.tickFormat(function(d){ return d + "%"; });
	var yAxis = line_svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(-10, 0)")
		.call(yAxisCall);

	var attendance = [];
	allYears.forEach(function(d){
		attendance.push([data[d], d]);
	})

    linePath = line_svg.append("path")
        .datum(attendance.filter(line.defined()))
        .attr("class", function(d){
        	return ("attendance_line region-" + data["Region"]);
        })
        .attr("d", line)
        .style("fill", "none");

    // Append circles:
    circles = line_svg
    	.selectAll(".attendance_dots")
        .data(attendance)
    .enter()
        .append("circle")
        .attr("class", function(d){
        	// console.log("attendance_dots " + ("region-" + data["Region"]));
        	return ("attendance_dots region-" + data["Region"]);
        })
        .attr("cx", d => xScale(d[1]) + (xScale.bandwidth() / 2))
        .attr("cy", d => yScale(d[0]))
        .attr("r", 5)
    	.on('mouseover', function(d){
			tooltip.transition()
			.duration(200)
			.style("opacity", 1.0)
			.style("width", function(){
				tooltipWidth = 200;
				return tooltipWidth + "px";
			})
			.style("height", function(){
				tooltipHeight = 20;
				return tooltipHeight + "px";
			})				
				// Set the name to show on hover in the tooltip
				tooltip.html(
					"<strong>Attendance for " + d[1] + ": </strong>" + d[0] + "%" 
					)
				.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
				.style("top", (d3.event.pageY + 20) + "px");
			})
		.on('mouseout', function(d){
			tooltip.transition()
			.duration(500)
			.style("opacity", 0)
		});

}

function updateLineGraph(lineGraphProperties, data)
{
	// Year range for the X Scale:
	var allYears = 	[ "2005-06", "2006-07", "2007-08", "2008-09", "2009-10", "2010-11", "2011-12", 
					  "2012-13", "2013-14", "2014-15", "2015-16", "2016-17", "2017-18" ];

	var attendance = [];
	allYears.forEach(function(d){
		attendance.push([data[d], d]);
	})

    linePath.datum(attendance.filter(line.defined()))
        .attr("class", function(d){
        	return ("attendance_line region-" + data["Region"]);
        })
        .attr("d", line)
        .style("fill", "none");


    // Append circles:
    line_svg
    	.selectAll(".attendance_dots")
        .data(attendance)
        .attr("class", function(d){
        	return ("attendance_dots region-" + data["Region"]);
        })
        .attr("cx", function(d){
        	return (xScale(d[1]) + (xScale.bandwidth() / 2));
        }) 
        .attr("cy", d => yScale(d[0]))
        .attr("r", 5)
        .attr("visibility", function(d){
        	if(Number.isNaN(d[0]))
        		return "hidden";
        	else 
        		return "visible";
        });
}