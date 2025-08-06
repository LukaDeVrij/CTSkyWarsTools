import axios from "axios";
import Promise from "../../PromiseV2"
import { setTimeout, clearTimeout, setInterval } from '../imports/setTimeout/index';

let cache = {};
let fetchings = 0;
let setAmount = 0;
let tablist = [];



register("command", (username) => {
    if (!username) {
        ChatLib.chat('&cUsername is missing or undefined.');
        return;
    }
    fetchInfo(username).then((data) => {

        if (!data) {
            console.log('Player does not exist or is nicked. (2)');
            ChatLib.chat('Player does not exist or is nicked. (2)');
            return;
        }

        if (data.display.levelFormattedWithBrackets === undefined) {
            console.log('Player does not exist or is nicked. (1)');
            ChatLib.chat('Player does not exist or is nicked. (1)');
            return;
        }
        ChatLib.chat(data.display.levelFormattedWithBrackets);
    });

}).setTabCompletions((args) => {

    return World.getAllPlayers()
        .filter(player => player !== this.player && player.getName().toLowerCase().startsWith(args[0]?.toLowerCase() || ""))
        .map(player => player.getName());

}).setName('swt');

register("worldLoad", () => {
    if (typeof worldLoadTimeout !== "undefined") clearTimeout(worldLoadTimeout);
    worldLoadTimeout = setTimeout(() => {
        // Place your worldLoad logic here if needed
        if (isInSkyWars()) {
            tablist = Player.getPlayer().field_71174_a.func_175106_d().map(v => v.func_178845_a().getName());
            fetchTablist(tablist);
        }
    }, 500);

});

register("chat", (player, event) => {
    if (!isInSkyWars()) return;
    if (player == Player.getName()) return;
    if (Object.keys(cache).includes(player)) {
        let prefix = cache[player];
        setTabName(prefix, player);
        return;
    }
    fetchInfo(player)
        .then((data) => {
            // If it errors, data is undefined, this is handled in functions below
            let prefix = saveResponseInCache(data, player);
            setTabName(prefix, player);
        })

}).setCriteria("${player} has joined").setContains();

function fetchInfo(ign) {
    if (!ign) {
        console.error('IGN is missing or undefined.');
        return Promise.resolve(null);
    }
    console.log("Fetching data for " + ign);
    fetchings++;

    return axios.get(`https://skywarstools.com/api/skywars?player=${ign}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (ChatTriggers)', 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(response => response.data)
        .catch(error => {
            if (error.response) {
                console.error('Error: ', JSON.stringify(error.response.data, null, 2));
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Request setup error:', error.message);
            }
            return null;
        });
}


function fetchTablist(tablist) {
    let i = 0;
    let promises = tablist.map((playerName, index) => {
        if (Object.keys(cache).includes(playerName)) {
            let prefix = cache[playerName];
            setTabName(prefix, playerName);
            return Promise.resolve();
        }
        setTimeout(() => {
            fetchInfo(playerName).then((data) => {
                let prefix = saveResponseInCache(data, playerName);
                setTabName(prefix, playerName);
            });
        }, i * 2000); // Delay consecutive requests
        i++;
    });
}

function saveResponseInCache(data, player) {
    let prefix = "";
    if (!data) {
        prefix = "&c[?] ";

    } else if (!data.display.levelFormattedWithBrackets) {
        prefix = "&c[?] ";

    } else {
        prefix = data.display.levelFormattedWithBrackets;

    }
    cache[player] = prefix;
    return prefix;
}

function setTabName(prefix, playerName) {
    if (prefix == undefined || prefix == null) {
        prefix = "&c[?] ";
    }
    console.log("Setting tab name for " + playerName + " to " + prefix);
    let player = World.getPlayerByName(playerName);
    if (player == null) {
        return;
    }
    let currentTabName = player.getDisplayName();
    let currentTabNameWithPrefix = new TextComponent(prefix + currentTabName.getText());
    console.log("Set to " + currentTabNameWithPrefix.getText());
    player.setTabDisplayName(currentTabNameWithPrefix);

    setAmount++;
}

register("chat", (event) => {

    if (!isInSkyWars()) return;
    tablist = Player.getPlayer().field_71174_a.func_175106_d().map(v => v.func_178845_a().getName());
    tablist.forEach(playerName => {
        if (cache[playerName] === undefined) {
            let prefix = "&c[?] ";
            ChatLib.chat(prefix + " - " + playerName);
            setTabName(prefix, playerName);
        } else {
            ChatLib.chat(cache[playerName] + " - " + playerName);
            setTabName(cache[playerName], playerName);
        }

    });

}).setCriteria("is not allowed").setContains();


function isInSkyWars() {
    let title = Scoreboard.getTitle();
    let mode = Scoreboard.getLines()[2].getName().split(" ")[1];
    if (title.includes("SKYWARS") && mode.includes('Normal')) {

        return true;

    } else {
        return false;

    }
}