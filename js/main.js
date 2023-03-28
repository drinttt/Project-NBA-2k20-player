/*
*    main.js
*    6.5 - Event listeners and handlers in D3
*/

const MARGIN = {LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100}
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

let time = 0
let interval
let formattedData

// Tooltip
const tip = d3.tip()
  .attr('class', 'd3-tip')
	.html(d => {
		let text = `<strong>Name :</strong> <span style='color:red;text-transform:capitalize'>${d.full_name}</span><br>`
		text += `<strong>Rating :</strong> <span style='color:red'>${d3.format(".2f")(d.rating)}</span><br>`
		text += `<strong>Jersey :</strong> <span style='color:red;text-transform:capitalize'>${d.jersey}</span><br>`
		text += `<strong>Team :</strong> <span style='color:red;text-transform:capitalize'>${d.team}</span><br>`
		text += `<strong>Position :</strong> <span style='color:red;text-transform:capitalize'>${d.position}</span><br>`
		text += `<strong>Date Birth :</strong> <span style='color:red;text-transform:capitalize'>${d.b_day}</span><br>`
		text += `<strong>Height :</strong> <span style='color:red'>${d3.format(".2f")(d.height)}</span><br>`
		text += `<strong>weight :</strong> <span style='color:red'>${d3.format(".2f")(d.weight)}</span><br>`
		text += `<strong>Salary :</strong> <span style='color:red'>${d3.format("d")(d.salary)}</span><br>`
		text += `<strong>Country :</strong> <span style='color:red;text-transform:capitalize'>${d.country}</span><br>`
		text += `<strong>College :</strong> <span style='color:red;text-transform:capitalize'>${d.college}</span><br>`
		return text
	})
g.call(tip)

// Scales
// const x = d3.scaleLog()
// 	.base(10)
// 	.range([0, WIDTH])
// 	.domain([0, 50])

const x = d3.scaleLinear()
	.range([0, WIDTH])
	.domain([40, 120])

const y = d3.scaleLinear()
	.range([HEIGHT, 0])
	.domain([45000, 45800000])

const area = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2, 10000000])
const positionColor = d3.scaleOrdinal(d3.schemeCategory10)

// Labels
const xLabel = g.append("text")
	.attr("y", HEIGHT + 50)
	.attr("x", WIDTH / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Rating")
const yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -80)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Salary ($)")
// const timeLabel = g.append("text")
// 	.attr("y", HEIGHT - 10)
// 	.attr("x", WIDTH - 40)
// 	.attr("font-size", "40px")
// 	.attr("opacity", "0.4")
// 	.attr("text-anchor", "middle")
// 	.text("70")

// X Axis
// const xAxisCall = d3.axisBottom(x)
// 	.tickValues([400, 4000, 40000])
// 	.tickFormat(d3.format("$"));
// g.append("g")
// 	.attr("class", "x axis")
// 	.attr("transform", `translate(0, ${HEIGHT})`)
// 	.call(xAxisCall)

// X New Axis
const xAxisCall = d3.axisBottom(x)
g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
	.call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall)

const positions = ["C", "C-F", "F", "F-C", "F-G", "G", "G-F" ]

const legend = g.append("g")
	.attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 125})`)

positions.forEach((position, i) => {
	const legendRow = legend.append("g")
		.attr("transform", `translate(0, ${i * 20})`)

	legendRow.append("rect")
    .attr("width", 10)
    .attr("height", 10)
		.attr("fill", positionColor(position))

	legendRow.append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .style("text-transform", "capitalize")
    .text(position)
})

d3.json("data/data.json").then(function(data){
	// // clean data
	// formattedData = data.map(Year => {
	// 	return Year["NBA"].filter(NBA => {
	// 		const dataExists = (NBA.rating && NBA.salary)
	// 		return dataExists
	// 	}).map(NBA => {
	// 		NBA.rating = Number(NBA.rating)
	// 		NBA.salary = Number(NBA.salary)
	// 		return NBA
	// 	})
	// // formattedData = data.map(d => d.NBA)

	formattedData = data.map(d=>d.NBA)
	update(formattedData[0])
	
		
	})

// 	// first run of the visualization
// 	update(formattedData[0])
// })

function step() {
	// at the end of our data, loop back
	time = (time < 214) ? time + 1 : 0
	update(formattedData[time])
}

// $("#play-button")
// 	.on("click", function() {
// 		const button = $(this)
// 		if (button.text() === "Play") {
// 			button.text("Pause")
// 			interval = setInterval(step, 100)
// 		}
// 		else {
// 			button.text("Play")
// 			clearInterval(interval)
// 		}
// 	})

// $("#reset-button")
// 	.on("click", () => {
// 		time = 0
// 		update(formattedData[0])
// 	})

$("#position-select")
	.on("change", () => {
		update(formattedData[time])
	})

function update(data) {
	// standard transition time for the visualization
	const t = d3.transition()
		.duration(100)

	const position = $("#position-select").val()

	const filteredData = data.filter(d => {
		if (position === "all") return true
		else {
			return d.position == position
		}
	})

	// JOIN new data with old elements.
	const circles = g.selectAll("circle")
		.data(filteredData, d => d.country)

	// EXIT old elements not present in new data.
	circles.exit().remove()

	// ENTER new elements present in new data.
	circles.enter().append("circle")
		.attr("fill", d => positionColor(d.position))
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.merge(circles)
		.transition(t)
			.attr("cy", d => y(d.salary))
			.attr("cx", d => x(d.rating))
			//.attr("r", d => Math.sqrt(area(d.weight) / Math.PI))
			.attr("r", d => (d.weight/20))

	// update the time label
	// timeLabel.text("ปี "+ String(time + 70))
}