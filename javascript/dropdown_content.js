
// Input the region name and show the data for the micro grant program:
function showDropDownData(county_name, region_ID, datasetName, dataset){

	if(datasetName == "microgrant")
		micrograntDataDropDown(county_name, region_ID, dataset);
	else if(datasetName == "schools_and_principals")
		schoolPrincipalDropDown(county_name, region_ID, dataset);
	else if(datasetName == "preK12")
		related5DropDown(county_name, region_ID, dataset);
	else if(datasetName == "postSecondary")
		related5DropDown(county_name, region_ID, dataset);
	else if(datasetName == "adultAndWorkforce")
		related5DropDown(county_name, region_ID, dataset);
	else if(datasetName == "businessAndIndustry")
		related5DropDown(county_name, region_ID, dataset);
	else if(datasetName == "localAndRegionalPlan")
		related5DropDown(county_name, region_ID, dataset);
}

function micrograntDataDropDown(county_name, region_ID, dataset)
{
	// Empty all the data in the drop down list:
	$("#info_drop_down").empty();
	$("#info_card_title").empty();
	$("#info_card_text").empty();

	// If the region name matches, display all the Organization names in the drop down option:
	dataset.forEach(function(d){
		if(d[0] == county_name){
			var option = document.createElement("option");
			option.text = d[1];
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
		if(selectedOption == d[1])
		{

			infoCardElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoCardElement.classList.add("card", "region-" + d[6], "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + d[6], "text-black", "custom-select" );
			
			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d[0];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Organization : </strong>' + d[1];
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="far fa-user"></i>' + 
						'<strong> Contact Name : </strong>' + d[2]+ '<br>' + 
					'<i class="fas fa-envelope"></i>' + 
						'<strong> Email : </strong><a href="mailto:' + d[3] + '">' + d[3] + '</a><br>' + 
					'<i class="fas fa-map-marker-alt"></i>' + 
					'<strong> Address : </strong><a href="http://maps.google.com/maps?q=' + 
					encodeURIComponent(d[4]) + '" target="_blank">' + d[4] + '</a><br>' +
				'</p>' +
				'<p>' +
					'<i class="fas fa-desktop"></i><strong> Project Summary : </strong>' + d[5] + 
				'</p>';
			
			// var dataForReport = ["County", "Organization", "Contact", "Email", "Address", "Project Summary"];
			dataForReport[0] = d[0];
			dataForReport[1] = d[1];
			dataForReport[2] = d[2];
			dataForReport[3] = d[3];
			dataForReport[4] = d[4];
			dataForReport[5] = d[5];

		}

		// If there is no Organization data, remove the Bootstrap 4 card element:
		if(selectedOption == null)
		{
			// Empty out the class names and re-initialize with new data:
			infoCardElement.className = ""
			infoCardElement.classList.add("card", "region-" + region_ID, "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + region_ID, "text-black", "custom-select" );
			
			// Create a new text element and use it to set the value when the data is empty:
			$("#info_card_title").empty();
			$("#info_card_header").empty();
			$("#info_card_text").empty();
			$('#info_drop_down').empty()
				.append('<option selected="selected">No Data Available</option>');

			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + county_name;
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Organization : </strong>' + "No data available";
			info_card_text.innerHTML 	= '<i class="far fa-user"></i><strong> Contact Name : </strong>' + "No data available" + 
										'<br><i class="fas fa-envelope"></i><strong> Email : </strong>' + "No data available"+ 
										'<br><i class="fas fa-map-marker-alt"></i><strong> Address : </strong>' + "No data available" + 
										'</p>' + 				
										'<p>' +
										'<i class="fas fa-desktop"></i><strong> Project Summary : </strong>' + "No data available" +
										'</p>';

			dataForReport[0] = county_name;
			dataForReport[1] = "No data available";
			dataForReport[2] = "No data available";
			dataForReport[3] = "No data available";
			dataForReport[4] = "No data available";
			dataForReport[5] = "No data available";
		}

	});

	// Update the data when a new option is selected from the drop down list:
	$('#info_drop_down').change(function(){
	// Reselect the option from the drop down if a new option is selected:
	selectedOption = infoDropDownElement.options[infoDropDownElement.selectedIndex].text;

	// For each data element, if the input Organization name matches it, display all the associated data:
	dataset.forEach(function(d){
		if(selectedOption == d[1])
		{
			// Add the classes to the text box to make a card:
			infoCardElement.className = ""
			infoCardElement.classList.add("card", "region-" + d[6], "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + d[6], "text-black", "custom-select" );
			
			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d[0];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Organization : </strong>' + d[1];
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="far fa-user"></i>' + 
						'<strong> Contact Name : </strong>' + d[2]+ '<br>' + 
					'<i class="fas fa-envelope"></i>' + 
						'<strong> Email : </strong><a href="mailto:' + d[3] + '">' + d[3] + '</a><br>' + 
					'<i class="fas fa-map-marker-alt"></i>' + 
					'<strong> Address : </strong><a href="http://maps.google.com/maps?q=' + 
					encodeURIComponent(d[4]) + '" target="_blank">' + d[4] + '</a><br>' +
				'</p>' +
				'<p>' +
					'<i class="fas fa-desktop"></i><strong> Project Summary : </strong>' + d[5] + 
				'</p>';

			// var dataForReport = ["County", "Organization", "Contact", "Email", "Address", "Project Summary"];
			dataForReport[0] = d[0];
			dataForReport[1] = d[1];
			dataForReport[2] = d[2];
			dataForReport[3] = d[3];
			dataForReport[4] = d[4];
			dataForReport[5] = d[5];
		}

	});
});
}

function schoolPrincipalDropDown(county_name, region_ID, dataset)
{
	// Empty all the data in the drop down list:
	$("#info_drop_down").empty();
	$("#info_card_title").empty();
	$("#info_card_text").empty();

	// If the region name matches, display all the Organization names in the drop down option:
	dataset.forEach(function(d){
		if(d[0] == county_name){
			var option = document.createElement("option");
			option.text = d[1] + " [" + d[6] + "]";
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
		if(selectedOption == d[1] + " [" + d[6] + "]")
		{

			infoCardElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoCardElement.classList.add("card", "region-" + d[6], "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + d[6], "text-black", "custom-select" );
			
			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d[0];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Corporation Name : </strong>' + d[3];
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="fas fa-school"></i>' +
						'<strong> School Name : </strong>' + d[1] + '<br>' +
					'<i class="far fa-user"></i>' + 
						'<strong> Principal Name : </strong>' + d[2]+ '<br>' + 
					'<i class="fab fa-chrome"></i>' + 
						'<strong> Website : </strong><a href="' + d[5] + '" target="_blank">' + d[5] + '</a><br>' +
					'<i class="fas fa-map-marker-alt"></i>' + 
						'<strong> Address : </strong><a href="http://maps.google.com/maps?q=' + 
					encodeURIComponent(d[4]) + '" target="_blank">' + d[4] + '</a><br>' +
				'</p>';

			// var dataForReport = ["County", "Corporation Name", "School Name", "Principal Name", "Website", "Address"];
			dataForReport[0] = d[0];
			dataForReport[1] = d[3];
			dataForReport[2] = d[1];
			dataForReport[3] = d[2];
			dataForReport[4] = d[5];
			dataForReport[5] = d[4];

		}

		// If there is no Organization data, remove the Bootstrap 4 card element:
		if(selectedOption == null)
		{
			// Empty out the class names and re-initialize with new data:
			infoCardElement.className = ""
			infoCardElement.classList.add("card", "region-" + region_ID, "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + region_ID, "text-black", "custom-select" );
			
			// Create a new text element and use it to set the value when the data is empty:
			$("#info_card_title").empty();
			$("#info_card_header").empty();
			$("#info_card_text").empty();
			$('#info_drop_down').empty()
				.append('<option selected="selected">No Data Available</option>');

			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + county_name;
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Corporation Name : </strong>' + "No data available";
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="fas fa-school"></i>' +
						'<strong> School Name : </strong>' + "No data available" + '<br>' +
					'<i class="far fa-user"></i>' + 
						'<strong> Principal Name : </strong>' + "No data available" + '<br>' + 
					'<i class="fab fa-chrome"></i>' + 
						'<strong> Website : </strong>' + "No data available" + '<br>' +  
					'<i class="fas fa-map-marker-alt"></i>' + 
						'<strong> Address : </strong>' + "No data available" + '<br>' +
				'</p>';

			// var dataForReport = ["County", "Corporation Name", "School Name", "Principal Name", "Website", "Address"];
			dataForReport[0] = county_name;
			dataForReport[1] = "No data available";
			dataForReport[2] = "No data available";
			dataForReport[3] = "No data available";
			dataForReport[4] = "No data available";
			dataForReport[5] = "No data available";
		}

	});

	// Update the data when a new option is selected from the drop down list:
	$('#info_drop_down').change(function(){
		console.log("changed");
	// Reselect the option from the drop down if a new option is selected:
	selectedOption = infoDropDownElement.options[infoDropDownElement.selectedIndex].text;

	// For each data element, if the input Organization name matches it, display all the associated data:
	dataset.forEach(function(d){
		if(selectedOption == d[1] + " [" + d[6] + "]")
		{
			// Add the classes to the text box to make a card:
			infoCardElement.className = ""
			infoCardElement.classList.add("card", "region-" + d[6], "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + d[6], "text-black", "custom-select" );
			
			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d[0];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Corporation Name : </strong>' + d[3];
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="fas fa-school"></i>' +
						'<strong> School Name : </strong>' + d[1] + '<br>' +
					'<i class="far fa-user"></i>' + 
						'<strong> Principal Name : </strong>' + d[2]+ '<br>' + 
					'<i class="fab fa-chrome"></i>' + 
						'<strong> Website : </strong><a href="' + d[5] + '" target="_blank">' + d[5] + '</a><br>' +  
					'<i class="fas fa-map-marker-alt"></i>' + 
						'<strong> Address : </strong><a href="http://maps.google.com/maps?q=' + 
					encodeURIComponent(d[4]) + '" target="_blank">' + d[4] + '</a><br>' +
				'</p>';
			
			// var dataForReport = ["County", "Corporation Name", "School Name", "Principal Name", "Website", "Address"];
			dataForReport[0] = d[0];
			dataForReport[1] = d[3];
			dataForReport[2] = d[1];
			dataForReport[3] = d[2];
			dataForReport[4] = d[5];
			dataForReport[5] = d[4];
		}

	});
});
}

function related5DropDown(county_name, region_ID, dataset)
{
	// Empty all the data in the drop down list:
	$("#info_drop_down").empty();
	$("#info_card_title").empty();
	$("#info_card_text").empty();

	// If the region name matches, display all the Organization names in the drop down option:
	dataset.forEach(function(d){
		if(d[0] == county_name){
			var option = document.createElement("option");
			option.text = d[1] + " [" + d[5] + "]";
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
		if(selectedOption == d[1] + " [" + d[5] + "]")
		{

			infoCardElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoCardElement.classList.add("card", "region-" + d[5], "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + d[5], "text-black", "custom-select" );
			
			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d[0];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Organization : </strong>' + d[1];
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="far fa-user"></i>' + 
						'<strong> Contact Person : </strong>' + d[2]+ '<br>' + 
					'<i class="fas fa-envelope"></i>' +
						'<strong> Email : </strong><a href="mailto:' + d[3] + '">' + d[3] + '</a><br>' + 
					'<i class="fab fa-chrome"></i>' + 
						'<strong> Website : </strong><a href="' + d[4] + '" target="_blank">' + d[4] + '</a><br>' +
				'</p>';

			// var dataForReport = ["County", "Organization", "Contact Person", "Email", "Website"];
			dataForReport[0] = d[0];
			dataForReport[1] = d[1];
			dataForReport[2] = d[2];
			dataForReport[3] = d[3];
			dataForReport[4] = d[4];
		}

		// If there is no Organization data, remove the Bootstrap 4 card element:
		if(selectedOption == null)
		{
			// Empty out the class names and re-initialize with new data:
			infoCardElement.className = ""
			infoCardElement.classList.add("card", "region-" + region_ID, "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + region_ID, "text-black", "custom-select" );
			
			// Create a new text element and use it to set the value when the data is empty:
			$("#info_card_title").empty();
			$("#info_card_header").empty();
			$("#info_card_text").empty();
			$('#info_drop_down').empty()
				.append('<option selected="selected">No Data Available</option>');

			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + county_name;
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Organization : </strong>' + "No data available";
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="far fa-user"></i>' + 
						'<strong> Contact Person : </strong>' + "No data available" + '<br>' + 
					'<i class="fab fa-chrome"></i>' + 
						'<strong> Email : </strong>' + "No data available" + '<br>' +  
					'<i class="fas fa-map-marker-alt"></i>' + 
						'<strong> Website : </strong>' + "No data available" + '<br>' +
				'</p>';

			// var dataForReport = ["County", "Organization", "Contact Person", "Email", "Website"];
			dataForReport[0] = "No data available";
			dataForReport[1] = "No data available";
			dataForReport[2] = "No data available";
			dataForReport[3] = "No data available";
			dataForReport[4] = "No data available";
		}

	});

	// Update the data when a new option is selected from the drop down list:
	$('#info_drop_down').change(function(){
		console.log("changed");
	// Reselect the option from the drop down if a new option is selected:
	selectedOption = infoDropDownElement.options[infoDropDownElement.selectedIndex].text;

	// For each data element, if the input Organization name matches it, display all the associated data:
	dataset.forEach(function(d){
		if(selectedOption == d[1] + " [" + d[5] + "]")
		{

			infoCardElement.className = ""
			// Add shadow class here so that the card has shadow as well (broken for now):
			infoCardElement.classList.add("card", "region-" + d[5], "my-5");

			// Empty out all the drop-down classes (from the previous calls) and add new classes depending on the region selected:
			infoDropDownElement.className = "";
			infoDropDownElement.classList.add("btn", "btn-region", "dropdown-toggle", "region-" + d[5], "text-black", "custom-select" );
			
			// Add all the data from the dataset and add icons, mail links and google maps where necessary:
			info_card_header.innerHTML 	= "<strong>County : </strong>" + d[0];
			info_card_title.innerHTML 	= '<i class="far fa-building"></i><strong> Organization : </strong>' + d[1];
			info_card_text.innerHTML 	= 
				'<p>' + 
					'<i class="far fa-user"></i>' + 
						'<strong> Contact Person : </strong>' + d[2]+ '<br>' + 
					'<i class="fas fa-envelope"></i>' +
						'<strong> Email : </strong><a href="mailto:' + d[3] + '">' + d[3] + '</a><br>' + 
					'<i class="fab fa-chrome"></i>' + 
						'<strong> Website : </strong><a href="' + d[4] + '" target="_blank">' + d[4] + '</a><br>' +
				'</p>';

			// var dataForReport = ["County", "Organization", "Contact Person", "Email", "Website"];
			dataForReport[0] = d[0];
			dataForReport[1] = d[1];
			dataForReport[2] = d[2];
			dataForReport[3] = d[3];
			dataForReport[4] = d[4];
		}

	});
});
}