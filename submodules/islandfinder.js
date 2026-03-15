/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />
import { renderBeacon } from "../../Apelles/index";

let teams = []; // Example team numbers

register("chat", (event) => {
	console.log("first")
	let text = event.message.toString();
	// Extract all team numbers as numbers, or set to empty array if none found
	const matches = text.match(/Team #(\d+)/g);
	teams = matches ? matches.map((t) => Number(t.replace("Team #", ""))) : [];
})
	.setCriteria("Mode: SOLO")
	.setContains();

register("chat", (team, event) => {
	teams = teams.concat(team); // Add the new team to the existing list
})
	.setCriteria("Team #${amount}: ")
	.setContains();

register("renderWorld", myWorldRender);

const TOTAL_TEAMS = 12;
const RADIUS = 50;

function getIslandOffset(teamNumber, totalTeams) {
	const angle = ((teamNumber - 1) / totalTeams) * 2 * Math.PI;
	return {
		x: Math.sin(angle) * RADIUS,
		z: -Math.cos(angle) * RADIUS, // North = -Z in Minecraft
	};
}

function myWorldRender() {
	const colour = [1, 0, 0, 1];
	for (let i = 0; i < teams.length; i++) {
		let teamNum = teams[i];
		let offset = getIslandOffset(teamNum, TOTAL_TEAMS);
		renderBeacon(colour, 0 + offset.x, Player.getY(), 0 + offset.z);
	}
}

register("worldLoad", () => {

	if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
	worldLoadTimeout = setTimeout(() => {
		teams = []; // Reset teams on world load
	}, 500);
});