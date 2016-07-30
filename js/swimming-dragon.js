var SECOND = 1000;

var SwimmingDragon = function() {
	this.startSound: new Howl({ src: ["music/ting.wav"], volume: 1.0});
}

SwimmingDragon.prototype = {
  speed: 3*SECOND,
  graph: null,
  data: [],
  stats: {
  	b: { num: 0, asum:0, sum:0, ssum:0, mx: -10000, amx: -10000, mn: 10000 },
  	g: { num: 0, asum:0, sum:0, ssum:0, mx: -10000, amx: -10000, mn: 10000 }
  },
  startSound: null,
  chart: {
  	type: "linear",
  	data: "summary",
  	interpolation: "linear", // "linear" , 
  	dataMappers: {}
  },
  callbacks: {},
  testMode="NONE"
}

function drawLine(graph, cls, data, fX, aX, fY, aY, colour, opacity)
{
	var line = d3.svg.line()
			.interpolate(linetype)
			.x(function(d) { return fX(d[aX]); })
			.y(function(d) { return fY(d[aY]); });

	graph.append("svg:path")
		.attr("d", line(data))
		.attr("class", cls)
		.attr('stroke', colour)
		.attr('stroke-width', 1)
		.attr('fill', 'none')
	    .attr('stroke-opacity', opacity);
}

function transitionLine(cls, data, fX, aX, fY, aY)
{
	var line = d3.svg.line()
			.interpolate(linetype)
			.x(function(d) { return fX(d[aX]); })
			.y(function(d) { return fY(d[aY]); });

	graph.selectAll("path."+cls).transition().duration(speed).attr("d", line(data));
}

function transitionPolar(cls, data, fX, aX, fR, aR)
{
	var polar = function(d) {
    	var r=fR(d[aR]);
    	var t=(d[aX]%360)/360*(Math.PI*2);
   		var p = { x: r*Math.cos(t)+170, y: r*Math.sin(t)+170 };
    	return p;
  	}

  	var line = d3.svg.line()
  		.interpolate(linetype)
  		.x(function(d) { return polar(d).x; })
  		.y(function(d) { return polar(d).y; });


	graph.selectAll('path.'+cls).transition().duration(speed).attr("d", line(data));
}

function drawDots(graph, cls, data, fX, aX, fY, aY, colour, opacity)
{
	graph.selectAll("dot")
	   	.data(data)
	    .enter().append("circle")
		.attr("class", cls)
		.attr('stroke', colour)
	    .attr("r", 0.7)
	    .attr("cx", function(d) { return fX(d[aX]); })
	    .attr("cy", function(d) { return fY(d[aY]); })
	    .attr('opacity', opacity);
}


function populateGraph(graph)
{	
	var h=170; //graph.attr('height')/2;
	var w=340; //graph.attr('width');
	var mxB = d3.max(data, function (d) { return d.b; });
	var mnB = d3.min(data, function (d) { return d.b; }); 
	var rangeB = Math.max(mxB, -1*mnB);
	var mxG = d3.max(data, function (d) { return d.g; });
	var mnG = d3.min(data, function (d) { return d.g; }); 
	var rangeG = Math.max(mxG, -1*mnG);

	for (var i=0; i<data.length; i++)
	{
		data[i].z=0;
		data[i].mxB=rangeB;
		data[i].mnB=rangeB*-1;
		data[i].mxA=-180;
		data[i].mnA=180;
		data[i].mxG=rangeG;
		data[i].mnG=rangeG*-1;
	}

	rangeB *= 1.1;
	rangeG *= 1.1;
	pointMappers.x   = d3.scale.linear().domain([0, data.length]).range([0, w]);
	pointMappers.yB  = d3.scale.linear().domain([ -1*rangeB,  rangeB]).range([h, 0]);
	pointMappers.rB  = d3.scale.linear().domain([ -1*rangeB,  rangeB]).range([170, 90]);
	pointMappers.yG  = d3.scale.linear().domain([ -1*rangeG,  rangeG]).range([h, 0]); 
	pointMappers.rG  = d3.scale.linear().domain([ -1*rangeG,  rangeG]).range([170, 90]); 
	pointMappers.yA  = d3.scale.linear().domain([ -185,  185]).range([2*h, h]); 

	var x=pointMappers.x;
	var y=pointMappers.yB;
	drawLine(graph, "beta beta-data", data, x, "n", y, "b",   "orange", 1.0);
	drawLine(graph, "beta beta-mx ",   data, x, "n", y, "mxB", "#666666", 1.0);
	drawLine(graph, "beta beta-z",    data, x, "n", y, "z",   "#666666", 1.0);
	drawLine(graph, "beta beta-mn",   data, x, "n", y, "mnB", "#666666", 1.0);

	x=pointMappers.x;
	y=pointMappers.yG;
	drawLine(graph, "gamma gamma-data",    data, x, "n", y, "g",   "green", 0.0);
	drawLine(graph, "gamma gamma-mx", data, x, "n", y, "mxG", "#666666", 0.0);
	drawLine(graph, "gamma gamma-z",  data, x, "n", y, "z",   "#666666", 0.0);
	drawLine(graph, "gamma gamma-mn", data, x, "n", y, "mnG", "#666666", 0.0);

	x=pointMappers.x;
	y=pointMappers.yA;
	drawDots(graph, "alpha alpha-data", data, x, "n", y, "a", "purple", 1.0)
	drawLine(graph, "alpha alpha-mx", data, x, "n", y, "mxA", "#666666", 1.0);
	drawLine(graph, "alpha alpha-z",  data, x, "n", y, "z",   "#666666", 1.0);
	drawLine(graph, "alpha alpha-mn", data, x, "n", y, "mnA", "#666666", 1.0);

	graph.selectAll('#text-beta').text(Math.max(Math.abs(statsB.mn),statsB.mx).toFixed(1));
	graph.selectAll('#text-gamma').text(Math.max(Math.abs(statsG.mn),statsG.mx).toFixed(1));
}

function hideElements()
{
	var numOpacity = (chartType=="polar") ? 1.0 : 0.0;
	if (chartData!="gamma")
	{
		$('#switch-gamma').show();
		$('#switch-beta').hide();
		graph.selectAll('#text-gamma').transition().duration(speed).attr("opacity", numOpacity);
		graph.selectAll('#text-beta').transition().duration(speed).attr("opacity", 0.0);
	} else {

		$('#switch-gamma').hide();
		$('#switch-beta').show();
		graph.selectAll('#text-gamma').transition().duration(speed).attr("opacity", 0.0);
		graph.selectAll('#text-beta').transition().duration(speed).attr("opacity", numOpacity);
	}
}

function switchToGamma()
{
	$('#stats').hide();
	$('#graphs').show();
	$('#switch-beta').show();
	$('#switch-gamma').hide();
	if (chartData=="gamma") return;
	chartData="gamma";
	hideElements();
	graph.selectAll('path.beta').transition().duration(speed).attr("stroke-opacity", 0.0);
	graph.selectAll('path.gamma').transition().duration(speed).attr("stroke-opacity", 1.0);
	graph.selectAll('path.alpha').transition().duration(speed).attr("stroke-opacity", 1.0);
	var alphaOpacity = (chartType=="polar") ? 0.0 : 1.0;
	graph.selectAll('path.alpha').transition().duration(speed).attr("stroke-opacity", alphaOpacity);
	graph.selectAll('circle.alpha').transition().duration(speed).attr("opacity", alphaOpacity);
}

function switchToBeta()
{
	$('#stats').hide();
	$('#graphs').show();
	$('#switch-beta').hide();
	$('#switch-gamma').show();
	if (chartData=="beta") return;
	chartData="beta";
	hideElements();
	graph.selectAll('path.beta').transition().duration(speed).attr("stroke-opacity", 1.0);
	graph.selectAll('path.gamma').transition().duration(speed).attr("stroke-opacity", 0.0);
	graph.selectAll('path.alpha').transition().duration(speed).attr("stroke-opacity", 1.0);
	var alphaOpacity = (chartType=="polar") ? 0.0 : 1.0;
	graph.selectAll('path.alpha').transition().duration(speed).attr("stroke-opacity", alphaOpacity);
	graph.selectAll('circle.alpha').transition().duration(speed).attr("opacity", alphaOpacity);
}

SwimmingDragon.prototype.toPolar() = function()
{
	$('#stats').hide();
	$('#graphs').show();
	$('#switch-polar').hide();
	$('#switch-linear').show();
	$('#switch-stats').show();
	if (this.chart.type=="polar") return; else this.chart.type="polar";

	this.hideWidgets();

	var x=this.chart.pointMappers.x;
	var y=this.chart.pointMappers.rB;
	transitionPolar("beta-data", data, x, "a", y, "b");
	transitionPolar("beta-mx",   data, x, "a", y, "mxB");
	transitionPolar("beta-z",    data, x, "a", y, "z");
	transitionPolar("beta-mn",   data, x, "a", y, "mnB");

	x=this.chart.pointMappers.x;
	y=this.chart.pointMappers.rG;
	transitionPolar("gamma-data",    data, x, "a", y, "g");
	transitionPolar("gamma-mx", data, x, "a", y, "mxG");
	transitionPolar("gamma-z",  data, x, "a", y, "z");
	transitionPolar("gamma-mn", data, x, "a", y, "mnG");

	graph.selectAll('path.alpha').transition().duration(speed).attr("stroke-opacity", 0.0);
	graph.selectAll('circle.alpha').transition().duration(speed).attr("opacity", 0.0);
}

SwimmingDragon.prototype.toLinear() = function()
{
	$('#stats').hide();
	$('#graphs').show();
	$('#switch-polar').show();
	$('#switch-linear').hide();
	$('#switch-stats').show();
	if (this.chart.type=="linear") return; else this.chart.type="linear";

	this.hideWidgets();

	var x=this.chart.pointMappers.x;
	var y=this.chart.pointMappers.yB;
	transitionLine("beta-data", data, x, "n", y, "b");
	transitionLine("beta-mx",   data, x, "n", y, "mxB");
	transitionLine("beta-z",    data, x, "n", y, "z");
	transitionLine("beta-mn",   data, x, "n", y, "mnB");

	x=this.chart.pointMappers.x;
	y=this.chart.pointMappers.yG;
	transitionLine("gamma-data",  data, x, "n", y, "g");
	transitionLine("gamma-mx",    data, x, "n", y, "mxG");
	transitionLine("gamma-z",     data, x, "n", y, "z");
	transitionLine("gamma-mn",    data, x, "n", y, "mnG");

	this.graph.selectAll('path.alpha').transition().duration(speed).attr("stroke-opacity", 1.0);
	this.graph.selectAll('circle.alpha').transition().duration(speed).attr("opacity", 1.0);
	this.graph.selectAll('#text-gamma').transition().duration(speed).attr("opacity", 0.0);
	this.graph.selectAll('#text-beta').transition().duration(speed).attr("opacity", 0.0);
}

SwimmingDragon.prototype.toStats() = function()
{
	$('#stats').show();
	$('#graphs').hide();

	$('#switch-gamma').hide();
	$('#switch-beta').hide();
	
	$('#switch-polar').show();
	$('#switch-linear').show();
	$('#switch-stats').hide();
	$('#switch-alpha').hide();
	$('#switch-beta').hide();
	if (this.chart.data=="stats") return; else this.chart.data="stats";
}


SwimmingDragon.prototype.updateStats = function(id1, id2, stats, v, alpha)
{
	if (v > stats.mx) { stats.mx=v; }
	if (v < stats.mn) { stats.mn=v; }
	stats.num++;
	stats.sum+=v;
	stats.ssum+=v*v;
	stats.asum+=Math.abs(v);
	stats.amx=Math.max(stats.mx, -1*stats.mn);
	$(id1 + ' div').text(Math.round(stats.amx));
	var ac=100;
	var av=(stats.sum/stats.num)
	var sd=Math.sqrt((stats.ssum/stats.num)-av*av);

	$(".stats .min " + id2).text(stats.mn.toFixed(2));
	$(".stats .max " + id2).text(stats.mx.toFixed(2));
	$(".stats .avg " + id2).text(av.toFixed(2));
	$(".stats .sd " + id2).text(sd.toFixed(2));
	$(".stats .aavg " + id2).text((stats.asum/stats.num).toFixed(2));
}


SwimmingDragon.prototype.phoneMove = function(event) {
	// Make sure value in range [-180,180
	 var alpha = (event.alpha > 180) ? event.alpha-360 : event.alpha;

     var count=data.length;
     var d = { a:alpha, b: event.beta, g:event.gamma, n: count };
     data.push(d);

     this.updateStats("#gB", ".b", this.stats.b, event.beta,  alpha);
     this.updateStats("#gG", ".g", this.stats.b, event.gamma, alpha);
}

SwimmingDragon.prototype.start = function()
{
	var self=this;
	console.log("START");

	this.data = [];
	this.stats.b = { num: 0, asum:0, sum:0, ssum:0, mx: -10000, amx: -10000, mn: 10000 };
	this.stats.g = { num: 0, asum:0, sum:0, ssum:0, mx: -10000, amx: -10000, mn: 10000 };
	chart.type="linear";
	chart.data="stats";
	
	$('#working').show();
	$('#working svg').css("webkitAnimationPlayState", "running");
	$('#stats').hide();
	$('#graphs').show();
	$('#buttons').hide();

	sound.play();
	this.callbacks.deviceorientation = function(e) { self.phoneMove(e); };
	window.addEventListener("deviceorientation", this.callbacks.deviceorientation);
}

SwimmingDragon.prototype.stop = function()
	console.log("STOP");
	$("#graphs").css("height", "690px")
	$("#graphs").css("width", "340px");
	$('#working').hide();
	$('#working svg').css("webkitAnimationPlayState", "paused");

	this.graph = d3.select("#graphs").append("svg:svg")
		.attr("id", "sd-vis")
		.attr("width", 340)
		.attr("height", 340)
		.append("svg:g");

	 this.graph.append("text")
	 	.attr("id", "text-gamma")
	 	.attr("x", 170)
    	.attr("y", 170)
    	.attr("dy", ".35em")
    	.attr('font-size', '4em')
    	.attr('fill', '#cccccc')
    	.attr('stroke', '#cccccc')
    	.style("text-anchor", "middle")
	    .attr('opacity', 0)
    	.text("99");

     this.graph.append("text")
	 	.attr("id", "text-beta")
	 	.attr("x", 170)
    	.attr("y", 170)
    	.attr("dy", ".35em")
    	.attr('font-size', '4em')
    	.attr('fill', '#cccccc')
    	.attr('stroke', '#cccccc')
    	.style("text-anchor", "middle")
	    .attr('opacity', 0)
    	.text("88");



	$('#stats').show();
	$('#graphs').hide();
	$('#buttons').show();
	this.toStats();

	this.populate();
	sound.play();
	window.removeEventListener("deviceorientation", this.callbacks.deviceorientation);
}

SwimmingDragon.prototype.prepare = function()
{
	var self=this;
	console.log("PREPARE");
	$("#sd-vis").remove();

	$('#stats').hide();
	$('#graphs').show();
	$('#buttons').hide();

	$('#working').hide();
	$('#working').fadeIn(5*s);
	$('#working svg').css("webkitAnimationPlayState", "paused");

	
	window.setTimeout(
		var startDelay = 5*SECOND;
		var practiceTime = 2*SECOND;
		function() { 
			self.start();
			window.setTimeout(function() { self.stop(); }, practiceTime);
		}, startDelay);
}

SwimmingDragon.prototype.init = function() {
	var self=this;

	$( document ).on("change" , function(e, data) { self.prepare(); });

	$('#working').hide();
	$('#stats').hide();
	$('#graph').show();
	$('#buttons').hide();

	$('#switch-linear').click(function(e, data) { self.toLinear(); });
	$('#switch-polar').click(function(e, data) { self.toPolar(); });
	$('#switch-beta').click(function(e, data) { self.toBeta(); });
	$('#switch-gamma').click(function(e, data) { self.toGamma(); });
	$('#switch-stats').click(function(e, data) { self.toStats(); });
	$('#restart').click(function(e, data) { self.prepare(); });
}