var abbrevs = ['AA', 'EH', 'LE', 'ED', 'AQ', 'DA', 'PD'];

d3.csv("preprocessing/results/correlation.csv", function(error, rows) {
      var data = [];
      rows.forEach(function(d) {
        var x = d[""];
        delete d[""];
        for (prop in d) {
          var y = prop,
            value = d[prop];
          data.push({
            x: x,
            y: y,
            value: +value
          });
        }
      });

      var margin = {
          top: 0,
          right: 0,
          bottom: 50,
          left: 0
        },
        width = 300 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        domain = d3.set(data.map(function(d) {
          return d.x
        })).values(),
        num = Math.sqrt(data.length),
        color = d3.scale.linear()
          .domain([-1, 0, 1])
          .range(["#aa1111", "#eee", "#1111aa"]),
        radScale = function(d){
          d = d * d;
          var s = d3.scale.linear()
        .domain([0, 1])
        .range([0.7, 1]);
        return s(d);
        };

      var offsetX = width / (2.0 * domain.length);
      var offsetY = height / (2.0 * domain.length);
      var x = d3.scale
        .ordinal()
        .rangePoints([offsetX, width - offsetX])
        .domain(domain),
      y = d3.scale
        .ordinal()
        .rangePoints([offsetY, height - offsetY])
        .domain(domain),
      xSpace = x.range()[1] - x.range()[0],
      ySpace = y.range()[1] - y.range()[0];

      console.log(x);
      console.log(y);

      var svg = d3.select("#corrmat")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var cor = svg.selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function(d) {
          return "translate(" + (x(d.x) + 0 )+ "," + (y(d.y) + 0) + ")";
        });
        
      cor.append("rect")
        .attr("width", xSpace)
        .attr("height", ySpace)
        .attr("x", -xSpace / 2)
        .attr("y", -ySpace / 2)

      cor.filter(function(d){
          var ypos = domain.indexOf(d.y);
          var xpos = domain.indexOf(d.x);
          for (var i = (ypos + 1); i < num; i++){
            if (i === xpos) return false;
          }
          return true;
        })
        .append("text")
        .attr("y", 5)
        .text(function(d) {
          if (d.x === d.y) {
            return abbrevs[names.indexOf(d.x)];
          } else {
            return d.value.toFixed(2);
          }
        })
        .style("fill", function(d){
          if (d.value === 1) {
            return "#000";
          } else {
            return color(d.value);
          }
        })
        .attr("title", function(d) {
          if (d.x === d.y) {
            return fullNames[names.indexOf(d.x)];
          } else {
            return d.value.toFixed(2);
          }
        })
        .on("mouseover", function(d) {
                $(this).tooltip({
                    'container': 'body',
                    'placement': 'top',
                    'html': true
                });
                 $(this).tooltip('show')
        });

        cor.filter(function(d){
          var ypos = domain.indexOf(d.y);
          var xpos = domain.indexOf(d.x);
          for (var i = (ypos + 1); i < num; i++){
            if (i === xpos) return true;
          }
          return false;
        })
        .append("circle")
        .attr("r", function(d){
          return (width / (num * 2) - 5) * radScale(d.value);
        })
        .attr("title", function(d){
          var ypos = domain.indexOf(d.y);
          var xpos = domain.indexOf(d.x);
          return fullNames[xpos] + "<br>" + fullNames[ypos];
        })
        .style("fill", function(d){
          if (d.value === 1) {
            return "#000";
          } else {
            return color(d.value);
          }
        })
        .on("click", function(d){
          updateScatterplot(names.indexOf(d.x), names.indexOf(d.y))
        })
        .on("mouseover", function(d) {
                this.style.strokeWidth = 3;
                this.style.stroke = "#333";
               
                $(this).tooltip({
                    'container': 'body',
                    'placement': 'top',
                    'html': true
                });
                 $(this).tooltip('show');
      })
      .on("mouseout", function(d) {
                this.style.strokeWidth = 0;
      });;
        
    var aS = d3.scale
      .linear()
      .range([offsetX, width - offsetX])
      .domain([-1, 1]);

    var yA = d3.svg.axis()
      .orient("bottom")
      .scale(aS)
      .ticks(5)
      .tickPadding(5);

    var aG = svg.append("g")
      .attr("class", "y axis")
      .call(yA)
      .attr("transform", "translate(0," + (height + margin.bottom / 2) + " )")

    var iR = d3.range(-1.01, 1.0, 0.01);
    var w = width / iR.length + 1;
    iR.forEach(function(d){
        aG.append('rect')
          .style('fill',color(d))
          .style('stroke-width', 0)
          .style('stoke', 'none')
          .attr('height', 10)
          .attr('width', w)
          .attr('x', aS(d))
          .attr('y', 0)
      });
    });