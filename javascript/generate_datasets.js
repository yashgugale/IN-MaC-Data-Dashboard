// Needs to be called every time:
function generateSingleCountyData(county_name, region_id, barGraphDataset)
{
	// Store the data for the bar graph region:
	var region_dataset = [];
	// Obtain the keys to index into the main Indiana dataset that we created that stores the counties and count values:
	var keys = Object.keys(barGraphDataset[region_id-1]);
	// Update the data:
	for(var i = 0; i < Object.keys(barGraphDataset[region_id-1]).length; i++){
		region_dataset.push([keys[i] , barGraphDataset[region_id-1][keys[i]]]);
	}

	return region_dataset;
}

// Needs to be called every time:
function generate92CountiesData(barGraphDataset)
{
	var all92CountiesDataset = [];
	for(var i = 0; i < 12; i++)
	{
		for(key in barGraphDataset[i])
			if(barGraphDataset[i].hasOwnProperty(key))
			{
				// Store all the counties and the count of schools in an array to use as data for the bar graph:
				all92CountiesDataset.push([key, barGraphDataset[i][key]]);
			}
	}


	return all92CountiesDataset;
}

// Needs to be called every time:
function generateRegionData(barGraphDataset)
{
	var allRegionCount = [];
	var allRegionPercent = [];
	for(var i = 0; i < 12; i++)
	{
		var keys = Object.keys(barGraphDataset[i]);
		var sum = 0;
		// Update the data:
		for(var j = 0; j < Object.keys(barGraphDataset[i]).length; j++){
			sum += barGraphDataset[i][keys[j]];
		}
		allRegionCount.push(sum);
	}

	sum = 0;
	// Compute the percents:
	allRegionCount.forEach(function(d){
		sum += d;
	});

	allRegionCount.forEach(function(d, i){
		region_percent = d/sum;
		allRegionPercent.push([i+1, d, region_percent]);
	});	
	return allRegionPercent;
}