/// <reference types="../imports/CTAutocomplete/asm" />
/// <reference lib="es2015" />

import Settings from "../../Amaterasu/core/Settings";
import DefaultConfig from "../../Amaterasu/core/DefaultConfig";

const README = `${FileLib.read("CTSkyWarsTools", "README.md")}`;

const defaultConf = new DefaultConfig("CTSkyWarsTools", "data/settings.json")

	.addSwitch({
		category: "Autododge",
		configName: "autododgeEnabled",
		title: "Enable Autododge",
		description: "Whether to enable SkyWars Autododge",
		value: true,
	})
	.addButton({
		category: "Autododge",
		configName: "autododgeList",
		title: "Edit Autododge List",
		description: "Use /autododge to add/remove maps from the list",
		placeHolder: "Edit",
		onClick() {
			// Opens a book with map names
			ChatLib.command("autododge", true);
			config.closeGui();
			World.playSound("random.orb", 1.0, 1.0); // first pitch
		},
	})
	.addSwitch({
		category: "Autododge",
		configName: "autododgeSoundEnabled",
		title: "Enable Autododge Sound",
		description: "Whether to play a sound when dodging",
		value: true,
	})
	.addSwitch({
		category: "Autododge",
		configName: "autododgeLobby",
		title: "Lobby Last Resort",
		description: "If Hypixel prevents you from dodging (Please don't spam the command!), go to the lobby instead",
		value: true,
	})

	.addSwitch({
		category: "EXP Display",
		configName: "experienceEnabled",
		title: "Enable Experience Display",
		description: "Show the SkyWars EXP you earned this game",
		value: true,
	})
	.addSwitch({
		category: "EXP Display",
		configName: "experienceShowTemp",
		title: "Show Only On Death/Win",
		description: "Only show the display when you die or win a game, instead of always",
		value: false,
	})

	.addSwitch({
		category: "SkyWars Levels",
		configName: "levelsEnabled",
		title: "Enable SkyWars Levels",
		description:
			"Enable automatic SkyWars levels to be shown when joining a game\nYou can use /swlevel <name> to show someone's level regardless",
		value: true,
	});

const config = new Settings("CTSkyWarsTools", defaultConf, "data/scheme-vigil.json")

	.setCommand("CTSkyWarsTools", ["swtools", "swt", "skywarstools", "ctswt", "ctskywarstools"])

	.addMarkdown("About", README)

	.onOpenGui(() => {
		// ChatLib.chat("config gui has been opened");
	})
	.onCloseGui(() => {});

config
	.setPos(config.settings.x, config.settings.y)
	.setSize(config.settings.width, config.settings.height)
	.setScheme("data/scheme-vigil.json") // This is the path to the colorScheme file
	.apply();

export default config.settings;
