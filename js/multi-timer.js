var MultiTimer = function(spinnerId) {
  var self=this;
  this.updateDisplay();
  this.lock = new WakeLocker();
  this.spinner = new YinYang(spinnerId, "#ccf", "#004");
  this.endSound = new Howl({  src: ["music/templeBell.wav"]});
  this.minSound = new Howl({  src: ["music/ting.wav"]});

  this.state = "STATIONARY";
  $("body").one("pagecontainerchange", function() { 
    $(spinnerId +" path").click(function() { if (self.state == "SPINNING") self.stop(); else self.start(); });
    self
        .on("min-rollover", function() { self.minSound.play(); })
        .on("iter-rollover", function() { self.endSound.play(); });
  });
}

MultiTimer.prototype = {
  timer: {  sec: 30, min: 0, iter: 1, name: "Multi-Timer" },
  sec: 0, min: 0, iter: -1,
  timerid: null,
  

  start: function() {
    var self=this;
    this.state = "SPINNING";
    this.spinner.spinClockwise();
    this.lock.lockScreen();
    if (this.timerid!=null) clearInterval(this.timerid);
    this.timerid=setInterval(function() { self.tick(); }, 1000);
    this.sec=this.timer.setupTime;
    this.min=0;
    this.iter=this.timer.iter *2;
    this.updateDisplay();
    debug.log("MultiTimer", "Start");
  },
  
  stop: function() {
    if (this.timerid!=null) clearInterval(this.timerid);
    this.state = "STATIONARY";
    this.spinner.stop();
    this.lock.unlock();
    this.timerid=null;
    this.iter=-1;
    this.updateDisplay();
    debug.log("MultiTimer", "Stop");
  },
  
  tick: function() {
    debug.log("MultiTimer", "TICK:"+this.iter+", "+this.min+", "+this.sec);
    var callback=null;
    this.sec--;
    if (this.sec<0) { this.sec= 59; this.min--; callback=this.minRolloverCB; }
    if (this.min<0) {
      this.iter--;
      callback=this.iterRolloverCB;
      if (this.iter%2 == 0)
      {
        if (this.timer.repeatSetup) { this.sec=this.timer.setupTime; this.min=0; }
        else this.iter--;
      }
      if (this.iter%2 == 1) { this.sec= this.timer.sec; this.min=this.timer.min; }
    }
    this.updateDisplay();
    if (callback != null) callback();
    if (this.iter<0)
    {
      this.stop();
      if (this.finishedCB != null) this.finishedCB();
    }
  },
  
  updateDisplay: function() { 
    var cd, it;
    if (this.iter<0) { 
      var rep = this.timer.repeatSetup ? "+" : "";
      it = this.timer.iter; 
      cd = this.getNumber(this.timer.min) + ":" + this.getNumber(this.timer.sec) + rep; }
    else if (this.iter%2 == 0) { it = "Setup"; cd = this.getNumber(this.sec); }
    else { it = (this.iter+1)/2; cd = this.getNumber(this.min) + ":" + this.getNumber(this.sec); }
    $("#standing-stake .iter-count").text(it);
    $("#standing-stake .countdown").text(cd);
    $("#standing-stake h1").text(this.timer.name);
  },
  
  getNumber: function(n) {
    if (n>9) return n.toString();
    else return '0'+n.toString();
  },


  on: function(n, cb) {
    if (n=="min-rollover") this.minRolloverCB=cb;
    if (n=="iter-rollover") this.iterRolloverCB=cb;
    if (n=="finished") this.finishedCB=cb;
    return this;
  },
  
  setName: function(t) { this.timer.name=t; this.updateDisplay(); },
  getIterations: function(i) { return this.timer.iter; },
  setIterations: function(i) { this.timer.iter=i; this.updateDisplay(); },
  setDuration: function(s) { var secs = parseInt(s, 10); this.timer.sec=secs%60; this.timer.min=Math.floor(secs/60);  this.updateDisplay(); },
  setSetupTime: function(s) { this.timer.setupTime=Math.abs(s);  this.timer.repeatSetup=(s>0); this.updateDisplay(); }
}
