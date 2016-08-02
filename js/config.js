var Config = function(ss, sd) {
	this.ss = ss;
	this.sd = sd;
	if (typeof(Storage) === "undefined") 
		this.ls = {};
	else
		this.ls = localStorage;
	if (this.ls.ss_dur == undefined) this.ls.ss_dur=3;
	if (this.ls.ss_iter == undefined) this.ls.ss_iter=2;
	if (this.ls.sd_dur == undefined) this.ls.sd_dur=0;
	if (this.ls.sd_mx == undefined) this.ls.sd_mx=15;
	if (this.ls.sd_mn == undefined) this.ls.sd_mn=15;


	$("#ss-dur").val(this.ls.ss_dur).selectmenu("refresh", true).on("change", function() { c.update(); });
	$("#ss-iter").val(this.ls.ss_iter).slider("refresh").on("change", function() { c.update(); });

	$("#sd-dur").val(this.ls.sd_dur).slider("refresh").on("change", function() { c.update(); });
	$("#sd-mn").val(this.ls.sd_mx).slider("refresh").on("change", function() { c.update(); });
	$("#sd-mx").val(this.ls.sd_mx).slider("refresh").on("change", function() { c.update(); });

	this.update();

}

Config.prototype = {
	ss: {},
	sd: {},

	update: function() {
		this.ls.ss_dur=$("#ss-dur").val();
		this.ls.ss_iter=$("#ss-iter").val();

		this.ls.sd_dur=$("#sd-dur").val();
		this.ls.sd_mx=$("#sd-mx").val();
		this.ls.sd_mn=$("#sd-mn").val();

		this.ss.setIterations(this.ls.ss_iter);
		this.ss.setDuration(this.ls.ss_dur*60);

		this.sd.spill.setMaxDelay(this.ls.sd_dur);
		this.sd.spill.setRange(this.ls.sd_mn, this.ls.sd_mx);


		console.log("SS:"+this.ls.ss_dur+", "+this.ls.ss_iter);
		console.log("SD:"+this.ls.sd_dur+", ["+this.ls.sd_mn +", "+this.ls.sd_mx+"]");
	}
}
