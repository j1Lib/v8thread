function v8t(url, thread, partial) {
    this.url = url;
    this.partial = (partial || 50) * 1024 - 320; //20KB -GRPS standard speed
    this.thread = thread || 5;
    this.response = {};
    this.ajax(0, this.partial, function(e) {
        this.range = e.getResponseHeader('Content-Range').split("/")[1];

        this.finish(0, e);

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
    this.config = {
        createBlob: true
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
        i = i + this.thread;
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
        if (this.config.createBlob) {
            for (var i = 1; i < length; i++) {
                this.response[i] = this.concat(this.response[i - 1], this.response[i]);
            }
            this.done(URL.createObjectURL(new Blob([this.response[length - 1]], { 'type': this.config.mimeType })));
        } else {
            this.done();
        }
    } else if (i == 0) {
        this.config.mimeType = e.getResponseHeader('Content-Type');
        if (this.config.createBlob) {
            this.done(URL.createObjectURL(new Blob([this.response[length - 1]], { 'type': this.config.mimeType })));
        } else {
            this.done();
        }
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

v8t.prototype.init = function(i) {
    switch (i.tagName) {
        case "IMG":

            if (i.hasAttribute("thread-src")) {
                var canvas = document.createElement('canvas');
                var ctx;

                var angle = 0;
                var startAngle = 0;

                return new v8t(i.getAttribute("thread-src"), i.getAttribute("thread") || 5, i.getAttribute("partial") || 50).done(function(url) {
                    i.onload = function() {
                        URL.revokeObjectURL(this.src);
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

        case "VIDEO":

            if (i.hasAttribute("thread-src")) {

                window.mediaSource = new MediaSource();

                var buffered = 0;

                mediaSource.addEventListener('sourceopen', function() {

                    window.sourceBuffer = mediaSource.addSourceBuffer(i.getAttribute("type") || 'video/webm; codecs="vorbis,vp8"');
                    sourceBuffer.addEventListener('updateend', function() {
                        if (++buffered >= part) {
                            mediaSource.endOfStream();
                        } else if (completed) {
                            sourceBuffer.appendBuffer(this_.response[buffered]);
                        }
                        wait = false;
                    });

                }, false);

                i.onload = function() {
                    URL.revokeObjectURL(this.src);
                };
                i.src = URL.createObjectURL(mediaSource);

                var wait = false;
                var finish = false;
                var completed = false;
                var part = 0;
                var this_;

                return new v8t(i.getAttribute("thread-src"), 5, i.getAttribute("partial") || 50).done(function(url) {

                    if (finish) {

                        if (buffered < part) {
                            completed = true;
                            this_ = this;
                        }

                    } else {

                        part = this.range / this.partial;
                        finish = true;
                        i.hasAttribute("autoplay") && i.play();

                    }
                    sourceBuffer.appendBuffer(this.response[buffered]);


                }).load(function(e) {

                    if (!wait && this.response[buffered]) {
                        wait = true;
                        sourceBuffer.appendBuffer(this.response[buffered]);
                    }

                }).config.createBlob = false;

            }
    }
};

v8t.prototype.support = ["img", "video"];

(function() {

    v8t.prototype.support.forEach(function(e) {
        var type = document.getElementsByTagName(e);
        for (var i = 0; i < type.length; i++) {
            v8t.prototype.init(type[i]);
        }
    });

})();