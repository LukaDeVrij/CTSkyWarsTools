/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />
import { renderBeacon } from "../../Apelles/index";

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

register("chat", (team, players, event) => {
	teams = teams.concat(team); // Add the new team to the existing list

	// Figure out which team we are
	let playerName = Player.getName();
	if (players.includes(playerName)) {
		// We are in this team
		playerTeam = team;
		console.log("Player is on team " + team);

		chatTimeout = setTimeout(() => {
			switch (currentMode) {
				case "solo":
					displayTeamPositions(12, event);
					break;
				case "teams":
					displayTeamPositions(12, event);
					break;
				case "mini":
					displayTeamPositions(4, event);
					break;
				default:
					displayTeamPositions(99999, event);
					break;
			}
		}, 1);
	}
	event.setCanceled(true);
})
	.setCriteria("Team #${amount}: ${players}")
	.setContains();

register("renderWorld", myWorldRender);

function myWorldRender() {
	const colour = [1, 0, 0, 1];
	if (playerTeam !== 0) renderBeacon(colour, playerIslandX, 0, playerIslandZ);
}

function displayTeamPositions(maxPlayers, event) {
	ChatLib.chat("&cYour team: " + playerTeam);
	for (let i = 0; i < teams.length; i++) {
		if (teams[i] == playerTeam) break;

		let offset = teams[i] - playerTeam;
		let direction = offset > 0 ? "right" : "left";
		offset = Math.abs(offset);

		// If going the other way around is shorter, use that instead
		if (offset > maxPlayers / 2) {
			offset = maxPlayers - offset;
			direction = direction === "right" ? "left" : "right";
		}
		let suffix = new TextComponent(" (" + offset + " islands " + direction + " of you)");

		const msg = ChatLib.getChatMessage(event, true);
		ChatLib.chat(new Message(msg).addTextComponent(suffix));
		
	}
}

register("worldLoad", () => {
	if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
	worldLoadTimeout = setTimeout(() => {
		teams = []; // Reset teams on world load
		playerTeam = 0; // Reset player team on world load
		playerIslandX = 0;
		playerIslandZ = 0;
	}, 500);
});

