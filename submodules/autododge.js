import { setTimeout, clearTimeout } from "../imports/setTimeout/index";
const sound = new Sound({ source: "alert.ogg" });
sound.setCategory("master");
sound.setVolume(1);

let dodgingEngaged = false;
let timeout = null;
let shiftChecker = null;

let dodgeList = [
	"Firelink Shrine",
	"Onionring 2",
	"Onionring",
	"Chronos",
	"Shaohao",
	"Embercell",
	"Sanctuary",
	"Aku",
	"Elven",
	"Palette",
];

let soundI = 0;
//Cancels dodging if the player is sneaking
register("step", () => {
	if (Player.isSneaking() && dodgingEngaged) {
		clearTimeout(timeout);
		ChatLib.chat("&cDodging cancelled!");
		Client.showTitle("", "&cDodging cancelled", 0, 20, 0);
		dodgingEngaged = false;
		soundI = 0;
	}
}).setDelay(1);

// Prevents dodging if the game starts in 1 second
register("chat", (event) => {
	if (dodgingEngaged) {
		clearTimeout(timeout);
		ChatLib.chat("&cCould not queue yet, went to lobby!");
		Client.showTitle("", "&cDodging cancelled", 0, 20, 0);
		dodgingEngaged = false;
		soundI = 0;
		ChatLib.command("lobby");
	}
})
	.setCriteria("The game starts in 1 second!")
	.setExact();

register("worldLoad", () => {
	if (dodgingEngaged) {
		clearTimeout(timeout);
		dodgingEngaged = false;
		soundI = 0;
	}
	if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
	worldLoadTimeout = setTimeout(() => {
		initiateDodgeCheck();
	}, 500);
});

function initiateDodgeCheck() {
	try {
		// First we check mode and max players
		let mode = Scoreboard.getLines()[2].getName().split("Mode: ")[1];
		let map = Scoreboard.getLines()[3].getName().split("Map: ")[1];
		let maxPlayers = Scoreboard.getLines()[7].getName().split("Players: ")[1];

		let command = "play ";
		console.log(map);
		map = map.replaceAll("§a", "");
		mode = mode.replace(/[^a-zA-Z0-9\/ ]/g, "");
		map = map.replace(/[^a-zA-Z0-9\/ ]/g, "");
		maxPlayers = maxPlayers.replace(/[^a-zA-Z0-9\/ ]/g, "");
		console.log(map);

		if (!mode || !map || !maxPlayers) {
			// We are not in a game
			dodgingEngaged = false;
			soundI = 0;
			return;
		}
		ChatLib.chat("Checking if we should dodge...");
		if (maxPlayers.includes("/12")) {
			command += "solo_";
		} else {
			// Do not dodge if the game is not solo
			return;
		}
		if (mode.includes("Normal")) {
			command += "normal";
		} else {
			// Do not dodge if the game is insane/mini/mega
			return;
		}

		// We are in solo normal mode, now we check if the map is in the dodge list
		ChatLib.chat("map: " + map);
		if (!dodgeList.includes(map)) {
			console.log(map + " is not in the dodge list");
			ChatLib.chat("Not dodging map: " + map);
			return;
		}

		// We dodging now
		ChatLib.chat("&aMap &e" + map + "&a is on dodge list! Dodging in &e5&a seconds...");
		ChatLib.chat("&cSNEAK TO CANCEL");
		Client.showTitle("&cDodging " + map, "SNEAK TO CANCEL", 20, 100, 20);
		sound.play();

		// Engage dodge in 5 seconds
		timeout = setTimeout(() => {
			if (!dodgingEngaged) {
				return;
			}
			if (shiftChecker) {
				clearInterval(shiftChecker);
			}

			ChatLib.command(command);
		}, 4500);

		dodgingEngaged = true;
	} catch (e) {
		console.error("Error in initiateDodgeCheck: ", e);
		ChatLib.chat("&cAn error occurred while checking for dodging");
		dodgingEngaged = false;
		soundI = 0;
	}
}
