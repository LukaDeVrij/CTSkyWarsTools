
// Global variables
let currentlyInGame = false;
let accumulatedEXP = 0; //Gets reset on game start

let screenWidth = Renderer.screen.getWidth();
let screenHeight = Renderer.screen.getHeight();


const display = new Display();
display.setAlign("right");
display.addLine('§6EXP This Game: §d0');
display.setRenderLoc(screenWidth - 5,5);



register("chat", (amount, event) => {
    accumulatedEXP += parseInt(amount);
    display.setLine(0, '§6EXP This Game: §d' + accumulatedEXP);
}).setCriteria("+${amount} SkyWars Experience").setContains();


register("chat", (event) => {
    accumulatedEXP = 0;
    display.setLine(0, '§6EXP This Game: §d' + accumulatedEXP);
    display.setRenderLoc(screenWidth - 5,5); //Occasionally set the location - on first startup screen is smaller so sometimes its not in the right place
}).setCriteria("&r&eCages opened! &r&cFIGHT!&r").setContains();


register("renderOverlay", myRenderOverlay);


function myRenderOverlay() {
    display.render();
}
