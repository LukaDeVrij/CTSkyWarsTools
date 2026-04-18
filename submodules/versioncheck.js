let metadata = JSON.parse(FileLib.read("CTSkyWarsTools", "metadata.json"));
let upToDate = false;
let latestVersion = null;
let currentVersion = metadata.version;
let latestVersionURL = null;
let alreadyChecked = false;

function parseVersion(version) {
	return String(version || "")
		.trim()
		.replace(/^v/i, "")
		.split("-")[0]
		.split(".")
		.map((part) => parseInt(part, 10) || 0);
}

function compareVersions(leftVersion, rightVersion) {
	let leftParts = parseVersion(leftVersion);
	let rightParts = parseVersion(rightVersion);
	let length = Math.max(leftParts.length, rightParts.length);

	for (let index = 0; index < length; index++) {
		let leftPart = leftParts[index] || 0;
		let rightPart = rightParts[index] || 0;

		if (leftPart > rightPart) return 1;
		if (leftPart < rightPart) return -1;
	}

	return 0;
}

register("worldload", () => {
	if (alreadyChecked) return;
	alreadyChecked = true;
	console.log("[CTSWT] Checking for latest version...");
	fetchVersion().then((response) => {
		
		console.log(response.success ? "[CTSWT] Successfully fetched version data." : "[CTSWT] Failed to fetch version data.");
		latestVersion = response.releases[0].tag_name;
		currentVersion = metadata.version;
		latestVersionURL = response.releases[0].html_url;
		let versionComparison = compareVersions(currentVersion, latestVersion);

		if (versionComparison === 0) {
			upToDate = true;
		} else {
			upToDate = false;
		}

		if (upToDate) {
			ChatLib.chat("&aYou are using the latest version of CTSkyWarsTools! (&f" + currentVersion + "&a)");
			console.log("[CTSWT] Module is up to date with latest public release version!")
		} else if (versionComparison > 0) {
			console.log("[CTSWT] Module version is higher than latest public release version.");
			ChatLib.chat("&6&m--------------------------------------------------------");
			ChatLib.chat("&e&lYou are running a beta of CTSkyWarsTools.");
			ChatLib.chat(`&7Currently installed:&f ${currentVersion}`);
			ChatLib.chat(`&7Latest public release:&f ${latestVersion}`);
			ChatLib.chat(`&6Thanks for testing!`);
			ChatLib.chat("&6&m--------------------------------------------------------");
		} else {
			console.log("[CTSWT] This version of the CTSkyWarsTools module is outdated! Download the latest please!")
			ChatLib.chat(`&6&m--------------------------------------------------------`);
			ChatLib.chat("&c&lA new version is available for CTSkyWarsTools!");
			ChatLib.chat(`&7Current:&f ${currentVersion}`);
			ChatLib.chat(`&7Latest:&f ${latestVersion}`);
			ChatLib.chat(`&bDownload:&f ${latestVersionURL}`);
			ChatLib.chat("&7Author:&f Luka // LifelessNerd");
			ChatLib.chat("&7Info:&f https://skywarstools.com/tools/CTSkyWarsTools");
			ChatLib.chat(`&6&m--------------------------------------------------------`);
		}
	});
});
