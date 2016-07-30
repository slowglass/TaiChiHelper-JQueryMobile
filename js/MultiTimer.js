var MultiTimer = function() {
}

MultiTimer.prototype = {
  timer: {  sec: 30, min: 0, iter: 1 },
  sec: 0, min: 0, iter: 0,
  timerid = null;
  
  start: function() {
    var self=this;
    this.timerid=setInterval(function() { self.tick(); }, 1000);
    this.sec=10;
    this.min=0;
    this.iter=this.timer.iter;
  },
  
  stop: function() {
    if (timerid!=null) clearInterval(this.timerid=null;);
    this.timerid=null;
    $("#timer").text("");
  }
  
  tick: function() {
    this.timer.sec--;
    if (this.sec<0) { this.sec= 59; this.min--; }
    if (this.min<0) { this.sec= this.timer.sec; this.min=this.timer.min; this.iter--; }
    if (this.iter<0) { this.stop(); return; }
    this.updateDisplay();
  },
  
  updateDisplay: function() { 
    var t="";
    if (this.iter == this.timer.iter)
      t=this.getNumber(this.sec);
    else
      t = this.iter + ":" + this.getNumber(this.min) ":" + this.getNumber(this.sec) ;
      
    $("#timer").text(t);
  },
  
  getNumber: function(n) {
    if (n>9) return n.toString();
    else return '0'+n.toString();
  },
  
  getIterations: function(i) { return this.timer.iter; },
  getDuration: function(m,s) { return this.timer.se + this.timer.min*60; }
  getDuration: function(m,s) { this.timer.sec=s; this.timer.min=m; }
  setIterations: function(i) { this.timer.iter=i; },
  setDuration: function(s) { this.timer.sec=s%60; this.timer.min=s/60; }
}
  
