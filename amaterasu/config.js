/// <reference types="../../CTAutocomplete/asm" />
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
	.addTextInput({
		category: "EXP Display",
		configName: "experienceDisplayString",
		title: "Display String",
		description: "Customize the string that is displayed for the EXP display. Use &d{exp}&r to insert the amount of EXP.",
		placeHolder: "&6EXP This Game: &d{exp}",
		value: "&6EXP This Game: &d{exp}",
	})
	.addTextInput({
		category: "EXP Display",
		configName: "experienceXLoc",
		title: "X Location",
		description: "Horizontal location for the EXP display",
		placeHolder: "0",
		value: "0",
	})
	.addTextInput({
		category: "EXP Display",
		configName: "experienceYLoc",
		title: "Y Location",
		description: "Vertical location for the EXP display",
		placeHolder: "5",
		value: "5",
	})
	.addDropDown({
		category: "EXP Display",
		configName: "experienceAlign",
		title: "Alignment",
		description: "Alignment for the EXP display",
		options: ["left", "center", "right"],
		value: 2,
	})
	.addSwitch({
		category: "EXP Display",
		configName: "experienceShowTemp",
		title: "Show Only On Death/Win",
		description: "Only show the display when you die or win a game, instead of always, might take a bit to take effect",
		value: false,
	})

	.addSwitch({
		category: "SkyWars Levels",
		configName: "levelsEnabled",
		title: "Enable SkyWars Levels",
		description:
			"Enable automatic SkyWars levels to be shown when joining a game\nYou can use /swlevel <name> to show someone's level regardless",
		value: true,
	})

	.addSwitch({
		category: "Enhanced Who",
		configName: "islandFinderEnabled",
		title: "Enable Enhanced Who",
		description: "On /who, tells you where the other teams are relative to you",
		value: true,
	})
	.addSwitch({
		category: "Enhanced Who",
		configName: "islandFinderBeacon",
		title: "Render Island Beacon",
		description: "On /who, renders a beacon on your island",
		value: true,
	});

const config = new Settings("CTSkyWarsTools", defaultConf, "data/scheme-vigil.json")

	.addMarkdown("About", README)

	.setCommand("CTSkyWarsTools", ["swtools", "swtconfig", "skywarstools", "ctswt", "ctskywarstools"])


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
