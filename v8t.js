function v8t(url) {
    this.url = url;
    this.thread = 10;
    this.partial = 20 * 1024; //20KB
    this.response = new Uint8Array();
    this.ajax(0, function(e) {
        this.range = e.getResponseHeader('Content-Range').split("/")[1];
        this.response = concatTypedArrays(this.response, new Uint8Array(e.response));

        for (var i = 0; i < this.range / this.partial; i++) {
            this.handle(i + 1);
        }
        //console.log(this.range/this.partial);
    }, function(code) {
        window.xhr = code;
        console.log(code.status);
    });
};

function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new(a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

v8t.prototype.handle = function(i) {
    this.ajax(i, function(e) {
        this.response.push(new Uint8Array(e.response));
    }, function(e) {
        if (e.status == 200) {
            this.response.push(new Uint8Array(e.response));
            console.log("finish");
            console.log(this.response);
        }
    });
};

v8t.prototype.ajax = function(i, s, f) {
    var t_ = this;
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 206) {
                // s && s(new TextDecoder("utf-8").decode(new Uint8Array(this.response)));
                s && s.call(t_, x);
            } else {
                f && f.call(t_, x);
            }
        }
    };
    x.open("GET", this.url, true);
    var end = (i + 1) * this.partial - 320;
    if (end > this.range) {
        end = this.range;
    }
    x.setRequestHeader('Range', 'bytes=' + i * this.partial + "-" + end); //20KB - gprs
    x.responseType = 'arraybuffer';
    x.send();
};

new v8t("trolltunga.jpg", function(data) {

});