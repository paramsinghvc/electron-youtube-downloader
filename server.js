var express = require("express");
var request = require("request");
var http = require("https");
var cors = require("cors");

var app = express();
// app.use(cors());
app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Expose-Headers", 'Content-Length');
	// res.set(
	// 	"Access-Control-Allow-Headers",
	// 	"*"
	// );
	next();
});

var VIDEO_URL = "http://www.youtube.com/get_video_info?html5=1&video_id=";

app.get("/get-video-info", function(req, res) {
	request(VIDEO_URL + req.query.video_id, function(err, response) {
		if (err) res.status(500).send(err);
		res.send(response.body);
	});
});

app.get("/download-video", function(req, res) {
	console.log("req.query.url", decodeURIComponent(req.query.url));
	http.get(decodeURIComponent(req.query.url), function(response) {
		console.log("response", response);
        res.setHeader("Content-Length", response.headers['content-length']);
		// if (response.statusCode >=400) res.status(500).send('Error');
		response.on("data", function(chunk) {
            res.write(chunk);
		});
        response.on("end", function () {
            console.log('end');
            res.end();
        });
		// res.pipe(response);
	});
});

app.listen(process.env.PORT || 8082);
