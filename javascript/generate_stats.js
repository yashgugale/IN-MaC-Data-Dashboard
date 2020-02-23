var statsData;

function computeMode(data)
{
	// as result can be bimodal or multi-modal, the returned result is provided as an array:
    var modes = []; 
    var count = []; 
    var i; 
    var number;
    var maxIndex = 0;

    for (i = 0; i < data.length; i++) {
        number = data[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }

    return modes;
}

function computeStats(data)
{
	var plainData = [];
	for(var i = 0; i < data.length; i++){
		plainData.push(data[i][1]);
	}

	var meanVal = d3.mean(plainData);
	var medianVal = d3.median(plainData);
	var modeVal = computeMode(plainData);

	return {
		mean : meanVal,
		median : medianVal,
		mode : modeVal,
	};
}

function createRegionStats(regionDataset)
{
	statsData = computeStats(regionDataset);
	regionMeanElement.innerHTML = "Region Mean : " + d3.format(".2s")(statsData.mean);
	regionMedianElement.innerHTML = "Region Median : " + d3.format(".2s")(statsData.median);
	regionModeElement.innerHTML = "Region Mode : " + statsData.mode.join(", ");		// Separate multi-modal data by comma
}