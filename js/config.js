var Config = function(ss, sd) {
	this.mt = [];

	this.mt[0] = { name:"Standing Stake", dur:180, setup_time:10, iter:2, one_setup:true };
	this.mt[1] = { name:"Streches", dur:600, setup_time:10, iter:10, one_setup:false };
	this.ss = ss;
	this.sd = sd;

	this.bound = false;
	if (typeof(Storage) === "undefined") 
		this.ls = {};
	else
		this.ls = localStorage;
	if (this.ls.ss_dur == undefined) this.ls.ss_dur=180;
	if (this.ls.ss_setup_time == undefined) this.ls.ss_setup_time=10;
	if (this.ls.ss_iter == undefined) this.ls.ss_iter=2;
	if (this.ls.sd_dur == undefined) this.ls.sd_dur=0;
	if (this.ls.sd_mx == undefined) this.ls.sd_mx=15;
	if (this.ls.sd_mn == undefined) this.ls.sd_mn=15;


	this.ss.setIterations(this.ls.ss_iter);
	this.ss.setDuration(this.ls.ss_dur);
	this.ss.setSetupTime(this.ls.ss_setup_time);

	this.sd.spill.setMaxDelay(this.ls.sd_dur);
	this.sd.spill.setRange(this.ls.sd_mn, this.ls.sd_mx);

	debug.log("Config", "SS => "+this.ls.ss_dur+", "+this.ls.ss_iter);
	debug.log("Config", "SD =>"+this.ls.sd_dur+", ["+this.ls.sd_mn +", "+this.ls.sd_mx+"]");
}

Config.prototype = {
	ss: {},
	sd: {},

	bind: function() {
		var self=this;
		if (this.bound) return;
		this.bound = true;

		$("#ss-dur").val(this.ls.ss_dur).selectmenu("refresh", true).on("change", function() { self.update(); });
		$("#ss-iter").val(this.ls.ss_iter).slider("refresh").on("change", function() { self.update(); });
		$("#ss-setuptime").val(this.ls.setuptime).selectmenu("refresh", true).on("change", function() { self.update(); });

		$("#sd-dur").val(this.ls.sd_dur).slider("refresh").on("change", function() { self.update(); });
		$("#sd-mn").val(this.ls.sd_mx).slider("refresh").on("change", function() { self.update(); });
		$("#sd-mx").val(this.ls.sd_mx).slider("refresh").on("change", function() { self.update(); });
	},

	update: function() {
		this.ls.ss_dur=$("#ss-dur").val();
		this.ls.ss_iter=$("#ss-iter").val();
		this.ls.ss_setup_time=$("#ss-setuptime").val();

		this.ls.sd_dur=$("#sd-dur").val();
		this.ls.sd_mx=$("#sd-mx").val();
		this.ls.sd_mn=$("#sd-mn").val();

		this.ss.setIterations(this.ls.ss_iter);
		this.ss.setDuration(this.ls.ss_dur);
		this.ss.setSetupTime(this.ls.ss_setup_time);

		this.sd.spill.setMaxDelay(this.ls.sd_dur);
		this.sd.spill.setRange(this.ls.sd_mn, this.ls.sd_mx);


		debug.log("Config", "SS => "+this.ls.ss_dur+", "+this.ls.ss_iter);
		debug.log("Config", "SD =>"+this.ls.sd_dur+", ["+this.ls.sd_mn +", "+this.ls.sd_mx+"]");
	}
}
