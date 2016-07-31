// Spinning Yin-Yang symbol.

var YinYang = function(loc, fg, bg) {
  this._init_();
  $(loc).append('<svg 
        xmlns="http://www.w3.org/2000/svg" 
        height="256" width="256" 
        viewBox="-8 -8 16 16"
        class="yin-yang">
					<g><circle r="7" fill="#808080" filter="url(#f)"/>
						<path d="m0-7a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 0 0 7 7 7 0 1 1 0-14z" fill="'+fg+'"/>
						<path d="m0-7a7 7 0 1 1 0 14 3.5 3.5 0 1 1 0-7 3.5 3.5 0 1 0 0-7z" fill="'+bg+'"/>
						<circle cy="-3.5" r="1.1" fill="'+bg+'"/><circle cy="3.5" r="1.1" fill="'+fg+'"/>
					</g></svg>');
		this.$svg = $(loc + " yin-yang");
}

YinYang.prototype = {
  _init_: function() {
    if (YinYang.prototype.haskeyframes == undefined) {
      $('body').append('<style> @keyframes yin-yang-spin {  100% { transform: rotate(360deg); } }</style>');
      YinYang.prototype.haskeyframes = true;
    }
  pause: function() {
    this.$svg
      .css('animation', 'yin-yang-spin 2s infinite linear');
      .css("webkitAnimationPlayState", "running");
  }
  
  spin: function() {
    this.$svg.css("webkitAnimationPlayState", "paused");
  }
  
  stop: function() {
    this.$svg
      .css('animation', '');
      .css("webkitAnimationPlayState", "");
  }
}
