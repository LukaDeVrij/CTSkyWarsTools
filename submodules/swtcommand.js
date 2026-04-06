/// <reference types="../../CTAutocomplete/asm" />
/// <reference lib="es2015" />
const { fetchOverall, fetchNames } = require("../utils/fetchers");

let subcommands = ["names", "config", "level", "stats", "autododge", "mining"];

register("command", (arg1, arg2, arg3, arg4, arg5, arg6) => {
	if (!arg1) {
		formatHelp();
		return;
	}
	if (!subcommands.includes(arg1.toLowerCase())) {
		formatHelp();
		return;
	}
	if (arg1.toLowerCase() === "config") {
		ChatLib.command("swtconfig", true);
		return;
	}
	if (arg1.toLowerCase() === "autododge") {
		ChatLib.command(`autododge ${arg2 || ""}`, true);
		return;
	}
	if (arg2 === undefined) {
		ChatLib.chat("&cUsername is missing or undefined.");
		return;
	}
	if (arg1.toLowerCase() === "level") {
		ChatLib.command(`swlevel ${arg2 || ""}`, true);
		return;
	}

	if (arg1.toLowerCase() === "names") {
		fetchNames(arg2).then((data) => {
			if (!data) {
				console.log("Player does not exist or is nicked. (2)");
				ChatLib.chat("Player does not exist or is nicked. (2)");
				return;
			}

			if (data.player === undefined) {
				console.log("Player does not exist or is nicked. (1)");
				ChatLib.chat("Player does not exist or is nicked. (1)");
				return;
			}
			formatNamesData(data);
		});
	}
	console.log(arg1)
	let needFetchOverall = ["stats", "mining"].includes(arg1.toLowerCase());
	if (needFetchOverall) {
		fetchOverall(arg2).then((data) => {
			if (!data) {
				console.log("Player does not exist or is nicked. (2)");
				ChatLib.chat("Player does not exist or is nicked. (2)");
				return;
			}

			if (data.player === undefined) {
				console.log("Player does not exist or is nicked. (1)");
				ChatLib.chat("Player does not exist or is nicked. (1)");
				return;
			}
			if (arg1.toLowerCase() === "stats") {
				formatOverallData(data);
			}
			if (arg1.toLowerCase() === "mining") {
				formatMiningData(data);
			}
		});
	}
})
	.setTabCompletions((args) => {
		return World.getAllPlayers()
			.filter(
				(player) =>
					player !== this.player &&
					player
						.getName()
						.toLowerCase()
						.startsWith(args[1]?.toLowerCase() || ""),
			)
			.map((player) => player.getName());
	})
	.setName("swt");

function formatHelp() {
	ChatLib.chat(`&6&m--------------------------------------------------------`);
	ChatLib.chat(`&aCTSkyWarsTools &b- &bA collection of tools for SkyWars`);
	ChatLib.chat(`&cBy LifelessNerd // Luka - A SkyWarsTools project`);
	ChatLib.chat(`&eSubcommands`);
	ChatLib.chat(`&b/swt config &7- Opens the config GUI`);
	ChatLib.chat(`&b/swt names <player> &7- Fetches all the past usernames of the player`);
	ChatLib.chat(`&b/swt level <player> &7- Fetches level of the player`);
	ChatLib.chat(`&b/swt stats <player> &7- Fetches overall stats of the player`);
	ChatLib.chat(`&b/swt autododge &7- Opens the autododge list`);
	ChatLib.chat(`&6&m--------------------------------------------------------`);
}

function formatOverallData(data) {
	ChatLib.chat(`&6&m--------------------------------------------------------`);
	ChatLib.chat(`&c&l${data.player}`);
	ChatLib.chat(
		new TextComponent(`&eLevel: &b${data.display.levelFormattedWithBrackets}`).setHover("show_text", `&a${data.display.active_scheme}`),
	);
	ChatLib.chat(`&eWins: &b${data.stats.wins}`);
	ChatLib.chat(`&eLosses: &b${data.stats.losses}`);
	ChatLib.chat(`&eWLR: &b${(data.stats.wins / (data.stats.losses === 0 ? 1 : data.stats.losses)).toFixed(2)}`);
	ChatLib.chat(`&eKills: &b${data.stats.kills}`);
	ChatLib.chat(`&eDeaths: &b${data.stats.deaths}`);
	ChatLib.chat(`&eKDR: &b${(data.stats.kills / (data.stats.deaths === 0 ? 1 : data.stats.deaths)).toFixed(2)}`);
	ChatLib.chat(`&eMax Prestige Kits: &b${data.stats.customs_kitsMaxPrestige}`);
	ChatLib.chat(`&6&m--------------------------------------------------------`);
}

function formatNamesData(data) {
	const uniquePlayers = [...new Set(data.data.map((entry) => entry.player))];

	let namesString = `&b${uniquePlayers.join("&8,&b ")}`;

	ChatLib.chat(`&6&m--------------------------------------------------------`);
	ChatLib.chat(`&ePlayer: &b${data.player}`);
	ChatLib.chat(`&eUnique Names: &b${uniquePlayers.length}`);
	ChatLib.chat(namesString);
	ChatLib.chat(`&eTotal Snapshots: &b${data.data.length}`);
	ChatLib.chat(`&6&m--------------------------------------------------------`);
}

function formatMiningData(data) {
	ChatLib.chat(`&6&m--------------------------------------------------------`);
	ChatLib.chat(`&c&l${data.player} &7- &bMining Stats`);
	ChatLib.chat(`&8Can be used to estimate how likely a player is to be mining.`);
	
	const blocksBrokenRatio = (data.stats.blocks_broken / data.stats.blocks_placed).toFixed(2);
	const killWinRatio = (data.stats.kills_solo / (data.stats.wins_solo === 0 ? 1 : data.stats.wins_solo)).toFixed(2);
	const hasMiningPerks = JSON.stringify(data.stats.perkslot).includes("solo_mining_expertise") ? "Yes" : "No";
	
	const bbSeverity = blocksBrokenRatio > 0.1 ? "&c(High Risk)" : blocksBrokenRatio > 0.05 ? "&e(Medium Risk)" : "&a(Low Risk)";
	ChatLib.chat(`&eBlocks Broken Ratio: &b${blocksBrokenRatio} ${bbSeverity}`);
	const kwrSeverity = killWinRatio < 6 ? "&c(High Risk)" : killWinRatio < 5.5 ? "&e(Medium Risk)" : "&a(Low Risk)";
	ChatLib.chat(`&eKill/Win Ratio: &b${killWinRatio} ${kwrSeverity}`);
	const miningPerksText = hasMiningPerks === "Yes" ? "&bYes &c(High Risk)" : "&bNo &a(Low Risk)";
	ChatLib.chat(`&eHas Mining Perks: &b${miningPerksText}`);
	ChatLib.chat(`&6&m--------------------------------------------------------`);
}
