/// <reference types="../../CTAutocomplete/asm" />
/// <reference lib="es2015" />
import { renderBeacon } from "../../Apelles/index";
import settings from "../amaterasu/config";

let teams = []; // Example team numbers
let playerIslandX = 0;
let playerIslandZ = 0;
let playerTeam = 0;
let currentMode = "solo";

register("chat", (event) => {
	// Save position of your starting island for this game
	playerIslandX = Player.getX();
	playerIslandZ = Player.getZ();
})
	.setCriteria("&r&eCages opened! &r&cFIGHT!&r")
	.setContains();

register("chat", (mode, event) => {
	teams = [];
	currentMode = mode.toLowerCase();
})
	.setCriteria("Mode: ${mode}")
	.setContains();

let teamMessages = {}; // Store each team's raw chat message keyed by team number

register("chat", (team, players, event) => {
	if (!settings.islandFinderEnabled) return;
	
	team = parseInt(team); // Ensure it's a number
	teams[team] = players; // Store players under their team number

	teamMessages[team] = ChatLib.getChatMessage(event, true);

	let playerName = Player.getName();
	if (players.includes(playerName)) {
		playerTeam = team;
		console.log("[CTSWT] Player is on team " + team);

		chatTimeout = setTimeout(() => {
			switch (currentMode) {
				case "solo":
					displayTeamPositions(12);
					break;
				case "teams":
					displayTeamPositions(12);
					break;
				case "mini":
					displayTeamPositions(4);
					break;
				default:
					displayTeamPositions(99999);
					break;
			}
		}, 1);
		event.setCanceled(true);
	}
	
})
	.setCriteria("Team #${team}: ${players}")
	.setContains();

register("renderWorld", myWorldRender);

function myWorldRender() {
	const colour = [1, 0, 0, 1];
	if (playerTeam !== 0 && settings.islandFinderBeacon) {
		renderBeacon(colour, playerIslandX, 0, playerIslandZ);
	}
}
function displayTeamPositions(maxPlayers) {
	ChatLib.chat("&cYour team: " + playerTeam);
	let keys = Object.keys(teams);
	for (let i = 0; i < keys.length; i++) {
		let teamNum = parseInt(keys[i]);
		if (teamNum === playerTeam) {
			let suffix = new TextComponent(" (You)");
			let msg = teamMessages[teamNum];
			ChatLib.chat(new Message(msg).addTextComponent(suffix));
			continue;
		}

		let offset = teamNum - playerTeam;
		let direction = offset > 0 ? "right" : "left";
		offset = Math.abs(offset);

		if (offset > maxPlayers / 2) {
			offset = maxPlayers - offset;
			direction = direction === "right" ? "left" : "right";
		}

		let suffix = new TextComponent(" (" + offset + " islands " + direction + " of you)");
		let msg = teamMessages[teamNum];
		ChatLib.chat(new Message(msg).addTextComponent(suffix));
	}
}

register("worldLoad", () => {
	if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
	worldLoadTimeout = setTimeout(() => {
		teams = {}; // Reset teams on world load
		playerTeam = 0; // Reset player team on world load
		playerIslandX = 0;
		playerIslandZ = 0;
		teamMessages = {};
	}, 500);
});
