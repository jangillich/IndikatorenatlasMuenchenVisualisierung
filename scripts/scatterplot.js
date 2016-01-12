var margin = {top: 60, right: 60, bottom: 60, left: 60},
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
    color = d3.scale.category10();

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
var checkedYears = {
	"2002": true,
	"2004": true,
	"2005": true,
	"2006": true,
	"2007": true,
	"2008": true,
	"2009": true,
	"2010": true,
	"2011": true};
var names = ['auslaender', 'einpersonen', 'lebenserwartung', 'dichte', 'arbeitslosenquote', 'alter', 'pkws'];
var axisDescriptions = [
  'Ausländeranteil in %',
  'Anteil Einpersonenhaushalte in %',
  'Durschnittliche Lebenserwartung (Jahre)',
  'Anzahl Einwohner/qkm',
  'Arbeitslosenquote in %',
  'Durschnittsalter (Jahre)',
  'Private Kraftfahrzeugdichte'];

d3.csv("preprocessing/results/data.csv", function(data){
  theData = data;
  drawGraph();
});

function updateScatterplot(x,y){
  xIndex = x;
  yIndex = y;
  updateGraph();
  $("#dropdownMenuXData .dropdownLabel").html(names[xIndex]);
  $("#dropdownMenuYData .dropdownLabel").html(names[yIndex]);
}

function updateGraph()
{
  //svg.selectAll("*").remove();
  //drawGraph();
  xScale.domain([d3.min(theData, xValue) * 0.95, d3.max(theData, xValue) * 1.05]);
  yScale.domain([d3.min(theData, yValue) * 0.95, d3.max(theData, yValue) * 1.05]);
  var mySVG = d3.select("#scatterplot").transition();
  mySVG.selectAll(".dot")
      .duration(500)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("fill-opacity", function(d){
      	if(checkedYears[d.jahr])
      		return 1;
      	else
      		return 0; })
      .attr("stroke-opacity", 0);
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
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.id + ", " + d.jahr + "<br/> (" + xValue(d) 
          + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
}