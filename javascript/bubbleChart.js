var bubbleChart;
var circles;
var impactSlider;
var amountSlider;
var organization_selected = null;

var bubbleCardElement         = document.getElementById("bubble_card");                                                 // Set its ID
var bubbleCardHeaderElement   = document.getElementById("bubble_cart_header");                                                  // Set its ID
var bubbleCardBodyElement     = document.getElementById("bubble_card_body");                                                    // Set its ID
var bubbleCardTitleElement    = document.getElementById("bubble_card_title");                                                   // Set its ID
var bubbleCardTextElement     = document.getElementById("bubble_card_text");                                                    // Set its ID

var organizationData = {
    county: null,
    organization: null,
    impactGoal: null,
    in_mac_recognition: null,
    event_date: null,
    region: null,
}

var amountValue = 0;
var impactValue = 0;
var regionValue = 0;

function createBubbleChart(bubbleChartProperties)
{
	// Create the chart area on which to draw upon:
	var bubbleChartSVG = d3.select("#" + bubbleChartProperties.id)
	    .append("svg")
        .attr("viewBox", function(){
            return ("0 0 " + (bubbleChartProperties.width  + bubbleChartProperties.margin.left + bubbleChartProperties.margin.right).toString() + " " 
                           + (bubbleChartProperties.height + bubbleChartProperties.margin.top  + bubbleChartProperties.margin.bottom).toString());
        })
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
            .attr("transform", "translate(" + bubbleChartProperties.margin.left + "," + bubbleChartProperties.margin.top + ")");

	// X label (MPG):
	var xLabel = bubbleChartSVG.append("text")
	    .attr("y", bubbleChartProperties.height + 35)
	    .attr("x", bubbleChartProperties.width - 90)
	    .attr("font-size", "13px")
	    .attr("font-weight", "bold")
	    .attr("text-anchor", "middle")
	    .text(bubbleChartProperties.xLabel)

	// Y label (Model count):
	var yLabel = bubbleChartSVG.append("text")
	    .attr("y", -15)
	    .attr("x", (bubbleChartProperties.height / 2) - 130)
	    .attr("font-size", "13px")
	    .attr("font-weight", "bold")
	    .attr("text-anchor", "start")
	    .text(bubbleChartProperties.yLabel)    

	    // Set the X scale:
    xScale = d3.scaleLinear()
        .range([bubbleChartProperties.margin.left, bubbleChartProperties.width-bubbleChartProperties.margin.right]);

    // Set the Y scale:
    yScale = d3.scaleLinear()
        .range([bubbleChartProperties.height, 0]);

    // Set the color scale (CHECK THIS COLOR SCALE):
    colorScale = d3.scaleLinear()
        .range(bubbleChartProperties.colorScaleRange);

    // Set the domains for all the scales:
    xScale.domain([bubbleChartProperties.xScaleMin,     // Impact on X-axis    
                 d3.max(bubbleChartProperties.dataset.map(function(d) {return(d[9]); })) ]);
    yScale.domain([bubbleChartProperties.yScaleMin,
                 d3.max(bubbleChartProperties.dataset.map(function(d) { return(d[8]); }))]);
    colorScale.domain(bubbleChartProperties.colorScaleDomain);

    // create the X axis:
    var xAxisCall = d3.axisBottom(xScale).tickFormat(d3.format(".2s"));
    bubbleChartSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + bubbleChartProperties.height + ")")
        .call(xAxisCall);

    // Create the Y axis:
    var yAxisCall = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));
    bubbleChartSVG.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + bubbleChartProperties.margin.left + ", " + "0)")
        .call(yAxisCall);

    // Define the slider for the amount:
    amountSlider = d3.sliderBottom()
        .min(d3.min(yScale.domain()))
        .max(d3.max(yScale.domain()))
        .width(135)
        .tickFormat(d3.format(".2s"))
        .ticks(5)
        .default([d3.min(yScale.domain()), d3.max(yScale.domain())])
        .fill("#007bff")
        .on('onchange', val => {
          d3.select('p#amount_slider_value')
            .text("Amount requested range: " + "$" + d3.format(",.1f")(val[0]) + 
                                               " - $" + d3.format(",.1f")(val[1]))
            .style("font-size", "14px");
          amountValue = val;
          updateBubbles();
        });

    // Slider attributes:
    var amountSliderAttrib = d3.select('div#amount_slider')
        .append('svg')
        .attr("viewBox", function(){
            return ("0 0 " + (bubbleChartProperties.widgetWidth).toString() + " " 
                           + (bubbleChartProperties.widgetHeight).toString());
        })
        .attr("width", "100%")
        .attr("height", "100%")
        .append('g')
        .attr('transform', 'translate(13,10)');

    // Create the slider and show its value:
    amountSliderAttrib.call(amountSlider);
    d3.select('p#amount_slider_value')
        .text("Amount requested range: " + "$" + d3.format(",.1f")(amountSlider.value()[0]) + 
                                           " - $" + d3.format(",.1f")(amountSlider.value()[1]))
        .style("font-size", "14px");


    // Define the slider for the impact:
    impactSlider = d3.sliderBottom()
        .min(d3.min(xScale.domain()))
        .max(d3.max(xScale.domain()))
        .width(135)
        .tickFormat(d3.format(".2s"))
        .ticks(5)
        .default([d3.min(xScale.domain()), d3.max(xScale.domain())])
        .fill("#007bff")
        .on('onchange', val => {
          d3.select('p#impact_slider_value')
            .text("Student impact goal range: " + d3.format(",.1f")(val[0]) + " - "
                                                + d3.format(",.1f")(val[1]))
            .style("font-size", "14px");

          impactValue = val;
          updateBubbles();
        });

    // Slider attributes:
    var impactSliderAttrib = d3.select('div#impact_slider')
        .append('svg')
        .attr("viewBox", function(){
            return ("0 0 " + (bubbleChartProperties.widgetWidth).toString() + " " 
                           + (bubbleChartProperties.widgetHeight).toString());
        })
        .attr("width", "100%")
        .attr("height", "100%")
        .append('g')
        .attr('transform', 'translate(13,10)');

    // Create the slider and show its value:
    impactSliderAttrib.call(impactSlider);
    d3.select('p#impact_slider_value')
        .text("Student impact goal range: " + d3.format(",.1f")(impactSlider.value()[0]) + " - "
                                            + d3.format(",.1f")(impactSlider.value()[1]))
        .style("font-size", "14px");


    var dollarConversion = d3.format(",.1f");
    // Create the bubble chart:
    bubbleChart = bubbleChartSVG.append("g");

    circles = bubbleChart.selectAll("circle")
        .data(bubbleChartProperties.dataset)
        .enter()
        .append("circle")
            .attr("class", "county")
            .attr("id", function(d){
                return (d[0] + d[1].replace(/[^\w]/gi, ''));
            })
            .attr("cx", function(d){ return(xScale(d[9])); })
            .attr("cy", function(d){ return(yScale(d[8])); })
            .attr("r", function(d){ return("10"); })
            .attr("fill", function(d){ return(colorScale(d[6])); })
            .attr("fill-opacity", "0.8")
            .attr("stroke", "black")
            .attr("visibility", "visible")      // Make it visible at first
            .attr("stroke-width", "1px")
        .on('mouseover', function(d){
            d3.select(this).style("cursor", "pointer");

            // Change color of bar on hover:
            tooltip.transition()
            .duration(200)
            .style("opacity", 1.0)
            .style("width", function(){
                tooltipWidth = 200;
                return tooltipWidth + "px";
            })
            .style("height", function(){
                tooltipHeight = 65;
                return tooltipHeight + "px";
            })

                // Set the data to show on hover in the tooltip
                tooltip.html(
                    "<strong>County: </strong>" + d[0] + "<br>" +
                    "<strong>Amount Requested: </strong>" + "$" + dollarConversion(d[8]) + "<br>" +  
                    "<strong>Amount Approved: </strong>" + "$" + dollarConversion(d[7]) + "<br>" + 
                    "<strong>Student impact: </strong>" + d[9] + "<br>"
                    )
                .style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
            })
        .on('mouseout', function(d){
            d3.select(this).style("cursor", "default");

            // Reset color on hover out:
            tooltip.transition()
            .duration(500)
            .style("opacity", 0)
        })
        // Show organization info on mouse click:
        .on("click", function(d){
            // Reset the old county to the default settings:
            if(organization_selected != null)
            {
                d3.select("#" + organization_selected)
                .style("fill", function(d){ return(colorScale(d[6])); })
                .style("fill-opacity", "0.8")
                .style("stroke", "black")
                .style("stroke-width", "1px")
            }

            // Select the new county clicked on and then set it's color to be red to indicate selection and also
            // increase the width of the boundary:
            d3.select("#" + (d[0] + d[1].replace(/[^\w]/gi, '')))
            .style("fill", "red")
            .style("stroke-width", "3.0px");
            organization_selected = (d[0] + d[1].replace(/[^\w]/gi, ''));


            // console.log(d);
            organizationData.county = d[0];
            organizationData.organization = d[1];
            organizationData.impactGoal = d[9];
            organizationData.in_mac_recognition = d[10];
            organizationData.event_date = d[11];
            organizationData.region = d[6];

            // Show information through the drop down and the bar graph:
            updateOrganizationData(organizationData);


        });

    $('#region_select').change(function(){
        selectedOption = this.value;
        regionValue = selectedOption;
        updateBubbles();
    });

    // Initial selection of the Lake:
    d3.select("#" + "BartholomewFaureciaCleanMobilityB")
        .style("fill", "red")
        .style("stroke-width", "3.0px");
    organization_selected = "BartholomewFaureciaCleanMobilityB";

    // Initial trigger to the bubble:
    d3.select('#BartholomewFaureciaCleanMobilityB').dispatch('click');
}

// Update the bubbles (filtering mechanism):
function updateBubbles()
{
        bubbleChart.selectAll("circle")
            .attr("visibility", function(d) {
                // If we are showing all regions, then check for the slider values:
                if(regionValue == 0)
                {
                    // Check if the values lie within the low - high range of the sliders:
                    if((d[8] < amountValue[0] || d[8] > amountValue[1]) || (d[9] < impactValue[0] || d[9] > impactValue[1]))
                        return("hidden");
                    else{
                            return "visible";
                    }  
                }
                // If not all regions, then check for a specific region:
                // Check if the values lie within the low - high range of the sliders:
                else if((d[8] < amountValue[0] || d[8] > amountValue[1]) || (d[9] < impactValue[0] || d[9] > impactValue[1]) || d[6] != regionValue)
                    return("hidden");
                else{
                        return "visible";
                }
            })

}

function updateOrganizationData(organizationDataForUpdate)
{
    // console.log(organizationDataForUpdate);

    bubbleCardElement.className = ""
    // Add shadow class here so that the card has shadow as well (broken for now):
    bubbleCardElement.classList.add("card", "region-" + organizationDataForUpdate.region);

    bubbleCardHeaderElement.innerHTML = "<strong>County : </strong>" + organizationDataForUpdate.county;

    // Add data fields:
    bubbleCardTitleElement.innerHTML  = "<strong>Organization : </strong>" + organizationDataForUpdate.organization;
    bubbleCardTextElement.innerHTML   = 
        '<p>' + 
                '<strong> In-MAC recognition : </strong>' + organizationDataForUpdate.in_mac_recognition+ '<br>' + 
                '<strong> Student Impact Goal : </strong>' + organizationDataForUpdate.impactGoal+ '<br>' + 
                '<strong> Event Date : </strong>' + organizationDataForUpdate.event_date+ '<br>' + 
        '</p>';
}