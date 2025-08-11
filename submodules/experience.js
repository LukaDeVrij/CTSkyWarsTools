// Global variables
let currentlyInGame = false;
let accumulatedEXP = 0; //Gets reset on game start

let screenWidth = Renderer.screen.getWidth(); //Initial values can be wrong
let screenHeight = Renderer.screen.getHeight(); //Initial values can be wrong
let gotScreenSize = false;

const display = new Display();
display.setAlign("right");
display.addLine("§6EXP This Game: §d0");
display.setRenderLoc(screenWidth - 5, 5);

register("chat", (amount, event) => {
	accumulatedEXP += parseInt(amount);
	display.setLine(0, "§6EXP This Game: §d" + accumulatedEXP);
})
	.setCriteria("+${amount} SkyWars Experience")
	.setContains();

register("chat", (event) => {
	// We update this once we are in a game, assuming the screen is them the correct size (in fullscreen or whatever)
	if (gotScreenSize === false) {
		screenWidth = Renderer.screen.getWidth();
		screenHeight = Renderer.screen.getHeight();
		display.setRenderLoc(screenWidth - 5, 5);
        
		gotScreenSize = true;
	}

	accumulatedEXP = 0;
	display.setLine(0, "§6EXP This Game: §d" + accumulatedEXP);
})
	.setCriteria("&r&eCages opened! &r&cFIGHT!&r")
	.setContains();

register("renderOverlay", myRenderOverlay);

function myRenderOverlay() {
	display.render();
}
