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

register("chat", (mult, event) => {
	accumulatedEXP *= parseFloat(mult);
	display.setLine(0, settings.experienceDisplayString.replace("{exp}", accumulatedEXP));
})
	.setCriteria("x{mult} SkyWars Experience")
	.setContains();

register("chat", (event) => {
	if (settings.experienceShowTemp) display.setShouldRender(false);
	// We update this once we are in a game, assuming the screen is them the correct size (in fullscreen or whatever)
	if (gotScreenSize === false) {
		screenWidth = Renderer.screen.getWidth();
		screenHeight = Renderer.screen.getHeight();

		display.setRenderLoc(screenWidth - parseInt(settings.experienceXLoc), parseInt(settings.experienceYLoc));
		gotScreenSize = true;
	}

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
	if (settings.experienceShowTemp) display.setShouldRender(true);
})
	.setCriteria("You won! Want to play again? Click here!")
	.setContains();

register("chat", (amount, event) => {
	if (settings.experienceShowTemp) display.setShouldRender(true);
})
	.setCriteria("You died! Want to play again? Click here!")
	.setContains();

register("chat", (server, gametype, event) => {
	// console.log(gametype);
	if (gametype.startsWith("SKYWARS")) {
		display.setShouldRender(true);
	} else {
		display.setShouldRender(false);
	}
	event.setCanceled(true);
})
	.setCriteria('{"server":"${server}","gametype":"${gametype}"')
	.setContains();

// Live update for config changes
settings.getConfig().registerListener("experienceEnabled", (oldText, newText) => {
	display.setShouldRender(newText);
});
settings.getConfig().registerListener("experienceDisplayString", (oldText, newText) => {
	display.setLine(0, newText.replace("{exp}", accumulatedEXP));
});
settings.getConfig().registerListener("experienceXLoc", (oldText, newText) => {
	display.setRenderLoc(screenWidth - parseInt(newText), parseInt(settings.experienceYLoc));
});
settings.getConfig().registerListener("experienceYLoc", (oldText, newText) => {
	display.setRenderLoc(screenWidth - parseInt(settings.experienceXLoc), parseInt(newText));
});
settings.getConfig().registerListener("experienceAlign", (oldText, newText) => {
	switch (newText) {
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
});
