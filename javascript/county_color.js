var countyRegionID = {
	"Lake" : 1, "Porter" : 1, "LaPorte" : 1, "Starke" : 1, "Newton" : 1, "Jasper" : 1, "Pulaski" : 1,																					// Region 1 at index 0
	"StJoseph" : 2, "Elkhart" : 2, "Marshall" : 2, "Kosciusko" : 2, "Fulton" : 2,																										// Region 2
	"LaGrange" : 3, "Steuben" : 3, "Noble" : 3, "DeKalb" : 3, "Whitley" : 3, "Allen" : 3, "Wabash" : 3, "Huntington" : 3, "Wells" : 3, "Adams" : 3, "Grant" : 3,						// Region 3
	"White" : 4, "Cass" : 4, "Miami" : 4, "Carroll" : 4, "Howard" : 4, "Tipton" : 4, "Clinton" : 4, "Tippecanoe" : 4, "Benton" : 4, "Warren" : 4, "Fountain" : 4, "Montgomery" : 4,	// Region 4
	"Boone" : 5, "Hamilton" : 5, "Madison" : 5, "Hancock" : 5, "Shelby" : 5, "Johnson" : 5, "Morgan" : 5, "Hendricks" : 5,															// Region 5
	"Blackford" : 6, "Jay" : 6, "Randolph" : 6, "Delaware" : 6, "Henry" : 6, "Wayne" : 6, "Rush" : 6, "Fayette" : 6, "Union" : 6,														// Region 6
	"Vermillion" : 7, "Parke" : 7, "Putnam" : 7, "Vigo" : 7, "Clay" : 7, "Sullivan" : 7,																								// Region 7
	"Owen" : 8, "Greene" : 8, "Monroe" : 8, "Brown" : 8, "Lawrence" : 8, "Daviess" : 8, "Martin" : 8, "Orange" : 8,																	// Region 8
	"Franklin" : 9, "Decatur" : 9, "Bartholomew" : 9, "Jackson" : 9, "Jennings" : 9, "Ripley" : 9, "Dearborn" : 9, "Ohio" : 9, "Switzerland" : 9, "Jefferson" : 9,					// Region 9
	"Scott" : 10, "Washington" : 10, "Clark" : 10, "Floyd" : 10, "Crawford" : 10, "Harrison" : 10,																							// Region 10
	"Knox" : 11, "Gibson" : 11, "Pike" : 11, "Dubois" : 11, "Posey" : 11, "Vanderburgh" : 11, "Warrick" : 11, "Spencer" : 11, "Perry" : 11,													// Region 11
	"Marion" : 12,																																									// Region 12	
};

///////
// H. County default and hover colors:
///////
// Default colors for the counties:
function defualtCountyColor(d){

	// changes so that same function can be used for coloring the bar graph and the counties:
	var switch_var = d;
	if(d.properties != undefined){
		switch_var = d.properties.REGION_ID;
	}
	else if(d.county){
		switch_var = countyRegionID[d.county].toString();
	}
	else if(d.region){
		switch_var = d.region.toString();
	}
	else{
		switch_var = d;
	}

	switch(switch_var){
		case "1": 	return "#A1D06C";	break;
		case "2":	return "#D0A7C7";	break;
		case "3":	return "#16BEB9";	break;
		case "4":	return "#FBE662";	break;
		case "5":	return "#F89D53";	break;
		case "6":	return "#077AC4";	break;
		case "7":	return "#DF4674";	break;
		case "8":	return "#51C9EB";	break;
		case "9":	return "#01A163";	break;
		case "10":	return "#FB746E";	break;
		case "11":	return "#985DA2";	break;
		case "12":	return "#F0F4F7";	break;
	}
}	

// New darker colors for the counties on hover:
function hoverCountyColor(d){
	// changes so that same function can be used for coloring the bar graph and the counties on hover:
	var switch_var = d;
	if(d.properties != undefined){
		switch_var = d.properties.REGION_ID;
	}
	else if(d.county){
		switch_var = countyRegionID[d.county].toString();
	}
	else if(d.region){
		switch_var = d.region.toString();
	}
	else{
		switch_var = d;
	}
	switch(switch_var){
		case "1": 	return "#4E8920";	break;
		case "2":	return "#6C3E75";	break;
		case "3":	return "#016572";	break;
		case "4":	return "#D59F21";	break;
		case "5":	return "#DD5C11";	break;
		case "6":	return "#0B3669";	break;
		case "7":	return "#8D0A31";	break;
		case "8":	return "#0F72B1";	break;
		case "9":	return "#00592D";	break;
		case "10":	return "#D42F38";	break;
		case "11":	return "#44264E";	break;
		case "12":	return "#C4C9CF";	break;
	}
}