// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 90,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(healthData,chosenXAxis){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData,d => d[chosenXAxis])*0.8,
            d3.max(healthData,d => d[chosenXAxis])*1.2])
        .range([0,width]);
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(healthData,chosenYAxis){
    var yLinearScale= d3.scaleLinear()
        .domain([d3.min(healthData,d => d[chosenYAxis])*0.8,
            d3.max(healthData,d => d[chosenYAxis])*1.2])
        .range([height,0]);
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale,xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale,yAxis){
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, chosenXAxis, newXScale, chosenYAxis, newYScale) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]))
  
    return circlesGroup;
  }

// function used for updating circles group with a transition to new text
function renderText(circlesText, chosenXAxis, newXScale, chosenYAxis, newYScale) {

    circlesText.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis]))
  
    return circlesText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis,circlesGroup){
    var xlabel;
    var ylabel;
    // function used for updating circles group with new tooltip for x-axis
    if(chosenXAxis === "poverty"){
        xlabel = "Poverty";
    }
    else if(chosenXAxis === "age"){
        xlabel = "Age";
    }
    else{
        xlabel = "Household Income"
    }
    // function used for updating circles group with new tooltip for y-axis
    if(chosenYAxis === "obesity"){
        ylabel = "Obess";
    }
    else if(chosenYAxis === "smokes"){
        ylabel = "Smokes";
    }
    else{
        ylabel = "Lacks Healthcare"
    }

    var toolTip = d3.tip()
        .attr("class","tooltip")
        .style("background", "black")
        .style("color", "white")
        .offset([80,-60])
        .html(function(d) {
            if(chosenXAxis == "age"){
                return (`${d.state}<br>${xlabel}:${d[chosenXAxis]}<br>${ylabel}:${d[chosenYAxis]}%`);
            }
            else if(chosenXAxis == "income"){
                return (`${d.state}<br>${xlabel}:${d[chosenXAxis]}<br>${ylabel}:${d[chosenYAxis]}%`);
            }
            else{
                return (`${d.state}<br>${xlabel}:${d[chosenXAxis]}%<br>${ylabel}:${d[chosenYAxis]}%`);
            }
        });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", data => {
            toolTip.show(data);
            })
            .on("mouseout",(data,index) => {
                toolTip.hide(data);
            });

        return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(healthData,err) {
    if (err) throw err;
    
    // parse data
    healthData.forEach(data =>{ 
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes
    });

    // x and y linearscale function above csv import
    var xLinearScale = xScale(healthData,chosenXAxis);
    var yLinearScale = yScale(healthData,chosenYAxis);

    // create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis",true)
        .call(leftAxis)

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx",d => xLinearScale(d[chosenXAxis]))
        .attr("cy",d => yLinearScale(d[chosenYAxis]))
        .attr("r",12)
        .attr("fill","blue")
        .attr("opacity",".5")
    
    var circlesText = chartGroup.append("g")
        .selectAll()
        .data(healthData)
        .enter()
        .append("text")
        .attr("dx",d => xLinearScale(d[chosenXAxis]))
        .attr("dy",d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)
        .attr("text-anchor","middle")
        .attr("fill","white")
        .attr("font-size","12px")

      // Create group for x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value","poverty")
        .classed("active",true)
        .text("In Poverty(%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x",0)
        .attr("y",40)
        .attr("value","age")
        .classed("inactive",true)
        .text("Age(Median)")

    var incomelabel = xlabelsGroup.append("text")
        .attr("x",0)
        .attr("y",60)
        .attr("value","income")
        .classed("inactive",true)
        .text("Household Income(Median)")

    // Create group for y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform","rotate(-90)");

    var obessLabel = ylabelsGroup.append("text")
        .attr("y",0 - margin.left + 20)
        .attr("x",0 - (height/2))
        .attr("value","obesity")
        .classed("active",true)
        .text("Obess(%)")

    var smokeLabel = ylabelsGroup.append("text")
        .attr("y",0 - margin.left + 40)
        .attr("x",0 - (height/2))
        .attr("value","smokes")
        .classed("inactive",true)
        .text("Smokes(%)")

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y",0 - margin.left + 60)
        .attr("x",0 - (height/2))
        .attr("value","healthcare")
        .classed("inactive",true)
        .text("Lacks Healthcare(%)")

    var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click",function(){
            // get value of selection
            var value = d3.select(this).attr("value");
            if(value !== chosenXAxis){
                // replaces chosenXAxis with value
                chosenXAxis = value;
                // update x scale for new data
                xLinearScale = xScale(healthData,chosenXAxis);
                // update x axis with transition
                xAxis = renderXAxes(xLinearScale,xAxis);
                // update circles with new x values
                circlesGroup = renderCircles(circlesGroup, chosenXAxis, xLinearScale, chosenYAxis, yLinearScale);
                // update circles text with new x values
                circlesText = renderText(circlesText,chosenXAxis, xLinearScale, chosenYAxis, yLinearScale);
                // update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
        

                // changes classed to change bold text
                if (chosenXAxis === "poverty"){
                    povertyLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    ageLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    incomelabel
                        .classed("active",false)
                        .classed("inactive",true);
                }
                else if(chosenXAxis === "age"){
                    povertyLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    ageLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    incomelabel
                        .classed("active",false)
                        .classed("inactive",true);
                }
                else{
                    povertyLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    ageLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    incomelabel
                        .classed("active",true)
                        .classed("inactive",false);
                }
            }
        });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click",function(){
        // get value of selection
        var value = d3.select(this).attr("value");
        if(value !== chosenYAxis){
            // replaces chosenYAxis with value
            chosenYAxis = value;

            console.log(chosenYAxis);
            // update y scale for new data
            yLinearScale = yScale(healthData,chosenYAxis);
            // update y axis with transition
            yAxis = renderYAxes(yLinearScale,yAxis);

            // update circles with new y values
            circlesGroup = renderCircles(circlesGroup, chosenXAxis, xLinearScale, chosenYAxis, yLinearScale);
            // update circles text with new y values
            circlesText = renderText(circlesText,chosenXAxis, xLinearScale, chosenYAxis, yLinearScale);
            // update tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

            // changes classed to change bold text
            if (chosenYAxis === "obesity"){
                obessLabel
                    .classed("active",true)
                    .classed("inactive",false);
                smokeLabel
                    .classed("active",false)
                    .classed("inactive",true);
                healthcareLabel
                    .classed("active",false)
                    .classed("inactive",true);
            }
            else if(chosenYAxis === "smokes"){
                obessLabel
                    .classed("active",false)
                    .classed("inactive",true);
                smokeLabel
                    .classed("active",true)
                    .classed("inactive",false);
                healthcareLabel
                    .classed("active",false)
                    .classed("inactive",true);
            }
            else{
                obessLabel
                    .classed("active",false)
                    .classed("inactive",true);
                smokeLabel
                    .classed("active",false)
                    .classed("inactive",true);
                healthcareLabel
                    .classed("active",true)
                    .classed("inactive",false);
            }
        }
    });

    
}).catch(function(error){
    console.log(error);
});


