/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />

import { setTimeout, clearTimeout } from "../imports/setTimeout/index";
import PogObject from "../imports/PogData/index.js";

let dodgingEngaged = false;
let timeout = null;
let shiftChecker = null;

let dodgeMapsData = new PogObject(
	"CTSkyWarsTools",
	{
		dodgeList: ["Chronos"],
	},
	"autododgemaps"
);

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

const sound = new Sound({ source: "alert.ogg" });
sound.setCategory("master");
sound.setVolume(1);

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

function initiateDodgeCheck() {
	try {
		// First we check mode and max players
		let mode = Scoreboard.getLines()[2].getName().split("Mode: ")[1];
		let map = Scoreboard.getLines()[3].getName().split("Map: ")[1];
		let maxPlayers = Scoreboard.getLines()[7].getName().split("Players: ")[1];

		let command = "play ";
		map = map.replaceAll("§a", "");
		mode = mode.replace(/[^a-zA-Z0-9\/ ]/g, "");
		map = map.replace(/[^a-zA-Z0-9\/ ]/g, "");
		maxPlayers = maxPlayers.replace(/[^a-zA-Z0-9\/ ]/g, "");

		if (!mode || !map || !maxPlayers) {
			// We are not in a game
			dodgingEngaged = false;
			soundI = 0;
			return;
		}
		console.log("Checking if we should dodge...");
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
		if (!dodgeMapsData.dodgeList.includes(map)) {
			console.log(map + " is not in the dodge list");
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
		console.warn("Error in initiateDodgeCheck. We are probably not in SkyWars.");
		//console.error(e);
		dodgingEngaged = false;
		soundI = 0;
	}
}

// Player interaction
register("command", (...args) => {
	if (!args[0]) {
		ChatLib.chat("Usage:\n/autododge add <mapName>\n/autododge remove <mapName>\n/autododge list");
		return;
	}

	const subcommand = args[0].toLowerCase();
	switch (subcommand) {
		case "list":
			if (dodgeMapsData.dodgeList.length === 0) {
				ChatLib.chat("&eDodge list is empty.");
			} else {
				ChatLib.chat("&aDodge list: &e" + dodgeMapsData.dodgeList.join(", "));
			}
			break;
		case "add":
			if (args[1]) {
				const mapName = args.slice(1).join(" ");
				if (!dodgeMapsData.dodgeList.includes(mapName)) {
					dodgeMapsData.dodgeList.push(mapName);
					dodgeMapsData.save();
					ChatLib.chat(`&aAdded &e${mapName} &ato dodge list.`);
				} else {
					ChatLib.chat(`&e${mapName} &cis already in the dodge list.`);
				}
			} else {
				ChatLib.chat("Usage:\n/autododge add <mapName>\n/autododge remove <mapName>\n/autododge list");
			}
			break;
		case "remove":
			if (args[1]) {
				const mapName = args.slice(1).join(" ");
				const index = dodgeMapsData.dodgeList.indexOf(mapName);
				if (index !== -1) {
					dodgeMapsData.dodgeList.splice(index, 1);
					dodgeMapsData.save();
					ChatLib.chat(`&aRemoved &e${mapName} &afrom dodge list.`);
				} else {
					ChatLib.chat(`&e${mapName} &cis not in the dodge list.`);
				}
			} else {
				ChatLib.chat("Usage:\n/autododge add <mapName>\n/autododge remove <mapName>\n/autododge list");
			}
			break;
		default:
			ChatLib.chat("Usage:\n/autododge add <mapName>\n/autododge remove <mapName>\n/autododge list");
			break;
	}
}).setName("autododge");
