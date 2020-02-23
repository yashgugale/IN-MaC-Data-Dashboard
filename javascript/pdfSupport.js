var reportGenerationButton = document.getElementById("report_generation");
reportGenerationButton.addEventListener("click", generateReport);


// Wait for inner function to finish:
async function SVGUri(svgNode)
{
	// console.log("1: ");
	// Finish this function:
	await svgAsDataUri(d3.select(svgNode).node()).then(uri => {
		// console.log("2 uri: ", uri);
		// console.log("3: SVGAsDataUri called")
		allSVGUri.push(uri);
	});
	// console.log(allSVGUri.length);
	// console.log("4: called async")
}



// Finish this function:
function convertURIToImageData(URI) {
	// console.log("6: ConvertURIToImageData called")

	return new Promise(function(resolve, reject) {
		if (URI == null) return reject();
		var canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			image = new Image();

		image.addEventListener('load', function() {
			canvas.width = image.width;
			canvas.height = image.height;
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
				
			let imgData = canvas.toDataURL('image/png');
			all_imgs.push(imgData);
			// console.log(imgData);
			
			resolve(context.getImageData(0, 0, canvas.width, canvas.height));
		}, false);
		image.src = URI;
	});
};
