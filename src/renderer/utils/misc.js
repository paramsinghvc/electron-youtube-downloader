export const downloadFileFromBlob = (blob, fileName) => {
	var link = document.createElement("a");
	link.href = window.URL.createObjectURL(blob);
	link.download = fileName || "video.mp4";
	link.click();
	window.URL.revokeObjectURL(link.href);
	// delete link;
};
