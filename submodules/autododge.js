/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />

import { setTimeout, clearTimeout } from "../../setTimeout/index";
import PogObject from "../../PogData/index";

import settings from "../amaterasu/config";

let dodgingEngaged = false;
let timeout = null;
let shiftChecker = null;

let dodgeMapsData = new PogObject(
	"CTSkyWarsTools",
	{
		dodgeList: ["Chronos"],
	},
	"autododgemaps.json"
);

register("worldLoad", () => {
	if (!settings.autododgeEnabled) return;

	if (dodgingEngaged) {
		clearTimeout(timeout);
		dodgingEngaged = false;
	}
	if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
	worldLoadTimeout = setTimeout(() => {
		initiateDodgeCheck();
	}, 500);
});

const sound = new Sound({ source: "alert.ogg" });
sound.setCategory("master");
sound.setVolume(1);

//Cancels dodging if the player is sneaking
register("step", () => {
	if (Player.isSneaking() && dodgingEngaged) {
		clearTimeout(timeout);
		ChatLib.chat("&cDodging cancelled!");
		Client.showTitle("", "&cDodging cancelled", 0, 20, 0);
		dodgingEngaged = false;
	}
}).setDelay(1);

// Prevents dodging if the game starts in 1 second
register("chat", (event) => {
	if (dodgingEngaged) {
		clearTimeout(timeout);
		Client.showTitle("", "&cDodging cancelled", 0, 20, 0);

		dodgingEngaged = false;

		if (settings.autododgeLobby) {
			ChatLib.chat(
				"&cCould not queue yet, went to lobby as a last resort! Wanted to play anyway? Change this setting in the config."
			);
			ChatLib.command("lobby");
		}
	}
})
	.setCriteria("The game starts in 1 second!")
	.setExact();

function initiateDodgeCheck() {
	let mode;
	let map;
	let maxPlayers;
	try {
		// First we check mode and max players
		mode = Scoreboard.getLines()[2].getName().split("Mode: ")[1];
		map = Scoreboard.getLines()[3].getName().split("Map: ")[1];
		maxPlayers = Scoreboard.getLines()[7].getName().split("Players: ")[1];

		let command = "play ";
		map = map.replaceAll("§a", "");
		mode = mode.replace(/[^a-zA-Z0-9\/ ]/g, "");
		map = map.replace(/[^a-zA-Z0-9\/ ]/g, "");
		maxPlayers = maxPlayers.replace(/[^a-zA-Z0-9\/ ]/g, "");

		if (!mode || !map || !maxPlayers) {
			// We are not in a game
			dodgingEngaged = false;
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
		} else if (mode.includes("Insane")) {
			command += "insane";
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
		if (settings.autododgeSoundEnabled) sound.play();

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
		console.warn("map: " + map + ", mode: " + mode + ", maxPlayers: " + maxPlayers);
		dodgingEngaged = false;
	}
}

// Player interaction
register("command", (...args) => {
	if (!args[0]) {
		ChatLib.chat("Autododge Status: " + (settings.autododgeEnabled ? "&aEnabled" : "&cDisabled"));
		ChatLib.chat("Usage:\n/autododge add <mapName>\n/autododge remove <mapName>\n/autododge list");
		return;
	}

	const subcommand = args[0].toLowerCase();
	switch (subcommand) {
		case "list":
			if (dodgeMapsData.dodgeList.length === 0) {
				ChatLib.chat("&eDodge list is empty.");
			} else {
				ChatLib.chat("&cYou will autododge the following maps in Solo Normal/Insane:");
				ChatLib.chat("&a" + dodgeMapsData.dodgeList.join("&e, &a"));
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
