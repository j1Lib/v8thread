(function(d) {

    var download = d.getElementById("download");
    download.onclick = function() {
        location.href = "https://github.com/j1Lib/v8thread";
    };

    var topic = d.getElementById("body");
    var link = topic.getElementsByTagName("a");

    var i = link.length;
    while (i--) {
        link[i].onclick = function() {
            location.hash = btoa(this.innerHTML.trim());
            location.reload();
        }
    }

    var logo = d.getElementById("logo");
    logo.onclick = function() {
        location.hash = "";
        location.reload();
    }

    var topic = d.getElementById("topic");
    var category = d.getElementById("category");

    var thread = d.getElementById("result").children;

    var log_ = d.getElementById("log");
    var Log = function(title, text) {
        setTimeout(function() {
            log_.innerHTML += "<strong>&gt;" + title + "</strong> [" + (new Date()).toLocaleString('en-GB').slice(12) + "]<br/>" + text + "<br/><br/>";
            log_.scrollTop = log_.scrollHeight;
        }, 0);
    };

    var LogProgress = function(length, e, partial) {


        Log("Partial Received", "Chunk " + length + " [" + e + "%]");
        if (e >= 5) {
            partial[0].className = "thread";
            partial[1].className = "partial done";
        } else {
            return;
        }

        if (e >= 10) {
            partial[4].className = "thread";
            partial[5].className = "partial done";
        } else {
            return;
        }

        if (e >= 15) {
            partial[8].className = "thread";
            partial[9].className = "partial done";
        } else {
            return;
        }

        if (e >= 20) {
            partial[12].className = "thread";
            partial[13].className = "partial done";
        } else {
            return;
        }

        if (e >= 25) {
            partial[16].className = "thread";
            partial[17].className = "partial done";
        } else {
            return;
        }

        if (e >= 30) {
            partial[1].className = "thread";
            partial[2].className = "partial done";
        } else {
            return;
        }

        if (e >= 35) {
            partial[5].className = "thread";
            partial[6].className = "partial done";
        } else {
            return;
        }

        if (e >= 40) {
            partial[9].className = "thread";
            partial[10].className = "partial done";
        } else {
            return;
        }

        if (e >= 45) {
            partial[13].className = "thread";
            partial[14].className = "partial done";
        } else {
            return;
        }

        if (e >= 50) {
            partial[17].className = "thread";
            partial[18].className = "thread";
        } else {
            return;
        }

        if (e >= 55) {
            partial[2].className = "thread";
            partial[3].className = "partial done";
        } else {
            return;
        }

        if (e >= 60) {
            partial[6].className = "thread";
            partial[7].className = "partial done";
        } else {
            return;
        }

        if (e >= 65) {
            partial[10].className = "thread";
            partial[11].className = "partial done";
        } else {
            return;
        }

        if (e >= 70) {
            partial[14].className = "thread";
            partial[15].className = "partial done";
        } else {
            return;
        }

        if (e >= 75) {
            partial[18].className = "thread";
            partial[19].className = "partial done";
        } else {
            return;
        }

        if (e >= 80) {
            partial[3].className = "thread";
        } else {
            return;
        }

        if (e >= 85) {
            partial[7].className = "thread";
        } else {
            return;
        }

        if (e >= 90) {
            partial[11].className = "thread";
        } else {
            return;
        }

        if (e >= 95) {
            partial[15].className = "thread";
        } else {
            return;
        }
    };

    var LogComplete = function(start, partial) {
        Log("Download Complete", "Took " + (new Date() - start) + " ms");
        partial[19].className = "thread";
    };

    var LogReady = function(t, partial) {
        Log("Meta Received",
            "Source: " + t.url + "<br/>" +
            "MimeType: " + t.config.mimeType + "<br/>" +
            "Content-Byte: " + t.range + "<br/>" +
            "Thread: " + parseInt(parseInt(t.range) / t.thread) + "@" + t.thread + "<br/>" +
            "Partial " + t.partial
        );
        partial[0].className = "partial done";
        partial[4].className = "partial done";
        partial[8].className = "partial done";
        partial[12].className = "partial done";
        partial[16].className = "partial done";
    };

    var handleHash = function() {
        topic.innerHTML = atob(location.hash.slice(1));
        switch (topic.innerText) {
            case "<Img>":

                thread[1].style.display = "block";
                var partial = thread[1].getElementsByTagName("a");

                var test = d.getElementById("test");
                var image = d.createElement("img");
                image.setAttribute("thread-src", "data/fantasy_planet_8K.jpg?nocahe" + (new Date).getTime());
                image.setAttribute("thread", "5");
                image.setAttribute("partial", "256");
                image.style.width = "100%";
                test.appendChild(image);

                Log("Test Case", "Small Image (5MB @ 5 Thread / 256KB)");
                var i = image;
                if (i.hasAttribute("thread-src")) {
                    var canvas = document.createElement('canvas');
                    var ctx;

                    var angle = 0;
                    var startAngle = 0;

                    var complete = 0;
                    var start = new Date();
                    new v8t(i.getAttribute("thread-src"), i.getAttribute("thread") || 5, i.getAttribute("partial") || 50).done(function(url) {
                        complete++;
                        i.src = url;
                        i.onload = function() {
                            URL.revokeObjectURL(this.src);
                        };
                        if (complete == 1) {
                            LogReady(this, partial);
                        } else if (complete == 2) {
                            LogComplete(start, partial);
                        }
                    }).load(function(e) {
                        if (Object.keys(this.response).length == 2) {
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
                        canvas.toBlob(function(e) {
                            if (complete == 1) {
                                if (e) {
                                    i.src = URL.createObjectURL(e);
                                }
                            }
                        }, 'image/jpeg');

                        LogProgress(Object.keys(this.response).length, e, partial);

                    });
                }


                break;
            case "<File>":
                thread[1].style.display = "block";
                var partial = thread[1].getElementsByTagName("a");

                var test = d.getElementById("test");
                var image = d.createElement("button");
                image.style.backgroundColor = "#424242";
                image.style.color = "#fff";
                image.disabled = true;
                image.style.border = "none";
                image.style.padding = "16px";
                image.style.boxShadow = "0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12)";
                image.innerHTML = "Preparing file for download..";
                image.style.marginTop = "50px";
                test.appendChild(image);

                Log("Test Case", "Small File (5MB @ 5 Thread / 256KB)");

                var start = new Date();
                var complete = 0;
                new v8t("data/fantasy_planet_8K.jpg.zip?nocahe" + (new Date).getTime(), 5, 256).load(function(e) {
                    LogProgress(Object.keys(this.response).length, e, partial);
                }).done(function(url) {
                    complete++;
                    if (complete == 1) {
                        LogReady(this, partial);
                    } else if (complete == 2) {
                        LogComplete(start, partial);
                        image.disabled = false;
                        image.innerHTML = "<a style='color:#fff;text-decoration: none;' download='" + this.url.substr(this.url.lastIndexOf("/") + 1) + ".zip' href=" + url + ">Ready For Download</a>";
                        image.style.backgroundColor = "#8BC34A";
                    }
                });

                break;
            case "<Video>":
            case "<Audio>":
                thread[1].style.display = "block";
                var partial = thread[1].getElementsByTagName("a");

                var test = d.getElementById("test");
                var image;
                if (topic.innerText == "<Audio>") {
                    image = d.createElement("audio");
                } else {
                    image = d.createElement("video");
                }
                image.setAttribute("thread-src", "data/Porter_Robinson_Madeon_-_Shelter_Official_Video_Sh.webm?nocahe" + (new Date).getTime());
                image.setAttribute("thread", "5");
                image.setAttribute("partial", "512");
                image.setAttribute("autoplay", "autoplay");
                image.setAttribute("controls", "controls");
                image.style.width = "100%";
                test.appendChild(image);

                if (topic.innerText == "<Audio>") {
                    Log("Test Case", "Audio (60MB @ 5 Thread / 512KB)");
                } else {
                    Log("Test Case", "Video (60MB @ 5 Thread / 512KB)");
                }
                var i = image;

                if (i.hasAttribute("thread-src")) {

                    var mediaSource = new MediaSource();

                    var buffered = 0;

                    var sourceBuffer;

                    var mimeType = i.getAttribute("type") || 'video/webm; codecs="vorbis,vp8"';

                    if (MediaSource.isTypeSupported(mimeType)) {

                        mediaSource.addEventListener('sourceopen', function() {

                            sourceBuffer = mediaSource.addSourceBuffer(mimeType);
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

                        var start = new Date();
                        new v8t(i.getAttribute("thread-src"), 5, i.getAttribute("partial") || 50).done(function(url) {

                            if (finish) {

                                if (buffered < part) {
                                    completed = true;
                                    this_ = this;
                                }
                                LogComplete(start, partial);

                            } else {

                                part = this.range / this.partial;
                                finish = true;
                                i.hasAttribute("autoplay") && i.play();
                                LogReady(this, partial);


                            }
                            sourceBuffer.appendBuffer(this.response[buffered]);


                        }).load(function(e) {

                            if (!wait && this.response[buffered] && buffered != 0) {
                                wait = true;
                                sourceBuffer.appendBuffer(this.response[buffered]);
                            }

                            LogProgress(Object.keys(this.response).length, e, partial);

                        }).config.createBlob = false;

                    } else {

                        i.src = i.getAttribute("thread-src");

                    }

                }
                break;
            default:
                topic.style.display = "none";
                category.style.display = "none";

                thread[0].style.display = "block";
                var partial = thread[0].getElementsByTagName("a");

                var i = 20;
                while (--i) {

                    (function(i) {
                        setTimeout(function() {
                            if (i < 5) {
                                partial[i].className += " done";
                                partial[i + 5].className += " done";
                                partial[i + 10].className += " done";
                                partial[i + 15].className += " done";
                            }
                            partial[20 + i].className += " done";
                        }, 1000 * i);
                    })(i);

                }
        }
    }

    handleHash();

})(document);