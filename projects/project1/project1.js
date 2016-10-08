(function() {
	var margin = { top: 30, left: 50, right: 30, bottom: 30},
	height = 400 - margin.top - margin.bottom,
	width = 600 - margin.left - margin.right;

  var svg = d3.select("#line-chart")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create scales
	var xPositionScale = d3.scaleLinear().domain([2001,2013]).range([0, width-100]);
	var yPositionScale = d3.scaleLinear().domain([10000,60000]).range([height, 0]);

	var line = d3.line()
		.x(function(d) {
			return xPositionScale(d.year);
		})
		.y(function(d) {
			return yPositionScale(d.value);
		})

	d3.queue()
    .defer(d3.csv, "tuition-medianincome.csv")
    .await(ready);

	function ready(error,datapoints) {
		var nested = d3.nest()
      .key( function(d) {
        return d.variable;
      })
      .entries(datapoints);

    console.log(nested);

		// Draw dots
		svg.selectAll(".circle")
			.data(datapoints)
			.enter().append("circle")
			.attr("class", "circle")
			.attr("r", 2)
			.attr("fill", function(d) {
				if(d.variable == 'medianincome'){return "STEELBLUE"}
				else{return "DARKORANGE"}
			})
			.attr("cx", function(d) {
				return xPositionScale(d.year)
			})
			.attr("cy", function(d) {
				return yPositionScale(d.value)
			});

		// Draw lines
		svg.selectAll(".variable-lines")
		      .data(nested)
		      .enter().append("path")
		      .attr("d", function(d) {
		        return line(d.values)
		      })
		      .attr("fill", "none")
		      .attr("stroke", function(d) {
						if(d.key == 'medianincome'){return "STEELBLUE"}
						else{return "DARKORANGE"}
					})

    // add text
		svg.selectAll("text")
			.data(nested)
			.enter().append("text")
			.attr("y", function(d) {
				var lastDataPoint = d.values[d.values.length-1];
				return yPositionScale(lastDataPoint.value)-15
			})
			.attr("x", width-120)
			.text(function(d) {
						if(d.key == 'medianincome'){return "Median Household Income"}
						else{return "Public College Tuition"}
			})
			.attr("dy", 5)
			.attr("dx", 4)
			.attr("fill",function(d){
				if(d.key == 'medianincome'){return "STEELBLUE"}
				else{return "DARKORANGE"}
			})
			.attr("font-size", 12)

		// Add axes
		var xAxis = d3.axisBottom(xPositionScale)
		svg.append("g")
			.attr("class", "axis x-axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		var yAxis = d3.axisLeft(yPositionScale);
		svg.append("g")
			.attr("class", "axis y-axis")
			.call(yAxis);
  	}
})();
