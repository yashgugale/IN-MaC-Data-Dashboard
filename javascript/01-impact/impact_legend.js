function createImpactLegend()
{

    // Add the legend at the end:
    var regionLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];         
    var regionColor  = ["#A1D06C", "#D0A7C7", "#16BEB9", "#FBE662", 
                        "#F89D53", "#077AC4", "#DF4674", "#51C9EB", 
                        "#01A163", "#FB746E", "#985DA2", "#F0F4F7" ];                           // All 12 colors    

    // Compute the legend for the map:
    var legend = mapGroup.append("g")
                        .attr("transform", "translate(" + (width -20 ) + "," + 
                                                          (height - 750) + ")" + "rotate(-6)");

    regionLabels.forEach(function(regionLabels, i){
        var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

        // Append the rectangle for the color of the legend:
        legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", regionColor[i])
        .attr("fill-opacity", 0.4)
        .attr("stroke", "black");

        // Append the text:
        legendRow.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .style("text-transform", "capitalize")
        .text("Region " + regionLabels);

    }); 


    // Circle size legend:
    var circleText = ["Lowest value in the range", "Highest values in the range"];
    var circleRadius = [10, 40];    // 6 impact colors

    var circleLegend = mapGroup.append("g")
        .attr("transform", "translate(" + (width -55 ) + "," + (height ) + ")" + "rotate(-6)");

    circleText.forEach(function(circleText, i){
        var circleLegendRow = circleLegend.append("g")
            .attr("transform", "translate(0, " + (i * -30) + ")");

        // Append the rectangle for the color of the legend:
        circleLegendRow.append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("r", circleRadius[i]);

        // Append the text:
        circleLegendRow.append("text")
            .attr("x", 55)
            .attr("y", 15)
            .attr("text-anchor", "start")
            .style("text-transform", "capitalize")
            .style("font-size", "12px")
            .text(circleText);
    });

    // Add the legend for the circle impact and their colors:
    var impactBubbleValue = ["1 to 500", "501 to 1000", "1001 to 1500", "1501 and greater"];
    var impactBubbleColor = ["#FF0000" ,"#00FF00", "#0000FF", "#000000"];    

    var bubbleLegend = mapGroup.append("g")
        .attr("transform", "translate(" + (width -55) + "," + (height - 130) + ")" + "rotate(-6)");

    impactBubbleValue.forEach(function(impactBubble, i){
        var bubbleLegendRow = bubbleLegend.append("g")
            .attr("transform", "translate(0, " + (i * 15) + ")");

        // Append the rectangle for the color of the legend:
        bubbleLegendRow.append("circle")
            .attr("cx", 0)
            .attr("cy", 5)
            .attr("r", 7)
            .attr("fill", impactBubbleColor[i])
			.attr("fill-opacity", "0.3")
			.attr("stroke", "black")
			.style("stroke-opacity", "1.0")
			.attr("stroke-width", "1.0");

        // Append the text:
        bubbleLegendRow.append("text")
        	.attr("class", "legend_text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("text-transform", "capitalize")
            .style("font-size", "12px")
            .text("Impact value : " + impactBubble);
    });
}