/// <reference types="../../CTAutocomplete/asm" />
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
	"autododgemaps.json",
);

register("worldLoad", () => {
	if (!settings.autododgeEnabled) return;

	if (dodgingEngaged) {
		clearTimeout(timeout);
		dodgingEngaged = false;
	}
	if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
	worldLoadTimeout = setTimeout(() => {
		ChatLib.command("locraw");
	}, 500);
});

//Cancels dodging if the player is sneaking
register("step", () => {
	if (Player.isSneaking() && dodgingEngaged) {
		clearTimeout(timeout);
		ChatLib.chat("&cDodging cancelled!");
		ChatLib.chat("&aWant to remove this map from the dodge list? Use &6/autododge remove <mapName>");
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
				"&cCould not queue yet, went to lobby as a last resort! Wanted to play anyway? Change this setting in the config.",
			);
			ChatLib.command("lobby");
		}
	}
})
	.setCriteria("The game starts in 1 second!")
	.setExact();

register("chat", (event) => {
	if (dodgingEngaged) {
		clearTimeout(timeout);

		dodgingEngaged = false;

		ChatLib.chat("&cGame started too quickly... Sorry about that!");
	}
})
	.setCriteria("Cages opened! FIGHT!")
	.setExact();

// Cancel other locraws, user never wants to see this
register("chat", (server, event) => {
	event.setCanceled(true);
})
	.setCriteria('{"server":"${server}"')
	.setContains();

// Listen for the locraw with map info, this is the only one we want
register("chat", (server, gametype, mode, map, event) => {
	event.setCanceled(true);
	if (!settings.autododgeEnabled) return;
	if (gametype !== "SKYWARS") return;

	if (!dodgeMapsData.dodgeList.includes(map)) {
		console.log("[CTSWT]  " + map + " is not in the dodge list");
		return;
	}

	let command = "play " + mode;

	// We dodging now
	dodgingEngaged = true;
	ChatLib.chat("&aMap &e" + map + "&a is on dodge list! Dodging in &e5&a seconds...");
	ChatLib.chat("&cSNEAK TO CANCEL");
	Client.showTitle("&cDodging " + map, "SNEAK TO CANCEL", 20, 100, 20);
	if (settings.autododgeSoundEnabled) {
		timeout = setTimeout(() => {
			World.playSound("random.orb", 1.0, 0.5);
		}, 1);
		timeout = setTimeout(() => {
			World.playSound("random.orb", 1.0, 1);
		}, 100);
		timeout = setTimeout(() => {
			World.playSound("random.orb", 1.0, 1.5);
		}, 200);
	}

	// Engage dodge in 5 seconds
	timeout = setTimeout(() => {
		if (shiftChecker) {
			clearInterval(shiftChecker);
		}
		console.log("[CTSWT] Executing " + command);
		ChatLib.command(command);
		dodgingEngaged = false;
	}, 4500);
})
	.setCriteria('{"server":"${server}","gametype":"${gametype}","mode":"${mode}","map":"${map}"}')
	.setExact();
// {"server":"mini157AW","gametype":"SKYWARS","mode":"solo_normal","map":"Firelink Shrine"}

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
