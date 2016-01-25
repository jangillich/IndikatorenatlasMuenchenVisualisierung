var margin = {top: 10, right: 60, bottom: 60, left: 60},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return parseFloat(d[names[xIndex]]);}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return parseFloat(d[names[yIndex]]);}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.jahr;},
    color = d3.scale.ordinal()
  .range(["#16a085", "#2cc36b" , "#2980b9", "#9b59b6", "#f39c12", "#f1c40f", "#e74c3c", "#7f8c8d", "#795548"]);//flatuicolors.com

var dataTitle = function(d){
          var t = idToName[d.id] + ', '+ d.jahr + "<br>" +
           fullNames[xIndex] + ': ' + xValue(d) + "<br>" + 
           fullNames[yIndex] + ': ' + yValue(d);
           return t;
        };

// add the graph canvas to the body of the webpage
var svg = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var xIndex = 0;
var yIndex = 0;
var theData;

d3.csv("preprocessing/results/data.csv", function(data){
  theData = data;
  drawGraph();
  updateScatterplot(0,1);
});

function updateScatterplot(x,y){
  xIndex = x;
  yIndex = y;
  updateGraph();
  $("#dropdownMenuXData .dropdownLabel").html(fullNames[xIndex]);
  $("#dropdownMenuYData .dropdownLabel").html(fullNames[yIndex]);
  updateCorrmat();
}

function updateGraph()
{
  xScale.domain([d3.min(theData, xValue) * 0.95, d3.max(theData, xValue) * 1.05]);
  yScale.domain([d3.min(theData, yValue) * 0.95, d3.max(theData, yValue) * 1.05]);
  var mySVG = d3.select("#scatterplot").transition();
  mySVG.selectAll(".dot")
      .duration(500)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("title", dataTitle)
      .attr("fill-opacity", function(d){
      	if(checkedYears[d.jahr])
      		return 0.8;
      	else
      		return 0; });
  mySVG.select(".x.axis") // change the x axis
            .duration(1)
            .call(xAxis)
            .select(".label")
            .text(axisDescriptions[xIndex]);
  mySVG.select(".y.axis") // change the y axis
            .duration(1)
            .call(yAxis)
            .select(".label")
            .text(axisDescriptions[yIndex]);
}

 
function drawGraph(){
  xScale.domain([d3.min(theData, xValue)-0.5, d3.max(theData, xValue)+0.5]);
  yScale.domain([d3.min(theData, yValue)-0.5, d3.max(theData, yValue)+0.5]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(axisDescriptions[xIndex]);

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(axisDescriptions[yIndex]);

  // draw dots
  svg.selectAll(".dot")
      .data(theData)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("stroke-opacity", 0)
      .attr("title", dataTitle)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          $(this).tooltip({
                      'container': 'body',
                      'placement': 'top',
                      'html': true
                  });
           $(this).tooltip('show');
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width + 6)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .attr("stroke-opacity", 0)
      .style("stroke", "none");

  // draw legend text
  legend.append("text")
      .attr("x", width + 28)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d;})
}