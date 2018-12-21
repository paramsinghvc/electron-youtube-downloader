const validateUrl = url => /^(?:https?:\/\/)?(w{3})?\.?youtube\.com/.test(url);

const VIDEO_URL = "http://localhost:8082/get-video-info?video_id=";

function qsToJson(qs) {
	let res = {};
	let pars = qs.split("&");
	let kv, k, v;
	for (let i in pars) {
		kv = pars[i].split("=");
		k = kv[0];
		v = kv[1];
		res[k] = decodeURIComponent(v);
	}
	return res;
}

export default function(youtubeUrl) {
	if (!validateUrl(youtubeUrl)) {
		throw "Please enter a valid Youtube URL";
		return;
	}
	const videoId = youtubeUrl.split("?")[1].match(/v=([^&]+)/)[1];
	return fetch(VIDEO_URL + videoId)
		.then(res => res.text())
		.then(res => {
			const get_video_info = qsToJson(res);

			// remapping urls into an array of objects
			let tmp = get_video_info["url_encoded_fmt_stream_map"];
			if (tmp) {
				tmp = tmp.split(",");
				for (let i in tmp) {
					tmp[i] = qsToJson(tmp[i]);
					tmp[i].ext = tmp[i].type
						.match(/^video\/\w+(?=;)/g)[0]
						.replace(/^video\//, "");
				}
				get_video_info["videos"] = tmp;
			}
			get_video_info.title = get_video_info.title.replace(/\+/g, " ");
			return get_video_info;
		});
}
