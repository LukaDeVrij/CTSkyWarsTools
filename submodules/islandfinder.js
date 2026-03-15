/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />
import { renderBeacon } from "../../Apelles/index";



register("chat", (event) => {
	let text = event.message.toString();

	// teams = text.match(/Team #(\d+)/g).map((t) => Number(t.replace("Team #", "")));
	// console.log(teams);
})
	.setCriteria("Mode: SOLO")
	.setContains();

register("renderWorld", myWorldRender);

const TOTAL_TEAMS = 12;
const RADIUS = 10; // Distance from player to place each icon, adjust as needed


function getIslandOffset(teamNumber, totalTeams) {
    const angle = ((teamNumber - 1) / totalTeams) * 2 * Math.PI;
    return {
        x: Math.sin(angle) * RADIUS,
        z: -Math.cos(angle) * RADIUS, // North = -Z in Minecraft
    };
}
let teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Example team numbers

function myWorldRender() {
    const colour = [1, 0, 0, 1];
    for (let i = 0; i < teams.length; i++) {
        const teamNum = teams[i];
        const offset = getIslandOffset(teamNum, TOTAL_TEAMS);
		console.log("x: " + offset.x)
		console.log("z: " + offset.z)
        renderBeacon(
            colour,
            Player.getX() + offset.x,
            Player.getY(),
            Player.getZ() + offset.z,
        );
    }
}
