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
  status: "OFF"
}

Spill.prototype.setStatusOff = function() {
  this.status = "OFF";
  this.sound.stop();
  clearTimeout(this.delayid);
}

Spill.prototype.setStatusOK = function() {
  this.status = "OK";
}

Spill.prototype.setStatusPlay = function() {
  this.status = "PLAY";
  this.sound.play();
}

Spill.prototype.setStatusDelay = function() {
  var self = this;
  this.status = "DELAY";
  this.delayid = setTimeout(funcion() { self.replay(); }, this.delay());
}

Spill.prototype.replay = function() {
  if (this.tilt >= this.lowerBound)
    this.setStatusPlay();
  else
    this.setStatusOK();
}

Spill.prototype.delay = function()
{
  var v=Math.min(Math.max(this.lowerBound,this.tilt),this.upperBound);
  var d=this.maxDelay*(v-this.lowerBound)/(this.upperBound-this.lowerBound);
  return d;
}

Spill.prototype.setTilt = function(t)
{
  this.tilt=t;
  if (t>=this.lowerBound && this.status=="OK")
    this.setStatusPlay();
}

Spill.prototype.setRange = function(mn,mx)
{
  this.lowerBound=mn;
  this.upperBound=mx;
}


Spill.prototype.setMaxDelay = function(d)
{
  this.maxDelay=d;
}

Spill.prototype.setMusic = function(url)
{
  this.sound=new Howl({ src: [url], volume: 1.0});
}
