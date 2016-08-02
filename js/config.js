var Config = function(ss, sd) {
	this.ss.instance = ss;
	this.sd.instance = sd;
}

Config.prototype = {
	ss: {},
	sd: {},

	update: function() {
		this.ss.dur=$("#ss-dur").val();
		this.ss.iter=$("#ss-iter").val();

		this.sd.dur=$("#sd-dur").val();
		this.sd.mx=$("#sd-mx").val();
		this.sd.mn=$("#sd-mn").val();

		this.ss.instance.setIterations(this.ss.iter);
		this.ss.instance.setDuration(this.ss.dur*60);

		this.sd.spill.setMaxDelay(this.sd.dur);
		this.sd.spill.setRange(this.sd.mn, this.sd.mx);
	}
}
