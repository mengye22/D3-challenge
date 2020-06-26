// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight)

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(healthData) {


    healthData.forEach(data =>{ 
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;});

    var xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare)*0.8,
            d3.max(healthData, d => d.healthcare)*1.1])
        .range([0,width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty)*0.8,
            d3.max(healthData, d => d.poverty)*1.1])
        .range([height,0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx",d => xScale(d.healthcare))
        .attr("cy",d => yScale(d.poverty))
        .attr("r","12")
        .attr("fill","lightblue")
        .attr("opacity","5")
        
    chartGroup.append("g")
        .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .attr("dx",d => xScale(d.healthcare))
        .attr("dy",d => yScale(d.poverty))
        .text(d => d.abbr)
        .attr("text-anchor","middle")
        .attr("fill","white")
        .attr("font-size","12px")


    
    // var toolTip = d3.tip()
    //     .attr("class","tooltip")
    //     .offset([80,-60])
    //     .html(function(d) {
    //         return (`HealthCare:${d.healthcare}<br>Poverty:${d.poverty}`);
    //     });

    // chartGroup.call(toolTip);

    // circlesGroup.on("click", data =>{
    //     toolTip.show(data,this);
    // })
    // .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });

    chartGroup.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0 - margin.left + 40)
        .attr("x",0 - (height/2))
        .attr("dy","1em")
        .attr("class","axisText")
        .text("Healthcare (%)")

    chartGroup.append("text")
        .attr("transform",`translate(${width/2},${height+margin.top+30})`)
        .attr("class","axisText")
        .text("In Poverty(%)")

}).catch(function(error) {
    console.log(error);
  });

