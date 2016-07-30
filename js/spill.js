var Spill = function() {
  var self=this;
  this.sound=new Howl({ src: ["music/ting.wav"], volume: 1.0});
  this.sound.onend(function() { self.setStatusDelay(); }
}

Spill.prototype = {
  tilt: 0,
  lowerBound: 15,
  upperBound: 30,
  maxDelay: 2000,
  status: "OFF",
  
  setStatusOff: function() {
    this.status = "OFF";
    this.sound.stop();
    clearTimeout(this.delayid);
  },
  setStatusOK: function() { this.status = "OK"; },
  setStatusPlay: function() {
    this.status = "PLAY";
    this.sound.play();
  },
  setStatusDelay: function() {
    var self = this;
    this.status = "DELAY";
    this.delayid = setTimeout(funcion() { self.replay(); }, this.delay());
  },
  
  replay: function() {
    if (this.tilt >= this.lowerBound)
      this.setStatusPlay();
    else
      this.setStatusOK();
  },
  delay: function() {
    var v=Math.min(Math.max(this.lowerBound,this.tilt),this.upperBound);
    var d=this.maxDelay*(v-this.lowerBound)/(this.upperBound-this.lowerBound);
    return d;
  },

  setTilt: function(t) {
    this.tilt=t;
    if (t>=this.lowerBound && this.status=="OK")
      this.setStatusPlay();
  },
  
  setRange = function(mn,mx) {
    this.lowerBound=mn;
    this.upperBound=mx;
  },
  setMaxDelay: function(d) { this.maxDelay=d; },
  setMusic = function(url) { this.sound=new Howl({ src: [url], volume: 1.0}); }
}
