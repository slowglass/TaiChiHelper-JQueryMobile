var Spill = function() {
  var self=this;
  this.tilt=0;
  this.lowerBound=15;
  this.upperBound=30;
  this.maxDelay=2000;
  this.status = "OFF";
  this.sound=new Howl({ src: ["music/ting.wav"], volume: 1.0});
  this.sound.onend(function() { self.setStatusDelay(); }
}

Spill.prototype.setStatusOff() {
  this.status = "OFF";
  this.sound.stop();
  clearTimeout(this.delayid);
}

Spill.prototype.setStatusOK() {
  this.status = "OK";
}

Spill.prototype.setStatusPlay() {
  this.status = "PLAY";
  this.sound.play();
}

Spill.prototype.setStatusDelay() {
  var self = this;
  this.status = "DELAY";
  this.delayid = setTimeout(funcion() { self.replay(); }, this.delay());
}

Spill.prototype.replay() {
  if (this.tilt < this.lowerBound)
    ths.setStatusOK();
  else
    setStatusPlay();
}

Spill.prototype.delay()
{
  var v=Math.min(Math.max(this.lowerBound,this.tilt),this.upperBound);
  var d=this.maxDelay*(v-this.lowerBound)/(this.upperBound-this.lowerBound);
  return d;
}

Spill.prototype.setTilt(t)
{
  this.tilt=t;
}

