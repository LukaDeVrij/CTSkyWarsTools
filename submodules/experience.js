/// <reference types="../../CTAutocomplete/asm" />
/// <reference lib="es2015" />

import settings from "../amaterasu/config";

let accumulatedEXP = 0; //Gets reset on game start

let screenWidth = Renderer.screen.getWidth(); //Initial values can be wrong
let screenHeight = Renderer.screen.getHeight(); //Initial values can be wrong
let gotScreenSize = false;

const display = new Display();
switch (settings.experienceAlign) {
	case 0:
		display.setAlign("left");
		break;
	case 1:
		display.setAlign("center");
		break;
	case 2:
		display.setAlign("right");
		break;
}
display.addLine(settings.experienceDisplayString.replace("{exp}", accumulatedEXP));
display.setRenderLoc(screenWidth - parseInt(settings.experienceXLoc), parseInt(settings.experienceYLoc));

register("chat", (amount, event) => {
	accumulatedEXP += parseInt(amount);
	display.setLine(0, settings.experienceDisplayString.replace("{exp}", accumulatedEXP));
})
	.setCriteria("+${amount} SkyWars Experience")
	.setContains();

register("chat", (event) => {
	if (settings.experienceShowTemp) display.setShouldRender(settings.experienceShowTempInverted ? true : false);
	// We update this once we are in a game, assuming the screen is them the correct size (in fullscreen or whatever)
	if (gotScreenSize === false) {
		screenWidth = Renderer.screen.getWidth();
		screenHeight = Renderer.screen.getHeight();
		switch (settings.experienceAlign) {
			case 0:
				display.setAlign("left");
				break;
			case 1:
				display.setAlign("center");
				break;
			case 2:
				display.setAlign("right");
				break;
		}
		display.setRenderLoc(screenWidth - parseInt(settings.experienceXLoc), parseInt(settings.experienceYLoc));
		gotScreenSize = true;
	}

	accumulatedEXP = 0;
	display.setLine(0, settings.experienceDisplayString.replace("{exp}", accumulatedEXP));
})
	.setCriteria("&r&eCages opened! &r&cFIGHT!&r")
	.setContains();

register("renderOverlay", myRenderOverlay);

function myRenderOverlay() {
	if (!settings.experienceEnabled) return;
	display.render();
}

register("chat", (amount, event) => {
	if (settings.experienceShowTemp) display.setShouldRender(settings.experienceShowTempInverted ? false : true);
})
	.setCriteria("You won! Want to play again? Click here!")
	.setContains();

register("chat", (amount, event) => {
	if (settings.experienceShowTemp) display.setShouldRender(settings.experienceShowTempInverted ? false : true);
})
	.setCriteria("You died! Want to play again? Click here!")
	.setContains();
