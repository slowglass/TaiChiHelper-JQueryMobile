
var Config2 = function() {
	this.mt = [];
    if (typeof(Storage) === "undefined") 
        this.storage = undefined;
	else
		this.storage = localStorage;
    
    if (this.storage != undefined)
        this.mt=JSON.parse(this.storage.getItem("MT"));
    
    if (this.mt == null)
    {
        this.mt = [];
        this.mt[0] = { cn: "MultiTimer:"+0, st: 10, et:120, ic: 3 };
    }
    this.store();
    console.log("MT - init: "+JSON.stringify(this.mt[0]));
}

Config2.prototype = {
    makeTimeDropdown: function(idx, label, options, prefixid) {
        var id="\""+prefixid+"-"+idx+"\"";
        var html=
            "<label for="+id+" class=\"select\">"+label+"</label>"+
            "<select name="+id+" id="+id+" data-native-menu=\"false\">";
        for (var i=0; i<options.length; i++)
        {
            var o = options[i];
            html += "<option value=\""+o.v+"\">"+o.t+"</option>";
        }
        html += "</select><br />";
        return html;
    },

    makeSetupTime: function(idx) {
        var options= [ {v:0, t:"None"}, {v:-5, t:"5s (at start)"}, {v:-10, t:"10s (at start)"}, {v:5, t:"5s (each iteration)"}, {v:10, t:"10s (each iteration)"} ];
        return this.makeTimeDropdown(idx, "Setup", options, "mt-1");
    },

    makeExerciseTime: function(idx) {
        var options= [
            {v:30, t:"30s"}, {v:40, t:"40 s"}, {v:60, t:"1 min"}, {v:120, t:"2 mins"}, {v:180, t:"3 mins"},
            {v:240, t:"4 mins"}, {v:300, t:"5 mins"}, {v:360, t:"6 mins"}, {v:600, t:"10 mins"} ];
        return this.makeTimeDropdown(idx, "Duration", options, "mt-2");
    },

    makeIterationCount: function(idx) {
        var options= [];
        for(var i=1; i<=12;i++)
            options[i-1] = { v:i, t:i };
        var id="\"mt-3-"+idx+"\""; 
        return this.makeTimeDropdown(idx, "Iterations", options, "mt-3");
    },

     makeConfigName: function(idx) {
        var label="Name";
        var id="\""+"mt-0"+"-"+idx+"\"";
        var html=
            "<label for="+id+">"+label+"</label>"+
            "<input type=\"text\" name="+id+" id="+id+" value=\"\" data-clear-btn=\"true\" placeholder=\"Type your text here...\" style=\"width: 99%;\"><br />";
        return html;
    },

    addSWCard: function() {
        var card="<div class=\"nd2-card\">"+
            "<div class=\"card-title has-avatar\">" +
            "<img class=\"card-avatar\" src=\"http://lorempixel.com/200/200/abstract/44\">" +
            "<h3 class=\"card-primary-title\">Swimming Dragon</h3>"+
            "<div style=\"clear:left;\"><br />"+
            "<label for=\"sd-dur\">Max Duration:</label><input type=\"range\" name=\"sd-dur\" id=\"sd-dur\" value=\"2\" min=\"1\" max=\"5\" data-highlight=\"true\">" +
			"<div data-role='rangeslider'>" +
			"<label for='rangeslider1a'>Tilt:</label><input type='range' name='sd-mn' id='sd-mn' min='1' max='90' value='10'>" +
            "<label for='rangeslider1b'>Tilt:</label><input type='range' name='sd-mx' id='sd-mx' min='1' max='90' value='45'>" +
			"</div></div></div>";
        $('#config2 .ui-content').append(card);
        $("#sd-dur").slider().slider("refresh");
        $("sd-mn").slider().slider("refresh");
        $("#sd-mx").slider().slider("refresh");
    },

    addMultiTimerCard: function (idx) {
        var mt = this.mt;
        var self=this;
        if (mt[idx]==null)
           mt[idx]= { cn: "MultiTimer:"+idx, st: 10, et:120, ic: 3 };

        console.log("MT: Add Card "+idx);
        console.log("MT: "+JSON.stringify(mt[idx]));

        var title="<div class=\"card-title has-avatar\">" +
            "<img class=\"card-avatar\" src=\"http://lorempixel.com/200/200/abstract/"+idx+"\">" +
            "<h3 class=\"card-primary-title\">Multi Timer</h3>";
        

        var c="<div class=\"nd2-card\">"+title +"<div style=\"clear:left;\"><br />";
        var del=
            "<div>" +
            "<a href=\"#\" id=\"mt-del-"+idx+"\" class=\"ui-btn clr-primary\">Delete</a>"
            "</div>";
        c += this.makeConfigName(idx);
        c += this.makeSetupTime(idx);
        c += this.makeExerciseTime(idx);
        c += this.makeIterationCount(idx);
        c += del;
        c += "</div></div>";

        $('#config2 .ui-content').append(c);
        
        $("#mt-0-"+idx).textinput().val(mt[idx].cn);
        $("#mt-1-"+idx).selectmenu().val(mt[idx].st).selectmenu("refresh");
        $("#mt-2-"+idx).selectmenu().val(mt[idx].et).selectmenu("refresh");
        $("#mt-3-"+idx).selectmenu().val(mt[idx].ic).selectmenu("refresh");

        // Bind Events 
        $("#config2").off("change", "#mt-0-"+idx).on("change",  "#mt-0-"+idx, function() { mt[idx].cn = $("#mt-0-"+idx).val(); self.store(); });
        $("#config2").off("change", "#mt-1-"+idx).on("change",  "#mt-1-"+idx, function() { mt[idx].st = $("#mt-1-"+idx).val(); self.store(); });
        $("#config2").off("change", "#mt-2-"+idx).on("change",  "#mt-2-"+idx, function() { mt[idx].et = $("#mt-2-"+idx).val(); self.store(); });
        $("#config2").off("change", "#mt-3-"+idx).on("change",  "#mt-3-"+idx, function() { mt[idx].ic = $("#mt-3-"+idx).val(); self.store(); });
        $("#config2").off("click", "#mt-del-"+idx).on("click",  "#mt-del-"+idx, function() { self.delCard(idx); self.store(); }); 
        $("#left-manu-panel ul").append("<li><a href='#standing-stake' data-ajax='false' data-icon='false' class='sslink'>"+mt[idx].cn+"</a></li>");
        $("#left-manu-panel ul li:last-child a").data("mt", idx);

    },


    updateVal: function(key, idx){
         this.mt[idx].st = $(key+idx).val(); 
         self.store();
    },
    
    addCard: function() {
        this.addMultiTimerCard(this.mt.length);
    },

    delCard: function(idx) {
        this.mt.splice(idx,1);
        this.bind();
    },

    store: function() {
        if (this.storage != undefined)
            this.storage.setItem("MT", JSON.stringify(this.mt));
    },

	bind: function() {
        $('#config2 .ui-content').html("");

        $("#left-manu-panel ul").html("");
        $("#left-manu-panel ul").append("<li data-role=\"list-divider\">Apps</li>");

        var ctrl=
            "<div>" +
            "<a href=\"#\" id=\"mt-new\" class=\"ui-btn clr-primary\">New Timer</a>"
            "</div>"
        var self=this;
        $('#config2 .ui-content').append(ctrl);
        $("#mt-new").unbind("click").on("click", function() { self.addCard(); });

        //this.addSWCard();
		for (var i=0; i<this.mt.length; i++)
        {
            this.addMultiTimerCard(i);
        }
        $("#left-manu-panel ul").append("<li data-role=\"list-divider\">Help</li>");
        $("#left-manu-panel ul").append("<li><a href='#config2' data-ajax='false' data-icon='false'>Config</a></li>");
        $("#left-manu-panel ul").append("<li><a href='#about' data-ajax='false'>About</a></li>");
        $("#left-manu-panel ul").listview("refresh");
	},

    readConfig: function(idx)
    {
        return this.mt[idx];
    }

}
