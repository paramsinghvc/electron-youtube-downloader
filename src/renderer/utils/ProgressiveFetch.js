export default (url, options) => {
	return fetch(url).then(res => {
		if (!res.ok) {
			console.log("resp", res);
			throw Error(`${res.status}: ${res}`);
		}
		if (!res.body) {
			throw Error("ReadableStream not yet supported in this browser.");
		}

		const contentLength = res.headers.get("Content-Length");
		if (!contentLength) {
			throw Error("Content-Length response header unavailable");
		}

		const total = parseInt(contentLength, 10);
		let loaded = 0;

		options.initAction();
		return new Response(
			new ReadableStream({
				start: controller => {
					const reader = res.body.getReader();
					let startTime = Date.now();
					let downlinkSpeed = 0;
					const read = () => {
						reader
							.read()
							.then(context => {
								if (context.done) {
									controller.close();
									return;
								}
								const { byteLength } = context.value;
								loaded += byteLength;
								console.log("loaded", Math.round(loaded));
								const MegaBytes = byteLength / (1024 * 1024);
								downlinkSpeed =
									Date.now() - startTime === 0
										? downlinkSpeed
										: MegaBytes / ((Date.now() - startTime) / 1000);

								options.updateAction({
									loaded: (loaded / total) * 100,
									speed: downlinkSpeed.toFixed(2) + " Mbps"
								});
								controller.enqueue(context.value);
								startTime = Date.now();
								read();
							})
							.catch(err => {
								controller.error(err);
								console.error(err);
								throw Error(err);
							});
					};
					read();
				}
			})
		);
	});
};
