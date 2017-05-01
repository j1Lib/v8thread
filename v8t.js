function v8t(url, thread, partial) {
    this.url = url;
    this.partial = (partial || 50) * 1024 - 320; //20KB -GRPS standard speed
    this.thread = thread || 5;
    this.response = {};
    this.ajax(0, this.partial, function(e) {
        this.range = e.getResponseHeader('Content-Range').split("/")[1];

        this.finish(0, e);
        //this.response[0] = new Uint8Array(e.response);

        for (var i = 1; i < this.range / this.partial; i++) {
            if (i <= this.thread) {
                this.handle(i);
            }
        }
    }, function(code) {
        window.xhr = code;
        console.log(code.status);
    });
    var done_;
    this.done = function(cb) {
        if (typeof cb == "function") {
            done_ = cb;
        } else {
            done_ && done_.call(this, cb);
        }
        return this;
    };
    var load_;
    this.load = function(cb) {
        if (typeof cb == "function") {
            load_ = cb;
        } else {
            load_ && load_.call(this, cb);
        }
        return this;
    };
    return this;
};

v8t.prototype.concat = function(t, n) { var e = new t.constructor(t.length + n.length); return e.set(t, 0), e.set(n, t.length), e }

v8t.prototype.handle = function(i) {
    var start = this.partial * i;
    var end = start + this.partial;
    if (end >= this.range) {
        end = this.range;
    }
    this.ajax(start + 1, end, function(e) {
        this.finish(i, e);
        i = i + 5;
        if (i < this.range / this.partial) {
            this.handle(i);
        }
    }, function(e) {
        if (e.status == 200) {
            this.finish(i, e);
        }
    });
};

v8t.prototype.finish = function(i, e) {
    this.response[i] = new Uint8Array(e.response);
    var length = Object.keys(this.response).length;
    if (length >= this.range / this.partial) {
        for (var i = 1; i < length; i++) {
            this.response[i] = this.concat(this.response[i - 1], this.response[i]);
        }
        this.done(URL.createObjectURL(new Blob([this.response[length - 1]], { 'type': e.getResponseHeader('Content-Type') })));
    } else if (i == 0) {
        this.done(URL.createObjectURL(new Blob([this.response[0]], { 'type': e.getResponseHeader('Content-Type') })));
    } else {
        this.load(parseInt(100 * length / this.range * this.partial));
    }
};

v8t.prototype.ajax = function(start, end, s, f) {
    var t_ = this;
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 206) {
                s && s.call(t_, x);
            } else {
                f && f.call(t_, x);
            }
        }
    };
    x.open("GET", this.url, true);

    x.setRequestHeader('Range', 'bytes=' + start + "-" + end);

    x.responseType = 'arraybuffer';
    x.send();
};

/*new v8t("fantasy_planet_8K.jpg").done(function(url) {
    var image = document.getElementById("image")
    image.onload = function(){
    	URL.revokeObjectURL(url);
    };
    image.src = url;  
});*/

(function() {
    var img = document.getElementsByTagName("img");
    for (var i = 0; i < img.length; i++) {
        (function(i) {
            if (i.hasAttribute("thread-src")) {
                var canvas = document.createElement('canvas');
                var ctx;

                var angle = 0;
                var startAngle = 0;

                new v8t(i.getAttribute("thread-src"), i.getAttribute("thread") || 5, i.getAttribute("partial") || 50).done(function(url) {
                    i.onload = function() {
                        URL.revokeObjectURL(this.url);
                    };
                    i.src = url;
                }).load(function(e) {
                    if (e == 2) {
                        canvas.width = i.width;
                        canvas.height = i.height;
                        ctx = canvas.getContext("2d");
                        ctx.fillStyle = "#424242";
                        ctx.strokeStyle = "#fff";
                    }
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    angle += Math.PI / 50 * e;
                    startAngle += Math.PI / 200 * e;
                    ctx.arc(canvas.width / 2, canvas.height / 2, 70, startAngle, angle / 2, false);
                    ctx.font = "30px Arial";
                    ctx.strokeText("j1Lib", canvas.width - 100, canvas.height - 50);
                    ctx.stroke();
                    i.src = canvas.toDataURL();
                });
            }
        })(img[i]);
    }
})();