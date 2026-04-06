import axios from "axios";
import Promise from "../../PromiseV2";
function fetchOverall(ign) {
	if (!ign) {
		console.error("IGN is missing or undefined.");
		return Promise.resolve(null);
	}
	return axios
		.get(`https://api.skywarstools.com/api/overall?player=${ign}`, {
			headers: { "User-Agent": "Mozilla/5.0 (ChatTriggers)", "Content-Type": "application/json; charset=UTF-8" },
		})
		.then((response) => response.data)
		.catch((error) => {
			if (error.response) {
				console.error("Error: ", JSON.stringify(error.response.data, null, 2));
			} else if (error.request) {
				console.error("No response received:", error.request);
			} else {
				console.error("Request setup error:", error.message);
			}
			return null;
		});
}
function fetchNames(ign) {
	if (!ign) {
		console.error("IGN is missing or undefined.");
		return Promise.resolve(null);
	}
	return axios
		.get(`https://api.skywarstools.com/api/snapshotKeys?player=${ign}`, {
			headers: { "User-Agent": "Mozilla/5.0 (ChatTriggers)", "Content-Type": "application/json; charset=UTF-8" },
		})
		.then((response) => response.data)
		.catch((error) => {
			if (error.response) {
				console.error("Error: ", JSON.stringify(error.response.data, null, 2));
			} else if (error.request) {
				console.error("No response received:", error.request);
			} else {
				console.error("Request setup error:", error.message);
			}
			return null;
		});
}

// Expose for CommonJS consumers and Rhino global scope.
module.exports = {
	fetchOverall,
	fetchNames,
};

global.fetchOverall = fetchOverall;
global.fetchNames = fetchNames;
