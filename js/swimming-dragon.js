var SECOND = 1000;

var SwimmingDragon = function(spinner) {
	this.startSound = new Howl({ src: ["music/ting.wav"], volume: 1.0});
	this.init();
	this.spinner = spinner;
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
  	type: "summary", // summary | polar | linear
  	data: "summary", // beta | gamma
  	interpolation: "linear", // "linear" , 
  	dataMappers: {}
  },
  callbacks: {},
  testMode: "NONE"
}

SwimmingDragon.prototype.drawLine = function(cls, fX, aX, fY, aY, colour, opacity)
{
	var line = d3.svg.line()
			.interpolate(this.chart.interpolation)
			.x(function(d) { return fX(d[aX]); })
			.y(function(d) { return fY(d[aY]); });

	this.graph.append("svg:path")
		.attr("d", line(this.data))
		.attr("class", cls)
		.attr('stroke', colour)
		.attr('stroke-width', 1)
		.attr('fill', 'none')
	    .attr('stroke-opacity', opacity);
}

SwimmingDragon.prototype.drawDots = function(cls, fX, aX, fY, aY, colour, opacity)
{
	this.graph.selectAll("dot")
		.data(this.data)
		.enter().append("circle")
		.attr("class", cls)
		.attr('stroke', colour)
		.attr("r", 0.7)
		.attr("cx", function(d) { return fX(d[aX]); })
		.attr("cy", function(d) { return fY(d[aY]); })
		.attr('opacity', opacity);
}

SwimmingDragon.prototype.transitionLine = function(cls, fX, aX, fY, aY)
{
	var line = d3.svg.line()
			.interpolate(this.chart.interpolation)
			.x(function(d) { return fX(d[aX]); })
			.y(function(d) { return fY(d[aY]); });

	this.graph.selectAll("path."+cls).transition().duration(this.speed).attr("d", line(this.data));
}

SwimmingDragon.prototype.transitionPolar = function(cls, fX, aX, fR, aR)
{
	var polar = function(d) {
    	var r=fR(d[aR]);
    	var t=(d[aX]%360)/360*(Math.PI*2);
   		var p = { x: r*Math.cos(t)+170, y: r*Math.sin(t)+170 };
    	return p;
  	}

  	var line = d3.svg.line()
  		.interpolate(this.chart.interpolation)
  		.x(function(d) { return polar(d).x; })
  		.y(function(d) { return polar(d).y; });


	this.graph.selectAll('path.'+cls).transition().duration(this.speed).attr("d", line(this.data));
}


SwimmingDragon.prototype.populate = function()
{	
	var h=170; //graph.attr('height')/2;
	var w=340; //graph.attr('width');
	var mxB = d3.max(this.data, function (d) { return d.b; });
	var mnB = d3.min(this.data, function (d) { return d.b; }); 
	var rangeB = Math.max(mxB, -1*mnB);
	var mxG = d3.max(this.data, function (d) { return d.g; });
	var mnG = d3.min(this.data, function (d) { return d.g; }); 
	var rangeG = Math.max(mxG, -1*mnG);

	for (var i=0; i<this.data.length; i++)
	{
		this.data[i].z=0;
		this.data[i].mxB=rangeB;
		this.data[i].mnB=rangeB*-1;
		this.data[i].mxA=-180;
		this.data[i].mnA=180;
		this.data[i].mxG=rangeG;
		this.data[i].mnG=rangeG*-1;
	}

	rangeB *= 1.1;
	rangeG *= 1.1;
	this.chart.dataMappers.x   = d3.scale.linear().domain([0, this.data.length]).range([0, w]);
	this.chart.dataMappers.yB  = d3.scale.linear().domain([ -1*rangeB,  rangeB]).range([h, 0]);
	this.chart.dataMappers.rB  = d3.scale.linear().domain([ -1*rangeB,  rangeB]).range([170, 90]);
	this.chart.dataMappers.yG  = d3.scale.linear().domain([ -1*rangeG,  rangeG]).range([h, 0]); 
	this.chart.dataMappers.rG  = d3.scale.linear().domain([ -1*rangeG,  rangeG]).range([170, 90]); 
	this.chart.dataMappers.yA  = d3.scale.linear().domain([ -185,  185]).range([2*h, h]); 

	var x=this.chart.dataMappers.x;
	var y=this.chart.dataMappers.yB;
	this.drawLine("beta beta-data",  x, "n", y, "b",   "orange", 1.0);
	this.drawLine("beta beta-mx ",   x, "n", y, "mxB", "#666666", 1.0);
	this.drawLine("beta beta-z",     x, "n", y, "z",   "#666666", 1.0);
	this.drawLine("beta beta-mn",    x, "n", y, "mnB", "#666666", 1.0);

	x=this.chart.dataMappers.x;
	y=this.chart.dataMappers.yG;
	this.drawLine("gamma gamma-data",    x, "n", y, "g",   "green", 0.0);
	this.drawLine("gamma gamma-mx",      x, "n", y, "mxG", "#666666", 0.0);
	this.drawLine("gamma gamma-z",       x, "n", y, "z",   "#666666", 0.0);
	this.drawLine("gamma gamma-mn",      x, "n", y, "mnG", "#666666", 0.0);

	x=this.chart.dataMappers.x;
	y=this.chart.dataMappers.yA;
	this.drawDots("alpha alpha-data",  x, "n", y, "a",   "purple", 1.0)
	this.drawLine("alpha alpha-mx",    x, "n", y, "mxA", "#666666", 1.0);
	this.drawLine("alpha alpha-z",     x, "n", y, "z",   "#666666", 1.0);
	this.drawLine("alpha alpha-mn",    x, "n", y, "mnA", "#666666", 1.0);

	this.graph.selectAll('#text-beta').text(Math.max(Math.abs(this.stats.b.mn),this.stats.b.mx).toFixed(1));
	this.graph.selectAll('#text-gamma').text(Math.max(Math.abs(this.stats.g.mn),this.stats.g.mx).toFixed(1));
}

SwimmingDragon.prototype.setVisibility = function()
{
	var showingSummary = (this.chart.type=="summary");
	var showingPolar   = (this.chart.type=="polar");
	var showingBeta    = (this.chart.data=="beta");
	$('#stats').toggle(showingSummary);
	$('#graphs').toggle(!showingSummary);
	$('#switch-beta').toggle(!showingSummary && !showingBeta);
	$('#switch-gamma').toggle(!showingSummary && showingBeta);
	$('#switch-polar').toggle(showingSummary || !showingPolar);
	$('#switch-linear').toggle(showingSummary || showingPolar);
	$('#switch-stats').toggle(!showingSummary);

	if (showingSummary) return;
	var numOpacity = (showingPolar) ? 1.0 : 0.0;
	if (this.chart.data!="gamma")
	{
		$('#switch-gamma').show();
		$('#switch-beta').hide();
		this.graph.selectAll('#text-gamma').transition().duration(this.speed).attr("opacity", numOpacity);
		this.graph.selectAll('#text-beta').transition().duration(this.speed).attr("opacity", 0.0);
	} else {

		$('#switch-gamma').hide();
		$('#switch-beta').show();
		this.graph.selectAll('#text-gamma').transition().duration(this.speed).attr("opacity", 0.0);
		this.graph.selectAll('#text-beta').transition().duration(this.speed).attr("opacity", numOpacity);
	}
}

SwimmingDragon.prototype.toGamma = function()
{
	if (this.chart.data=="gamma") return; else this.chart.data="gamma";
	this.setVisibility();
	
	this.graph.selectAll('path.beta').transition().duration(this.speed).attr("stroke-opacity", 0.0);
	this.graph.selectAll('path.gamma').transition().duration(this.speed).attr("stroke-opacity", 1.0);
	this.graph.selectAll('path.alpha').transition().duration(this.speed).attr("stroke-opacity", 1.0);
	var alphaOpacity = (this.chart.type=="polar") ? 0.0 : 1.0;
	this.graph.selectAll('path.alpha').transition().duration(this.speed).attr("stroke-opacity", alphaOpacity);
	this.graph.selectAll('circle.alpha').transition().duration(this.speed).attr("opacity", alphaOpacity);
}

SwimmingDragon.prototype.toBeta = function()
{
	if (this.chart.data=="beta") return; else this.chart.data="beta";
	this.setVisibility();
	
	this.graph.selectAll('path.beta').transition().duration(this.speed).attr("stroke-opacity", 1.0);
	this.graph.selectAll('path.gamma').transition().duration(this.speed).attr("stroke-opacity", 0.0);
	this.graph.selectAll('path.alpha').transition().duration(this.speed).attr("stroke-opacity", 1.0);
	var alphaOpacity = (this.chart.type=="polar") ? 0.0 : 1.0;
	this.graph.selectAll('path.alpha').transition().duration(this.speed).attr("stroke-opacity", alphaOpacity);
	this.graph.selectAll('circle.alpha').transition().duration(this.speed).attr("opacity", alphaOpacity);
}

SwimmingDragon.prototype.toPolar = function()
{
	if (this.chart.type=="polar") return; else this.chart.type="polar";
	this.setVisibility();

	var x=this.chart.dataMappers.x;
	var y=this.chart.dataMappers.rB;
	this.transitionPolar("beta-data",  x, "a", y, "b");
	this.transitionPolar("beta-mx",    x, "a", y, "mxB");
	this.transitionPolar("beta-z",     x, "a", y, "z");
	this.transitionPolar("beta-mn",    x, "a", y, "mnB");

	x=this.chart.dataMappers.x;
	y=this.chart.dataMappers.rG;
	this.transitionPolar("gamma-data",  x, "a", y, "g");
	this.transitionPolar("gamma-mx",    x, "a", y, "mxG");
	this.transitionPolar("gamma-z",     x, "a", y, "z");
	this.transitionPolar("gamma-mn",    x, "a", y, "mnG");

	this.graph.selectAll('path.alpha').transition().duration(this.speed).attr("stroke-opacity", 0.0);
	this.graph.selectAll('circle.alpha').transition().duration(this.speed).attr("opacity", 0.0);
}

SwimmingDragon.prototype.toLinear = function()
{
	if (this.chart.type=="linear") return; else this.chart.type="linear";
	this.setVisibility();

	var x=this.chart.dataMappers.x;
	var y=this.chart.dataMappers.yB;
	this.transitionLine("beta-data",  x, "n", y, "b");
	this.transitionLine("beta-mx",    x, "n", y, "mxB");
	this.transitionLine("beta-z",     x, "n", y, "z");
	this.transitionLine("beta-mn",    x, "n", y, "mnB");

	x=this.chart.dataMappers.x;
	y=this.chart.dataMappers.yG;
	this.transitionLine("gamma-data",   x, "n", y, "g");
	this.transitionLine("gamma-mx",     x, "n", y, "mxG");
	this.transitionLine("gamma-z",      x, "n", y, "z");
	this.transitionLine("gamma-mn",     x, "n", y, "mnG");

	this.graph.selectAll('path.alpha').transition().duration(this.speed).attr("stroke-opacity", 1.0);
	this.graph.selectAll('circle.alpha').transition().duration(this.speed).attr("opacity", 1.0);
	this.graph.selectAll('#text-gamma').transition().duration(this.speed).attr("opacity", 0.0);
	this.graph.selectAll('#text-beta').transition().duration(this.speed).attr("opacity", 0.0);
}

SwimmingDragon.prototype.toStats = function()
{
	if (this.chart.type=="summary") return; else this.chart.type="summary";
	this.setVisibility();
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
	if (event.alpha == null) return;
	 var alpha = (event.alpha > 180) ? event.alpha-360 : event.alpha;

     var count=this.data.length;
     var d = { a:alpha, b: event.beta, g:event.gamma, n: count };
     this.data.push(d);

     this.updateStats("#gB", ".b", this.stats.b, event.beta,  alpha);
     this.updateStats("#gG", ".g", this.stats.g, event.gamma, alpha);
}

SwimmingDragon.prototype.start = function()
{
	var self=this;
	console.log("START");

	this.data = [];
	this.stats.b = { num: 0, asum:0, sum:0, ssum:0, mx: -10000, amx: -10000, mn: 10000 };
	this.stats.g = { num: 0, asum:0, sum:0, ssum:0, mx: -10000, amx: -10000, mn: 10000 };
	this.chart.type="summary";
	this.chart.data="beta";
	
	$('#stats').hide();
	$('#graphs').show();
	$('#buttons').hide();

	this.startSound.play();
	this.callbacks.deviceorientation = function(e) { self.phoneMove(e); };
	window.addEventListener("deviceorientation", this.callbacks.deviceorientation);
}

SwimmingDragon.prototype.stop = function() {
	console.log("STOP");
	$("#graphs").css("height", "690px")
	$("#graphs").css("width", "340px");
	$('#sd-spinner').hide();
	
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
	this.setVisibility();
	this.startSound.play();
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

	this.spinner.spin();


	
	var startDelay = 5*SECOND;
	var practiceTime = 2*SECOND;
	window.setTimeout(
		function() { 
			self.start();
			self.spinner.toggle();
			window.setTimeout(function() { self.stop(); }, practiceTime);
		}, startDelay);
}

SwimmingDragon.prototype.init = function() {
	var self=this;

	$( document ).on("change" , function(e, data) { self.prepare(); });

	$('#sd-spinner').show();
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
