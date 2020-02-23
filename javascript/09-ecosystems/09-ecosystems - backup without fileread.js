// A. Reference Ids:
// Bar graph Element:
var ecosystemVizElement = document.getElementById("ecosystem_viz");		// Data will be shown here

// Display card elements:
var infoCardElement 		= document.getElementById("info_card");													// Set its ID
var infoCardHeaderElement 	= document.getElementById("info_card_header");													// Set its ID
var infoCardBodyElement 	= document.getElementById("info_card_body");													// Set its ID
var infoCardTitleElement	= document.getElementById("info_card_title");													// Set its ID
var infoCardTextElement 	= document.getElementById("info_card_text");													// Set its ID

var infoDropDownElement 	= document.getElementById("info_drop_down");


// B. Global variables:
var nodes_data = [];
var links_data = [];
var current_node = null;				// Keep a track of the current county clicked on


// D. Create a tooltip to show data when you hover:
var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);


// a. Indiana Map visualization Parameters:
var mapMargin = { left:40, right:40, top:40, bottom:40 };

// Width and height of the layout:
var width  = 	1000 - mapMargin.left - mapMargin.right;
var height = 	1000 - mapMargin.top  - mapMargin.bottom;
var radius = 	10;		// To keep the nodes within the bounding box

// Add an SVG to draw the map on::  
var ecosystemSVG = d3.select("#ecosystem_viz")
	.append("svg")
    	.attr("viewBox", function(){
    		return ("0 0 " + (width  + mapMargin.left + mapMargin.right).toString() + " " 
    					   + (height + mapMargin.top  + mapMargin.bottom).toString());
    	})
    	.attr("width", "100%")
    	.attr("height", "100%")
    	.attr("class", "element_boundary")
        
var ecosystemGroup = ecosystemSVG.append("g");

// Create a new element to store all the node coords and then dowload later from it:
var a = document.createElement('a');

// Remove all the parentSet and parentData related stuff.
var parentSet = new Set();
var parentData = [];
// Load in the node link data from the dataset:
d3.csv("../data/09-(a)microgrant_ecosystem.csv").then(function(data){

	data.forEach(function(d){

		parentSet.add(d.Parent);

	    var node_data = {
	        Name : d.Name,
	        Parent : d.Parent,
	        Overview : d.Overview,
	        Website : d.Website,
	        Location : d.Location,
	        County : d.County,
	        Region : d.Region,
	        Impacted : parseInt(d["Impacted"], 10),
	        Investment : parseFloat(d.Investment.replace('$', '').replace(/,/g, '')),
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

	parentSet.forEach(function(d){
		// 0 = name of the parent node
		// 1 = total children of that parent
		// 2 = iterated over all children to get angle, (refer to translate part at the bottom)
		// 3 = xpos of the parent
		// 4 = ypos of the parent
		parentData.push([d, 0, 0, 0, 0]);
	});
	nodes_data.forEach(function(d){
		
		for(var i = 0; i < parentData.length; i++){
			if(d.Data.Parent == parentData[i][0])
				parentData[i][1] += 1;
		}
	})

	nodes_data.push({
	    Name : "Microgrant Ecosystem",
	    Data : "Root Node",
	});

	var nodes = nodes_data;
	var links = links_data;

	// Create a force simulation:
	// var simulation = d3.forceSimulation(nodes)
	//                 .force("charge", d3.forceManyBody())
	//                 .force("link", d3.forceLink(links)
	//                     .distance(50)
	//                     .id(function(d) { return(d.Name); }))//.distance(50))
	//                 .force("center", d3.forceCenter(width / 2, height / 2))
	//                 .force("collide", d3.forceCollide()
	//                     .radius(35)
	//                     .strength(0.3))
	//                 // .force("r", d3.forceRadial(100))
	//                 	// .radius(200))
	
	// Not used right now:
	// const forceX = d3.forceX(width).strength(0.015)
	// const forceY = d3.forceY(height / 2).strength(0.015)
	
	// To push the nodes to certain positions on the axes:
	// var forceDomain = Array.from(parentSet);
	// var forceRange =  [
	// 					[width / 4, height / 4],
	// 					[width / 2, height / 2], 
	// 					[width / 2, height / 4],
	// 					[width * 3 / 4, height / 4],

	// 					[width / 4, height / 2],
	// 					// [width / 2, height / 2],
	// 					[width * 3 / 4, height / 2],

	// 					[width / 4, height * 3 / 4],
	// 					[width / 2, height * 3 / 4],
	// 					[width * 3 / 4, height * 3 / 4],
	// 				];

	// var forceScale = d3.scaleOrdinal()
	// 						.domain(forceDomain)
	// 						.range(forceRange);

	// console.log(forceScale.domain());
	// console.log(forceScale.range());

	var simulation = d3.forceSimulation(nodes)
	                .force("charge", d3.forceManyBody())
	                .force("link", d3.forceLink(links)
	                    .distance(1)
	                    // .distance(100)
	                    // .strength(1)
	                    .id(function(d) { return(d.Name); }))//.distance(50))
	                .force("center", d3.forceCenter(width / 2, height / 2))
	                // .force("x", d3.forceX().strength(0.5).x(function(d) { return forceScale(d.Data.Parent)[1]; }))
	                // .force("y", d3.forceY().strength(0.5).y(function(d) { return forceScale(d.Data.Parent)[0]; }))
	                .force("collide", d3.forceCollide()
	                    .radius(function(d){
	                    	if(!d.Data.Region)
	                    		return 140;
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
		var mouseCoordString = "";
		d.each(function() {
    		var node = d3.select(this);
    		// console.log("Name: ", node._groups[0][0].__data__.Name);
    		// console.log("X: ", node._groups[0][0].__data__.x);
    		// console.log("Y: ", node._groups[0][0].__data__.y);
    		mouseCoordString = mouseCoordString.concat(node._groups[0][0].__data__.Name , ": " , 
    			node._groups[0][0].__data__.x , ", " ,  
    			node._groups[0][0].__data__.y , "\n");
    	})

    	// console.log(mouseCoordString);
    	a.href = "data:application/octet-stream," + encodeURIComponent(mouseCoordString);
		a.download = "node_coords.txt";
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
	               		if(d.Data.Region)
	               			displayData(d3.select(this), d);
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
	                		d3.select(this).dispatch('click');
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
	                		d3.select(this).style("cursor", "move");
	                	else
	                		d3.select(this).style("cursor", "pointer");

	                    tooltip.transition()
	                    .duration(200)
	                    .style("opacity", 0.9)
	                    .style("width", "200px")
	                    .style("height", "50px");
	                        // Set the name to show on hover in the tooltip:
	                        tooltip.html("<strong>Name: </strong>" + d.Name + "<br>" + 
	                        	((!d.Data.Region) ? "" : 
	                        						 "<strong>Region: </strong>" + (d.Data.Region))
	                             )
	                        .style("left", (d3.event.pageX) + "px")
	                        .style("top", (d3.event.pageY - 28) + "px");
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
    	width = 200;
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
		                	return -30;
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
	                .text(function(d) {
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

	    graphNodes.append("title")
	        .text(function(d){return d.Name; });

	    // Everytime the simulation "ticks", this will be called:
	    simulation.on("tick", ticked);

	    simulation.force("link")
	            .links(links);

	    function ticked(){
	    	// Keep the links within the box:
	        edges.attr("x1", function(d) { 
	        		return Math.max(radius, Math.min(width - radius, d.source.x)) 
		        	// return d.source.x; 
		        })
	             .attr("y1", function(d) {
	             	return Math.max(radius, Math.min(height - radius, d.source.y))  
	             	// return d.source.y; 
	             })
	             .attr("x2", function(d) { 
	             	return Math.max(radius, Math.min(width - radius, d.target.x)) 
	             	// return d.target.x; 
	             })
	             .attr("y2", function(d) {
	             	return Math.max(radius, Math.min(height - radius, d.target.y))  
	             	// return d.target.y; 
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


	         	// Keep the node within the box:
				return "translate(" + 
				Math.max(radius, Math.min(width - radius, d.x)) + 
				// d.x + 
				", " + 
				Math.max(radius, Math.min(height - radius, d.y)) + 
				// d.y + 
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