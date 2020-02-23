// A. Reference Ids:
// Bar graph Element:
var ecosystemVizElement = document.getElementById("local_and_regional_plan_ecosystem_viz");		// Data will be shown here

// // Display card elements:
// var infoCardElement 		= document.getElementById("info_card");													// Set its ID
// var infoCardHeaderElement 	= document.getElementById("info_card_header");													// Set its ID
// var infoCardBodyElement 	= document.getElementById("info_card_body");													// Set its ID
// var infoCardTitleElement	= document.getElementById("info_card_title");													// Set its ID
// var infoCardTextElement 	= document.getElementById("info_card_text");													// Set its ID

// var infoDropDownElement 	= document.getElementById("info_drop_down");


// B. Global variables:
var nodes_data = [];
var links_data = [];
var current_node = null;				// Keep a track of the current county clicked on

// a. Indiana Map visualization Parameters:
var mapMargin = { left:40, right:40, top:40, bottom:40 };

// Width and height of the layout:
var ecosystemWidth  = 	1500 - mapMargin.left - mapMargin.right;
var ecosystemHeight = 	1500 - mapMargin.top  - mapMargin.bottom;
var radius = 	10;		// To keep the nodes within the bounding box

// Add an SVG to draw the map on::  
var local_and_regional_plan_ecosystemSVG = d3.select("#local_and_regional_plan_ecosystem_viz")
	.append("svg")
	.attr("id", "ecosystemSVG")
    	.attr("viewBox", function(){
    		return ("0 0 " + (ecosystemWidth  + mapMargin.left + mapMargin.right).toString() + " " 
    					   + (ecosystemHeight + mapMargin.top  + mapMargin.bottom).toString());
    	})
    	.attr("width", "100%")
    	.attr("height", "100%")
    	.attr("class", "element_boundary")
        
var ecosystemGroup = local_and_regional_plan_ecosystemSVG.append("g");

// Create a new element to store all the node coords and then dowload later from it:
var a = document.createElement('a');

// Load in the node link data from the dataset:
// USE TEST DATASET HERE WHERE ALL THE XPOS AND YPOS VALUES ARE APPENDED AT THE END:
d3.csv("../data/09-(b)local_and_regional_plan_ecosystem.csv").then(function(data){

	data.forEach(function(d){

	    var node_data = {
	        Name : d.Organization,
	        Parent : d.Parent,
	        Overview : d["Mission/Goals"],
	        ContactPerson : d["Contact Person"],
	        Email : d.Email,
	        Website : d.Website,
	        County : d.County,
	        Region : d.Region,
	        Phone : d.Phone,
	        xpos : parseFloat(d["xpos"]),
	        ypos : parseFloat(d["ypos"]),
	    };

	    nodes_data.push({
	        Name : node_data.Name,
	        Data : node_data,
	    });

	    links_data.push({
	        source : node_data.Parent,
	        target : node_data.Name,
	    })

	});

	nodes_data.push({
	    Name : "Local and Regional Plan Ecosystem",
	    // Data : "Root Node",
	    Data : {
	    	// Pos values taken from the node_coords.csv file's last entry
	    	xpos : 626.974865,
	    	ypos : 766.5458012,
	    }
	});

	var nodes = nodes_data;
	var links = links_data;

	var simulation = d3.forceSimulation(nodes)
	                .force("charge", d3.forceManyBody())
	                .force("link", d3.forceLink(links)
	                    .distance(1)
	                    // .distance(100)
	                    // .strength(1)
	                    .id(function(d) { return(d.Name); }))//.distance(50))
	                .force("center", d3.forceCenter(ecosystemWidth / 2, ecosystemHeight / 2))
	                // .force("x", d3.forceX().strength(0.5).x(function(d) { return forceScale(d.Data.Parent)[1]; }))
	                // .force("y", d3.forceY().strength(0.5).y(function(d) { return forceScale(d.Data.Parent)[0]; }))
	                .force("collide", d3.forceCollide()
	                    .radius(function(d){
	                    	if(!d.Data.Region)
	                    		return 100;
	                    	else 
	                    		return 30;
	                    })
	                    .strength(0.3))
	                // .force("r", d3.forceRadial(200, width / 2, height / 2))
	                	// .radius(200))

	// Create edges as lines:
	var edges = ecosystemGroup.append("g")
	                .attr("class", "link")
	            .selectAll("line")
	            .data(links)
	            .enter()
	                .append("line")
	               	.style("stroke", function(d) { 
	                	if(!d.target.Data.Region)
	                		return "grey";
	                	return defualtCountyColor({region: d.target.Data.Region}); 
	                })
	                .style("stroke-width", 1);

	// Create the nodes for each data:
	var graphNodes = ecosystemGroup.append("g")
	                    .attr("class", "node")
	                .selectAll("g")
	                .data(nodes)
	                .enter()
	                .append("g")
	                .on("dblclick", dblclick)
	                // To release the node from its fixed position:
	                .call(d3.drag()
	                    .on("start", dragStarted)
	                    .on("drag", dragging)
	                    .on("end", dragEnded));

	// Read all node positions and download them as a file to be used later to assign static positions:
	function read(d){
		var mouseCoordString = "Name,xpos,ypos\n";
		d.each(function() {
    		var node = d3.select(this);
    		// console.log("Name: ", node._groups[0][0].__data__.Name);
    		// console.log("X: ", node._groups[0][0].__data__.x);
    		// console.log("Y: ", node._groups[0][0].__data__.y);
    		mouseCoordString = mouseCoordString.concat("\"" , node._groups[0][0].__data__.Name.toString() , "\"" ,  "," , 
    			node._groups[0][0].__data__.x , "," ,  
    			node._groups[0][0].__data__.y , "\n");
    	})

    	// console.log(mouseCoordString);
    	a.href = "data:application/octet-stream," + encodeURIComponent(mouseCoordString);
		a.download = "node_coords.csv";
		a.click();
	}

	window.addEventListener("keydown", keyDown, false);
	function keyDown(event)
	{
		if(event.key == "Enter"){
			graphNodes.call(read);
		}
	}

	function dblclick(d){
		d.fx = null;
		d.fy = null;
	}

	var circles = graphNodes
	                .append("circle")
	                // Filter out the circles and just show the text for the data
	                // .filter(function(d){
	                // 	return !d.Data.Region;
	                // })
	               	.on("click", function(d){
	               		// Open up the website of the Organization here:
	               		if(d.Data.Region){
	               			var url = d.Data.Website.match(/^https?:/) ? d.Data.Website : 'https://' + d.Data.Website;
               			    window.open(
               			    	url,
               			    	'_blank' // <- This is what makes it open in a new window.
							);
	               		}
	               	})
	                .attr("r", function(d){
	                	if(!d.Data.Region)
	                		return 50;
	                	else{
	                		return 10;
	                	}
	                })
	                .style("fill", function(d) { 
	                	if(!d.Data.Region)
	                		return "grey";
	                	else{
	                		// d3.select(this).dispatch('click');
	                		return defualtCountyColor({region: d.Data.Region}); 
	                	}
	                })
	                .style("opacity", "1")
	                .style("stroke", function(d){
	                	if(!d.Data.Region)
	                		return "black";
	                })
	                .style("stroke-width", function(d){
	                	if(!d.Data.Region)
	                		return 5;
	                })	                
	                .on('mouseover', function(d){
	                	if(!d.Data.Region)
	                		d3.select(this).style("cursor", "default");
	                	else
	                		d3.select(this).style("cursor", "pointer");

	                    tooltip.transition()
	                    .duration(200)
	                    .style("opacity", 1.0)
						.style("width", function(){
							tooltipWidth = 200;
							return tooltipWidth + "px";
						})
						.style("height", function(){
							if(!d.Data.Region)
								tooltipHeight = 35;
							else
								tooltipHeight = 60;
							return tooltipHeight + "px";
						})
	                        // Set the name to show on hover in the tooltip:
	                        tooltip.html("<strong>Name: </strong>" + d.Name + "<br>" + 
	                        	((!d.Data.Region) ? "" : 
	                        						 "<strong>Region: </strong>" + (d.Data.Region))
	                             )
						.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
						.style("top", (d3.event.pageY + 20) + "px");
	                    })
	                .on('mouseout', function(d){
	                    d3.select(this).style("cursor", "default");

	                    tooltip.transition()
	                    .duration(500)
	                    .style("opacity", 0)
	                   	.style("width", "80px")
	                    .style("height", "35px");
	                });



function wrap(text) {
  text.each(function() {
    var text = d3.select(this);
    var words = text.text().split(/\s+/).reverse(),
        word,
        width,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        // dy = parseFloat(text.attr("dy")),
        dy;
	if(words.length > 3){
		dy = 2;
    	width = 100;
	}
    else{
    	dy = 1;
    	width = 50;
    }

    var tspan = text.text(null)
        			.append("tspan")
        			.attr("x", 0)
        			.attr("y", y)
        			.attr("dy", dy + "em");


    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
        			.attr("x", 0)
        			.attr("y", y)
        			.attr("dy", ++lineNumber * lineHeight + dy + "em")
        			.text(word);
      }
    }
  });
}

	var nodeText = graphNodes
	                .append("text")
	                .attr("x", 0)
	                .attr("y", function(d){
	                	if(!d.Data.Region)
		                	return -40;
		                else 
		                	return -25;
	                })
	                .attr("text-anchor", "middle")
	                .attr("font-size", function(d){
	                	if(!d.Data.Region)
	                	{
	                		return "15px";
	                	}
	                	else
	                	{
	                		return "10px";
	                	}
	                })
	               	.on("click", function(d){
	               		// Open up the website of the Organization here:
	               		if(d.Data.Region){
	               			var url = d.Data.Website.match(/^https?:/) ? d.Data.Website : 'https://' + d.Data.Website;
               			    window.open(
               			    	url,
               			    	'_blank' // <- This is what makes it open in a new window.
							);
	               		}
	               	})
	                // .attr("font-weight", "bold")
	                .on('mouseover', function(d){
	                	if(!d.Data.Region)
	                		d3.select(this).style("cursor", "default");
	                	else
	                		d3.select(this).style("cursor", "pointer");

	                    tooltip.transition()
	                    .duration(200)
	                    .style("opacity", 1.0)
						.style("width", function(){
							tooltipWidth = 200;
							return tooltipWidth + "px";
						})
						.style("height", function(){
							if(!d.Data.Region)
								tooltipHeight = 35;
							else
								tooltipHeight = 65;
							return tooltipHeight + "px";
						})
	                        // Set the name to show on hover in the tooltip:
	                        tooltip.html("<strong>Name: </strong>" + d.Name + "<br>" + 
	                        	((!d.Data.Region) ? "" : 
	                        						 "<strong>Region: </strong>" + (d.Data.Region))
	                             )
						.style("left", (d3.event.pageX - tooltipWidth / 2) + "px")
						.style("top", (d3.event.pageY + 20) + "px");
	                    })
	                .on('mouseout', function(d){
	                    d3.select(this).style("cursor", "default");

	                    tooltip.transition()
	                    .duration(500)
	                    .style("opacity", 0)
	                   	.style("width", "80px")
	                    .style("height", "35px");
	                })
	                .text(function(d) {
	                	// COMMENTED THIS OUT NOW:
	                	// console.log(d);
	                	
	                	// if(!d.Data.Region){
	              //   	var words = d.Name.split(/\s+/).reverse(),
	              //   		word,
	              //   		line = [],
	              //   		lineNumber = 0,
	              //   		lineHeight = 1.1,
	              //   		y = 5,
	              //   		dy = "1.2em",
	              //   		tspan = d3.select(this).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy);
	              //   		while(word = words.pop()){
	              //   			line.push(word);
	              //   			tspan.text(line.join(" "));
	              //   			if(tspan.node().getComputedTextLength() > 20){
	              //   				line.pop();
	              //   				tspan.text(line.join(" "));
	              //   				line = [word];
        							// tspan = d3.select(this).append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy).text(word);
	              //   			}
	              //   		}

	                		return d.Name; 
	                	// }
	                })
	                .call(wrap);

	    // Dragging functions:
	    function dragStarted(d){
	        d3.select(this).classed("fixed", d.fixed = true);
	        if(!d3.event.active) simulation.alphaTarget(0.3).restart();
	        d.fx = d.x;
	        d.fy = d.y;

	    }

	    function dragging(d){
	        d.fx = d3.event.x;
	        d.fy = d3.event.y;
	    }

	    function dragEnded(d){
	        // Uncomment the following if you want the node to return to original position:
	        if(!d3.event.active) simulation.alphaTarget(0);
	        d.fx = d3.event.x;
	        d.fy = d3.event.y;
	        // d.fx = null;
	        // d.fy = null;
	    }

	    // graphNodes.append("title")
	    //     .text(function(d){return d.Name; });

	    // Everytime the simulation "ticks", this will be called:
	    simulation.on("tick", ticked);

	    simulation.force("link")
	            .links(links);

	    function ticked(){
	    	// Keep the links within the box:
	        edges.attr("x1", function(d) { 
	        		// return Math.max(radius, Math.min(width - radius, d.source.x)) 
		        	return d.source.Data.xpos; 
		        })
	             .attr("y1", function(d) {
	             	// return Math.max(radius, Math.min(height - radius, d.source.y))  
	             	return d.source.Data.ypos; 
	             })
	             .attr("x2", function(d) { 
	             	// return Math.max(radius, Math.min(width - radius, d.target.x)) 
	             	return d.target.Data.xpos; 
	             })
	             .attr("y2", function(d) {
	             	// return Math.max(radius, Math.min(height - radius, d.target.y))  
	             	return d.target.Data.ypos; 
	             });

			// Don't use this, since the transform will make it reset to the original position:
	        graphNodes.attr("transform", function(d){
	        	// // Keep the node within the box:
	         //   return "translate(" + 
	         //   Math.max(radius, Math.min(width - radius, d.x)) + 
	         //   // d.x + 
	         //   ", " + 
	         //   Math.max(radius, Math.min(height - radius, d.y)) + 
	         //   // d.y + 
	         //   ")";

	         	// var xpos = (radius * Math.cos(angle));
	         	// var ypos = (radius * Math.sin(angle));

	         	// console.log(d);
	         	// Keep the node within the box:
				return "translate(" + 
				 // Math.max(radius, Math.min(width - radius, d.x)) + 
				d.Data.xpos + 
				", " + 
				 // Math.max(radius, Math.min(height - radius, d.y)) + 
				d.Data.ypos + 
				")";

	        });

	    };

});

function displayData(nodeRef, data)
{
	if(current_node == null)
	{
		current_node = nodeRef;
	}
	else{
		current_node
			.attr("r", 10)
			.style("stroke", "none")
	}

	nodeRef
		.attr("r", 20)
		.style("stroke", "black")
		.style("stroke-width", "2px");

	current_node = nodeRef;

    infoCardElement.className = ""
    // Add shadow class here so that the card has shadow as well (broken for now):
    infoCardElement.classList.add("card", "region-" + data.Data.Region);

    infoCardHeaderElement.innerHTML = "<strong>County : </strong>" + data.Data.County;

    // Add data fields:
    infoCardTitleElement.innerHTML  = "<strong>Organization : </strong>" + data.Data.Name;
    infoCardTextElement.innerHTML   = 
        '<p>' + 
                '<strong> Website : </strong><a href=' + data.Data.Website + ' target="_blank">' + data.Data.Website + '</a><br>' + 
                '<strong> Location : </strong><a href="http://maps.google.com/maps?q=' + 
					encodeURIComponent(data.Data.Location) + '" target="_blank">' 
					+ data.Data.Location + '</a><br>' + 
                '<strong> Impacted : </strong>' + data.Data.Impacted + '<br>' + 
                '<strong> Investment : </strong>' + "$" + data.Data.Investment + '<br>' + 
                '<strong> Project Overview : </strong>' + data.Data.Overview + '<br>' + 
        '</p>';
}