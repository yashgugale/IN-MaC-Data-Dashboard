// A. Reference Ids:
// Bar graph Element:
var barGraphCountyVizElement = document.getElementById("bar_graph_county_viz");		// Data will be shown here
var barGraph92CountiesVizElement = document.getElementById("bar_graph_all_92_viz");	
var bubbleChartVizElement = document.getElementById("bubblechart_viz");	
var regionPieChartVizElement = document.getElementById("pie_chart_region_viz");	

// Display card elements:
var infoCardElement 		= document.getElementById("info_card");													// Set its ID
var infoCardHeaderElement 	= document.getElementById("info_card_header");													// Set its ID
var infoCardBodyElement 	= document.getElementById("info_card_body");													// Set its ID
var infoCardTitleElement	= document.getElementById("info_card_title");													// Set its ID
var infoCardTextElement 	= document.getElementById("info_card_text");													// Set its ID

var infoDropDownElement 	= document.getElementById("info_drop_down");

var regionMeanElement = document.getElementById("region_mean_value");	
var regionMedianElement = document.getElementById("region_median_value");	
var regionModeElement = document.getElementById("region_mode_value");	

// B. Global variables:
var businessAndIndustryData = [];	// Store the principal data
var county_selected = null;				// Keep a track of the current county clicked on

var barReferences;
var all92CountiesBarReferences;

var dataForReport = ["County", "Organization", "Contact Person", "Email", "Website"];

// C. create the data structure to store the data:
// Custom (hard-coded) data structure to store the values:
// Store the count for the individual counties:
var barGraphDataset = [
	{"Lake" : 0, "Porter" : 0, "LaPorte" : 0, "Starke" : 0, "Newton" : 0, "Jasper" : 0, "Pulaski" : 0},																					// Region 1 at index 0
	{"StJoseph" : 0, "Elkhart" : 0, "Marshall" : 0, "Kosciusko" : 0, "Fulton" : 0},																										// Region 2
	{"LaGrange" : 0, "Steuben" : 0, "Noble" : 0, "DeKalb" : 0, "Whitley" : 0, "Allen" : 0, "Wabash" : 0, "Huntington" : 0, "Wells" : 0, "Adams" : 0, "Grant" : 0},						// Region 3
	{"White" : 0, "Cass" : 0, "Miami" : 0, "Carroll" : 0, "Howard" : 0, "Tipton" : 0, "Clinton" : 0, "Tippecanoe" : 0, "Benton" : 0, "Warren" : 0, "Fountain" : 0, "Montgomery" : 0},	// Region 4
	{"Boone" : 0, "Hamilton" : 0, "Madison" : 0, "Hancock" : 0, "Shelby" : 0, "Johnson" : 0, "Morgan" : 0, "Hendricks" : 0},															// Region 5
	{"Blackford" : 0, "Jay" : 0, "Randolph" : 0, "Delaware" : 0, "Henry" : 0, "Wayne" : 0, "Rush" : 0, "Fayette" : 0, "Union" : 0},														// Region 6
	{"Vermillion" : 0, "Parke" : 0, "Putnam" : 0, "Vigo" : 0, "Clay" : 0, "Sullivan" : 0},																								// Region 7
	{"Owen" : 0, "Greene" : 0, "Monroe" : 0, "Brown" : 0, "Lawrence" : 0, "Daviess" : 0, "Martin" : 0, "Orange" : 0},																	// Region 8
	{"Franklin" : 0, "Decatur" : 0, "Bartholomew" : 0, "Jackson" : 0, "Jennings" : 0, "Ripley" : 0, "Dearborn" : 0, "Ohio" : 0, "Switzerland" : 0, "Jefferson" : 0},					// Region 9
	{"Scott" : 0, "Washington" : 0, "Clark" : 0, "Floyd" : 0, "Crawford" : 0, "Harrison" : 0},																							// Region 10
	{"Knox" : 0, "Gibson" : 0, "Pike" : 0, "Dubois" : 0, "Posey" : 0, "Vanderburgh" : 0, "Warrick" : 0, "Spencer" : 0, "Perry" : 0},													// Region 11
	{"Marion" : 0}																																										// Region 12
	];


// D. Create a tooltip to show data when you hover:
var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

var tooltipWidth = 80;
var tooltipHeight = 35;

// E. Create propoerties of other graphs and elements in the page:
// Single region bar graph:
var barGraphCountyMargin = { top:30, right:10, bottom:30, left:40 }; 
var countyBarGraphProperties = {
	id : "bar_graph_county_viz",
	margin : barGraphCountyMargin,
	width : barGraphCountyVizElement.clientWidth - barGraphCountyMargin.left - barGraphCountyMargin.right,
	height : 300 								 - barGraphCountyMargin.top  - barGraphCountyMargin.bottom,
	barPadding : 2,
	chartPadding : 20,
	xLabel : "County Name",
	yLabel : "Business and Industry count",
	dataset : null,			// Pass data here if it is a static bar chart
	updatable : false,
	heightPadding : 5,
	xLabelPadding : 55,
};

// All counties bar graph:
var barGraphAll92CountiesMargin = { top:30, right:10, bottom:30, left:40 }; 
var all92CountiesBarGraphProperties = {
	id : "bar_graph_all_92_viz",
	margin : barGraphAll92CountiesMargin,
	width : barGraph92CountiesVizElement.clientWidth - barGraphAll92CountiesMargin.left - barGraphAll92CountiesMargin.right,
	height : 300 								 - barGraphAll92CountiesMargin.top  - barGraphAll92CountiesMargin.bottom,
	barPadding : 2,
	chartPadding : 20,
	xLabel : "County Name",
	yLabel : "Business and Industry count",
	dataset : null,			// Pass data here if it is a static bar chart
	updatable : false,
	class : "county",
	heightPadding : 5,
	xLabelPadding : 55,
	fontSize : "10px",
};

// Pie chart for all regions:
var regionPieChartMargin = { top:15, right:5, bottom:5, left:5 }; 
var regionPieChartWidth = regionPieChartVizElement.clientWidth - regionPieChartMargin.left - regionPieChartMargin.right;
var regionPieChartHeight = 200 						 		   - regionPieChartMargin.top  - regionPieChartMargin.bottom;

var countyPieChartProperties = {
	id : "pie_chart_region_viz",
	margin : regionPieChartMargin,
	width : regionPieChartWidth,
	height : regionPieChartHeight,
	radius : Math.min(regionPieChartWidth, regionPieChartHeight) / 2 - regionPieChartMargin.top,
	dataset : null,			// Pass data here if it is a static bar chart
	updatable : false,
	heightPadding : 5,
	tooltipData : "Total Businesses and Industries in the region",
	tooltipHeight : "60px",
};

// a. Indiana Map visualization Parameters:
var mapMargin = { left:70, right:40, top:60, bottom:40 };

// Width and height of the layout:
var width  = 	700 - mapMargin.left - mapMargin.right;
var height = 	800 - mapMargin.top  - mapMargin.bottom;

// Add an SVG to draw the map on::  
var mapSvg = d3.select("#map_viz")
	.append("svg")
	.attr("id", "mapSvg")
    	.attr("viewBox", function(){
    		return ("0 0 " + (width  + mapMargin.left + mapMargin.right).toString() + " " 
    					   + (height + mapMargin.top  + mapMargin.bottom).toString());
    	})
    	.attr("width", "100%")
    	.attr("height", "100%")
    	.attr("class", "element_boundary");

var mapGroup = mapSvg.append("g")
        		.attr("transform", "rotate(6)");



function init()
{

	///////
	// E. Load the data and extract the information we need:
	///////
	d3.csv("../data/07-business_and_industry_data.csv").then(function(data)
	{
		// console.log(data);
		var i = 0;
		data.forEach(function(d){
			// trim() function is used to remove trailing and leading whitespaces from the data:
			businessAndIndustryData.push([d.County.trim()]);								// Extract the County name
			businessAndIndustryData[i].push(d.Organization.trim());						// Extract the Organization name
			businessAndIndustryData[i].push(d["Contact Person"].trim());					// Extract the Contact name
			businessAndIndustryData[i].push(d.Email.trim());								// Extract the Email ID
			var url = d.Website;
			if(url.length < 1 || url == "Not Readily Available")
				url = "";
			if (url.length != "" && !/^https?:\/\//i.test(d.Website)) {
    			url = 'http://' + d.Website.trim();
			}
			businessAndIndustryData[i].push(url);										// Extract the webpage
			businessAndIndustryData[i].push(d.Region.trim());							// Append the region ID as the last element
			i++;
			// Increment the data structure that stores the count of the total microgrants awarded in the county:
			if(d.County != "n/a" && d.County != ""){
				for(var j = 0; j < 12; j++)
				{
					if(j+1 == +d.Region)
						barGraphDataset[j][d.County] += 1;
				}
			}
		});

		// CREATE SINGLE REGION (COUNTY) BAR GRAPH:
		// Compute the data to be passed to the bar graph to draw:
		countyBarGraphProperties.dataset = generateSingleCountyData("Lake", 1, barGraphDataset);
		countyBarGraphProperties.updatable = true;
		barReferences = createBarGraph(countyBarGraphProperties);
		// On page load call here since this is the last thing that will be called:
		updateBarGraph(barReferences, "Lake", "1");				// Show bar graph
		showDropDownData("Lake", "1", "businessAndIndustry", businessAndIndustryData);			// Show the school data

		// Initial selection of the Lake:
		d3.select("#" + "Lake")
			.style("fill", "red")
			.style("stroke-width", "3.0px");
		county_selected = "Lake";

		countyPieChartProperties.dataset = generateRegionData(barGraphDataset);
		createPieChart(countyPieChartProperties);
		pieOut("1");
		createRegionStats(countyPieChartProperties.dataset);

		// CREATE ALL 92 COUNTIES BAR GRAPH:
		all92CountiesBarGraphProperties.dataset = generate92CountiesData(barGraphDataset);
		all92CountiesBarGraphProperties.updatable = false;
		all92CountiesBarReferences = createBarGraph(all92CountiesBarGraphProperties);

	 	createBarGraph92CountiesLegend(all92CountiesBarReferences);

	});
}

// Load the map data:
d3.json("../data/indiana_counties.json").then(function(indianaData) {

	// Init:
	init();

	///////
	// F. Create the map visualization:
	///////

	// Create a d3 projection:
	var projection = d3.geoAlbersUsa()
		.scale(11000)
		.translate([-1150, 640]);

	// Use the projects for the path:
	var path = d3.geoPath()
		.projection(projection);

	// Append all the counties:
	mapGroup.append("g")
			.attr("class", "counties")					// Add the counties class attribute
			.selectAll("path")
				.data(topojson.feature(indianaData, indianaData.objects.cb_2015_indiana_county_20m).features)
				.enter()
				.append("path")
					.attr("d", path)
					.style("fill", defualtCountyColor)			// Set default colors to the counties at initiation
					.attr("id", function(d){ return d.properties.NAME;})

				// Change the color on mouse hover and show the county name on the top:
				.on("mouseover", function(d)
				{
					d3.select(this).style("cursor", "pointer");

					tooltip.transition()
					.duration(200)
					.style("opacity", 1.0)
					.style("width", function(){
						tooltipWidth = 80;
						return tooltipWidth + "px";
					})
					.style("height", function(){
						tooltipHeight = 35;
						return tooltipHeight + "px";
					})
					// Set the name to show on hover in the tooltip
					tooltip.html(
						"<strong>" + d.properties.NAME 		+ "</strong><br>Region : " + 
						"<strong>" + d.properties.REGION_ID + "</strong>")
					.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
					.style("top", (d3.event.pageY + 20) + "px");

					// Select the current path and change its color:
					if(d.properties.NAME != county_selected)
						d3.select(this).style("fill", hoverCountyColor);
				})

			// Reset the county color to default on hovering out:
			.on("mouseout", function(d){
				d3.select(this).style("cursor", "default");
				
				tooltip.transition()
				.duration(500)
				.style("opacity", 0)

				// Select the current path and reset its color:
				if(d.properties.NAME != county_selected)
					d3.select(this).style("fill", defualtCountyColor);

			})

			// Show principal data on mouse click:
			.on("click", function(d){
				// Reset the old county to the default settings:
				if(county_selected != null)
				{
					d3.select("#" + county_selected)
					.style("fill", defualtCountyColor)
					.style("stroke-width", "0.5px");
				}

				// Select the new county clicked on and then set it's color to be red to indicate selection and also
				// increase the width of the boundary:
				d3.select("#" + d.properties.NAME)
				.style("fill", "red")
				.style("stroke-width", "3.0px");
				county_selected = d.properties.NAME;

				barReferences.dataset = generateSingleCountyData(d.properties.NAME, d.properties.REGION_ID, barGraphDataset);

				// Show information through the drop down and the bar graph:
				updateBarGraph(barReferences, d.properties.NAME, d.properties.REGION_ID);
				showDropDownData(d.properties.NAME, d.properties.REGION_ID, "businessAndIndustry", businessAndIndustryData);

				pieOut(d.properties.REGION_ID);

			});
	
	// Add text to show all the county names:
	mapGroup.selectAll("text")
		.data(topojson.feature(indianaData, indianaData.objects.cb_2015_indiana_county_20m).features)
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
			.style("cursor", "pointer")
			.attr("font-weight", "bold")
			.attr("font-size", "15px")
		})

		// Make the font-size normal on mouseout:
		.on("mouseout", function(d){
			d3.select(this)
			.attr("font-weight", "normal")
			.attr("font-size", "9px")
			.style("cursor", "default");
		})

		// Show principal data on mouse click over the text as well:
		.on("click", function(d){
			// Reset the old county to the default settings:
			if(county_selected != null)
			{
				d3.select("#" + county_selected)
				.style("fill", defualtCountyColor)
				.style("stroke-width", "0.5px");
			}

			// Select the new county clicked on and then set it's color to be red to indicate selection and also
			// increase the width of the boundary:
			d3.select("#" + d.properties.NAME)
			.style("fill", "red")
			.style("stroke-width", "3.0px");
			county_selected = d.properties.NAME;

			barReferences.dataset = generateSingleCountyData(d.properties.NAME, d.properties.REGION_ID, barGraphDataset);

			// Show information through the drop down and the bar graph:
			updateBarGraph(barReferences, d.properties.NAME, d.properties.REGION_ID);
			showDropDownData(d.properties.NAME, d.properties.REGION_ID, "businessAndIndustry", businessAndIndustryData);

			pieOut(d.properties.REGION_ID);

		});

	var mapProperties = {
		width : 700 - mapMargin.left - mapMargin.right,
		height : 800 - mapMargin.top  - mapMargin.bottom,
		SVG : mapGroup,
	}

	// Create the map legend:
	createIndianaEGRLegend(mapProperties);
});



// Stores the URIs of all SVG elements:
var allSVGUri = [];
// Store all images:
var all_imgs = [];

// Wait for inner functions to finish:
async function generateReport()
{
	// Reset the values:
	allSVGUri = [];
	all_imgs = [];

	// Finish these functions:
	await SVGUri("#mapSvg");
	await SVGUri("#countySVG");
	await SVGUri("#all92CountiesSVG")
	await SVGUri("#pieSVG")
	// console.log(allSVGUri);

	for(var i = 0; i < allSVGUri.length; i++){
		// Wait for this function to finish:
		await convertURIToImageData(allSVGUri[i]).then(function(imageData){
			// console.log("7: Finished convertURIToImageData called")

		});
	}

	// await createPDF();
	await generatePDF();
}

function generatePDF()
{
	var doc = new jsPDF();
	// 'a4'  : [ 595.28,  841.89]
	// A4 measures 210 × 297 millimeters or 8.27 × 11.69 inches.
	// Add title:
	
	var mapWidth = width;
	var mapHeight = height;
	var countyBarGraphWidth = countyBarGraphProperties.width;
	var countyBarGraphHeight = countyBarGraphProperties.height;
	var all92CountiesBarGraphWidth = all92CountiesBarGraphProperties.width;
	var all92CountiesBarGraphHeight = all92CountiesBarGraphProperties.height;
	var pieChartWidth = countyPieChartProperties.width;
	var pieChartHeight = countyPieChartProperties.height;

	var maxWidth_1 = 90;
	var maxWidth_2 = 190;

	//A. Create the title:
	doc.setFontSize(12);
	doc.setFont("times");
	doc.setFontStyle("bold");
	doc.text(65, 10, 'Indiana Business and Industries Data Report');
	
	// B. Create the date and time stamp:
	doc.setFontSize(6);
	doc.setFontType("italic");
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
					hour: 'numeric', minute: 'numeric', second: 'numeric' };
	var reportGenerationTime = Intl.DateTimeFormat('en-US', options).format(new Date());

	//var reportGenerationTime = "Created on: " + new Date();
	doc.text(90, 14, reportGenerationTime);

	// C. Add the In-MaC logo:
	var inMacLogo = "data:image/png;base64,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FOYCYCsrif/TMhKsLOdqkRHViPk4M/NWFQBcOwBfhTMz0wdmZr7WIM0+AKAzfU6Xiw2L6PfjGDH1qqVNgn+xfwBKfwclZyj28wAAAAlwSFlzAAALEwAACxMBAJqcGAAABCZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjY0NzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjU0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGRjOnN1YmplY3Q+CiAgICAgICAgICAgIDxyZGY6U2VxLz4KICAgICAgICAgPC9kYzpzdWJqZWN0PgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxODowODoyMSAxNzowODoxMTwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjcuMzwveG1wOkNyZWF0b3JUb29sPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KULhohgAAQABJREFUeAHtvedzXeed5/kgEgBzTmIOohIlSqKyZCvbkt2Wu+3pdbertmu2p7am9s3+KbMv5s1s1ezseNvttrvtti0r55xFUSRFijnnBAIgMvb7ecArMIAIFzec8H1KV7gE7j3hc55zzvf8Ys2ARvAwARMwARMwARMwARMwARGoNQUTMAETMAETMAETMAETKBCwOCyQ8E8TMAETMAETMAETMAFbDj0HTMAETMAETMAETMAEhgjYcjjEwu9MwARMwARMwARMIPcELA5zPwUMwARMwARMwARMwASGCCAOvx36p9+ZgAmYgAmYgAmYgAnkmMC3iMP/qpcFYo5ngXfdBEzABEzABEzABEQAPfhfa1zn0JPBBEzABEzABEzABEygQMAxhwUS/mkCJmACJmACJmACJuBSNp4DJmACJmACJmACJmACQwRsORxi4XcmYAImYAImYAImkHsCFoe5nwIGYAImYAImYAImYAJDBCwOh1j4nQmYgAmYgAmYgAnknoDFYe6ngAGYgAmYgAmYgAmYwBABi8MhFn5nAiZgAiZgAiZgArknYHGY+ylgACZgAiZgAiZgAiYwRMDicIiF35mACZiACZiACZhA7glYHOZ+ChiACZiACZiACZiACQwRsDgcYuF3JmACJmACJmACJpB7AhaHuZ8CBmACJmACJmACJmACQwQsDodY+J0JmIAJmIAJmIAJ5J6AxWHup4ABmIAJmIAJmIAJmMAQAYvDIRZ+ZwImYAImYAImYAK5J2BxmPspYAAmYAImYAImYAImMETA4nCIhd+ZgAmYgAmYgAmYQO4JWBzmfgoYgAmYgAmYgAmYgAkMEbA4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";
	doc.addImage(inMacLogo, 'png', 160, 3, 40, 15);


	// D. Add the map and related information:
	doc.setFontType("normal");
	doc.setFontSize(8);
	var mapText = "The following dataset provides information on all the Businesses and Industries located in the " + 
	"state of Indiana. It also provides information on the contact person and the website of the organization.";
	doc.text(10, 25, mapText, {'maxWidth' : maxWidth_2});

	// E. Map image:
	doc.setFontType("bold");
	var mapTitleText = "Businesses and Industries in each county based on the 12 Indiana Economic Growth regions";
	doc.text(10, 35, mapTitleText, {'maxWidth' : maxWidth_1});
	doc.addImage(all_imgs[0], 'JPEG', 1, 40, 120 * mapWidth / mapHeight, 120 );
	

	// F. County bar graph:
	var countyBarGraphTitleText = "Distribution of the Businesses and Industries in a specific Economic Growth Region";
	doc.text(110, 35, countyBarGraphTitleText, {'maxWidth' : maxWidth_1});
	doc.addImage(all_imgs[1], 'JPEG', (120 * mapWidth / mapHeight) + 10, 40,
										45 * countyBarGraphWidth / countyBarGraphHeight, 
										45 );


	// G. Pie Chart:
	var pieChartTitleText = "Percent distribution of total Businesses and Industries across Indiana's 12 EGR";
	doc.text(110, 45 * countyBarGraphWidth / countyBarGraphHeight + 40,
			pieChartTitleText, {'maxWidth' : maxWidth_1});
	doc.addImage(all_imgs[3], 'JPEG', (120 * mapWidth / mapHeight) + 10, 
						  				45 * countyBarGraphWidth / countyBarGraphHeight + 45, 
									  40 * pieChartWidth / pieChartHeight, 40 );

	// H: Stats field:
	var statsTitleText = "Statistics for the number of Businesses and Industries present in each Economic Growth Region";
	doc.text(110, 45 * countyBarGraphWidth / countyBarGraphHeight + 85,
		statsTitleText, {'maxWidth' : maxWidth_1});
	doc.setFontSize(12);
	var statsMeanText = "Region Mean : " + d3.format(".2s")(statsData.mean); 
	var statsMedianText = "Region Median : " + d3.format(".2s")(statsData.median);
	var statsModeText = "Region Mode : " + statsData.mode.join(", ");
	doc.text(110, 45 * countyBarGraphWidth / countyBarGraphHeight + 95,
			statsMeanText, {'maxWidth' : maxWidth_1});
	doc.text(110, 45 * countyBarGraphWidth / countyBarGraphHeight + 100,
			statsMedianText, {'maxWidth' : maxWidth_1});
	doc.text(110, 45 * countyBarGraphWidth / countyBarGraphHeight + 105,
			statsModeText, {'maxWidth' : maxWidth_1});

	var baseDistance = 140;
	var textDistance = 75;
	// I: All 92 county bar graph:
	doc.setFontSize(8);
	var all92CountyBarGraphTitleText = "Comparison of the total Businesses and Industries in various counties spread in different regions over the entire state of Indiana.";
	doc.text(10, baseDistance + 28, all92CountyBarGraphTitleText, {'maxWidth' : maxWidth_1});
	doc.addImage(all_imgs[2], 'JPEG', 10, baseDistance + 35,
										35 * all92CountiesBarGraphWidth / all92CountiesBarGraphHeight, 
										35 );

	// J. Information text:
	doc.setFontType("normal");
	doc.setFontSize(8);

	// County:
	doc.text(10, baseDistance + textDistance, "County: " + dataForReport[0]);

	// Organization:
	doc.text(10, baseDistance + textDistance + 5, "Organization: " + dataForReport[1]);

	// Contact Person:
	doc.text(10, baseDistance + textDistance + 10, "Contact Person: " + dataForReport[2]);

	// Email:
	doc.text(10, baseDistance + textDistance + 15, "Email: " + dataForReport[3]);

	// Website:
	doc.text(10, baseDistance + textDistance + 20, "Website: " + dataForReport[4]);
	
	doc.save("Businesses and Industries Data Report.pdf")

}