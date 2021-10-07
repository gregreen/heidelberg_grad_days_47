(function () {
"use strict";

function init_plot() {
  // Determine overall dimensions of plot
  var svg = d3.select("#gp-scatterplot");
  var view_box = svg.attr("viewBox").split(" ").slice(2);
  var svg_width = view_box[0],
      svg_height = view_box[1];

  var margins = {
    "left": 0.02 * svg_width,
    "right": 0.02 * svg_width,
    "bottom": 0.02 * svg_width,
    "top": 0.02 * svg_width
  };

  // Convert between data (x, y) and SVG coordinates
  var scale_x = d3.scale.linear()
    .domain([0, 1])
    .range([margins.left, svg_width-margins.right]);

  var scale_y = d3.scale.linear()
    .domain([0, 1])
    .range([svg_height-margins.top, margins.bottom]);

  // Add groups in correct order
  var main_group = svg.selectAll("#plot-main-group").data([null])
    .enter()
      .append("g")
        .attr("id", "plot-main-group");

  // Add background points
  var n_points = 50;
  var point_xy = d3.range(n_points).map(function() {
    return {"x": Math.random(), "y": Math.random()};
  });

  main_group.append("g")
      .attr("id", "gp-point-group")
    .selectAll(".gp-point")
      .data(point_xy)
    .enter()
      .append("circle")
        .attr("class", "gp-point")
        .attr("r", 5)
        .attr("cx", function(d) { return scale_x(d.x); })
        .attr("cy", function(d) { return scale_y(d.y); });
  
  // Isolated point
  main_group.select("#gp-point-group")
    .selectAll("#gp-point-isolated")
      .data(d3.range(1).map(function(d) {
        return {"x": 0.25+0.05*(Math.random()-0.5),
                "y": 0.85+0.05*(Math.random()-0.5)};
      }))
    .enter()
      .append("circle")
        .attr("class", "gp-point")
        .attr("id", "gp-point-isolated")
        .attr("r", 5)
        .attr("cx", function(d) { return scale_x(d.x); })
        .attr("cy", function(d) { return scale_y(d.y); });
  
  // Pair of close points
  main_group.select("#gp-point-group")
    .selectAll("#gp-point-close")
      .data(d3.range(2).map(function(d) {
        return {"x": 0.03*d+0.4+0.01*(Math.random()-0.5),
                "y": 0.03*d+0.5+0.01*(Math.random()-0.5)};
      }))
    .enter()
      .append("circle")
        .attr("class", "gp-point")
        .attr("id", "gp-point-close")
        .attr("r", 5)
        .attr("cx", function(d) { return scale_x(d.x); })
        .attr("cy", function(d) { return scale_y(d.y); });

  // Pair of distant points
  main_group.select("#gp-point-group")
    .selectAll("#gp-point-far")
      .data(d3.range(2).map(function(d) {
        return {"x": 0.7*(1-d)+0.1+0.05*(Math.random()-0.5),
                "y": 0.7*d+0.1+0.05*(Math.random()-0.5)};
      }))
    .enter()
      .append("circle")
        .attr("class", "gp-point")
        .attr("id", "gp-point-far")
        .attr("r", 5)
        .attr("cx", function(d) { return scale_x(d.x); })
        .attr("cy", function(d) { return scale_y(d.y); });
}

// Listeners
$(document).ready(function() {
  // Listener to initialize plot
  var plot_initialized = false;
  Reveal.addEventListener("gp-scatterplot-slide", function() {
    if(!plot_initialized) {
      init_plot();
      plot_initialized = true;
    }
  }, false);
  
  // Fragment listeners
  Reveal.addEventListener("fragmentshown", function(event) {
    if(event.fragment.id == "gp-fragment-isolated") {
      d3.selectAll("#gp-point-isolated").classed("gp-point-highlighted", true);
    } else if(event.fragment.id == "gp-fragment-close") {
      d3.selectAll("#gp-point-close").classed("gp-point-highlighted", true);
      d3.selectAll("#gp-point-isolated").classed("gp-point-highlighted", false);
    } else if(event.fragment.id == "gp-fragment-far") {
      d3.selectAll("#gp-point-far").classed("gp-point-highlighted", true);
      d3.selectAll("#gp-point-close").classed("gp-point-highlighted", false);
    }
  });
  
  Reveal.addEventListener("fragmenthidden", function(event) {
    if(event.fragment.id == "gp-fragment-isolated") {
      d3.selectAll("#gp-point-isolated").classed("gp-point-highlighted", false);
    } else if(event.fragment.id == "gp-fragment-close") {
      d3.selectAll("#gp-point-isolated").classed("gp-point-highlighted", true);
      d3.selectAll("#gp-point-close").classed("gp-point-highlighted", false);
    } else if(event.fragment.id == "gp-fragment-far") {
      d3.selectAll("#gp-point-close").classed("gp-point-highlighted", true);
      d3.selectAll("#gp-point-far").classed("gp-point-highlighted", false);
    }
  });
});

})();
