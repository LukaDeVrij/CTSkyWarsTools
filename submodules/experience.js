/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />

import settings from "../amaterasu/config";

let accumulatedEXP = 0; //Gets reset on game start

let screenWidth = Renderer.screen.getWidth(); //Initial values can be wrong
let screenHeight = Renderer.screen.getHeight(); //Initial values can be wrong
let gotScreenSize = false;

const display = new Display();
display.setAlign("right");
if (settings.experienceShowTemp) {
	display.addLine("§6EXP Last Game: §d0");
} else {
	display.addLine("§6EXP This Game: §d0");
}
display.setRenderLoc(screenWidth - 5, 5);

register("chat", (amount, event) => {
	accumulatedEXP += parseInt(amount);
	if (settings.experienceShowTemp) {
		display.setLine(0, "§6EXP This Game: §d" + accumulatedEXP);
	} else {
		display.setLine(0, "§6EXP Last Game: §d" + accumulatedEXP);
	}
})
	.setCriteria("+${amount} SkyWars Experience")
	.setContains();

register("chat", (event) => {
	if (settings.experienceShowTemp) display.setShouldRender(false);
	// console.log(settings.experienceShowTemp);
	// We update this once we are in a game, assuming the screen is them the correct size (in fullscreen or whatever)
	if (gotScreenSize === false) {
		screenWidth = Renderer.screen.getWidth();
		screenHeight = Renderer.screen.getHeight();
		display.setRenderLoc(screenWidth - 5, 5);

		gotScreenSize = true;
	}

	accumulatedEXP = 0;
	if (settings.experienceShowTemp) {
		display.setLine(0, "§6EXP This Game: §d" + accumulatedEXP);
	} else {
		display.setLine(0, "§6EXP Last Game: §d" + accumulatedEXP);
	}
})
	.setCriteria("&r&eCages opened! &r&cFIGHT!&r")
	.setContains();

register("renderOverlay", myRenderOverlay);

function myRenderOverlay() {
	if (!settings.experienceEnabled) return;
	display.render();
}

register("chat", (amount, event) => {
	if (settings.experienceShowTemp) display.setShouldRender(true);
})
	.setCriteria("You won! Want to play again? Click here!")
	.setContains();

register("chat", (amount, event) => {
	if (settings.experienceShowTemp) display.setShouldRender(true);
})
	.setCriteria("You died! Want to play again? Click here!")
	.setContains();
