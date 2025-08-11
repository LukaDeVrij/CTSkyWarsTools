// Getting the necessary imports for this [ConfigGui] to work
import Settings from "../../Amaterasu/core/Settings";
import DefaultConfig from "../../Amaterasu/core/DefaultConfig";

// Here we get the current [Amaterasu]'s version
const version = JSON.parse(FileLib.read("CTSkyWarsTools", "metadata.json")).version;

// Making a markdown like changelog inside our [ConfigGui] with the previously gathered version as title
const CHANGELOG = `# §bCTSkyWarsTools v${version}\n ${FileLib.read("CTSkyWarsTools", "changelog.md")}`;

// We create our [DefaultConfig] instance
// and give it our [ModuleName] this is important since it'll be used to save the data
// and the [FilePath] this is also important since it'll be used to save the data
const defaultConf = new DefaultConfig("CTSkyWarsTools", "data/settings.json")
	// Now that we have our [DefaultConfig] instance we can start creating our configuration system
	// Here we'll be adding a simple button that copies a link into your clipboard
	// .addButton({
	//     category: "General", // Defining the category name
	//     configName: "MyDiscord", // Defining the configName which is later on used as the "variable" name
	//     title: "Discord Server", // The title for this [Button] to display in the [Gui]
	//     description: "Join if you want to report a bug or want to make a suggestion123", // The description for this [Button] to display in the [Gui]
	//     tags: ["maybe"], // This is a list of tags that will be able to find this [Button] whenever searching for them
	//     // ^ So if we search for "maybe" this [Button] will pop up in the results

	//     // Here we define the [onClick] function that will be ran whenever this button is clicked
	//     // the [Settings] instance is passed through it as a param incase you'd need to use this
	//     onClick(setting) {
	//         // [setting] is equals to the [config] variable we define at the bottom

	//         ChatLib.command("ct copy https://discord.gg/SK9UDzquEN", true)
	//         ChatLib.chat("&6Copied Discord Link!")

	//         // Using the [Settings] instance example:
	//         // ChatLib.chat(setting.settings.scheme)
	//         // ^ this will print the current value set [0 - 2] in the selection component below
	//     }
	// })
	// .addSwitch({
	//     category: null, // We can leave this [null] if we want the previously set category.
	//     // ^ in this case this will be set to `category: "GUI"`. note: this will only work if you HAVE previously set a category as we have above
	//     configName: "testingSwitch",
	//     title: "Testing switch",
	//     description: "this is a testing switch",
	//     subcategory: "Test",
	//     // This is how we register a listener from inside our config
	//     // this wil run whenever this specific config's value is changed
	//     registerListener(previousvalue, newvalue) {
	//         ChatLib.chat(`previous value: ${previousvalue}\nnew value: ${newvalue}`)
	//     }
	// })
	// .addButton({
	//     category: null,
	//     configName: "testingButtonHidden",
	//     title: "This is a hidden button",
	//     description: "This button will only show when the #shouldShow function returns true",
	//     subcategory: "Test",
	//     placeHolder: "hidden?", // You can also use [placeHolder] to change the text in the button
	//     // ^ This also works in [TextInput] components.

	//     onClick() {
	//         ChatLib.chat("the hidden button was clicked!")
	//     },

	//     // Now we define a [shouldShow] function and make it return a true/false value
	//     // this will be ran whenever [Amaterasu] attempts to unhide/hide this component
	//     shouldShow(data) {
	//         // In this case we'll be using the [data] param since that's the [config.settings] field
	//         // and it's given to the dev like this because the [config.settings] field
	//         // is created later on so it cannot be accessed before-hand
	//         return data.testingSwitch
	//     }
	// })
	// .addButton({
	//     category: null,
	//     configName: "redirectButtonTest",
	//     title: "Redirect Button Test",
	//     description: "This is a redirect button testing example",
	//     subcategory: null,
	//     onClick(setting) {
	//         // You can redirect to a [category] and a [configName] on the click of a button
	//         // if you do not set a [configName] it will redirect to the category only
	//         // This will change the current [category] to the set [category]
	//         // and scroll down to the [configName] assigned
	//         setting.redirect("GUI", "apply")
	//     }
	// })
	// .addMultiCheckbox({
	//     category: null,
	//     subcategory: null,
	//     configName: "multiCheckBoxTest",
	//     // ^ this will be used to store the configType and the config values to have actual config saving

	//     title: "Multi check box test",
	//     description: "Testing multi checkbox component!",
	//     placeHolder: "Click", // This is the text that will be display on the dropdown component
	//     options: [
	//         {
	//             title: "Multi Checkbox Test",
	//             configName: "multi1",
	//             value: false,
	//             // This is how we register a listener inside a multi checkbox component
	//             registerListener(previousvalue, newvalue) {
	//                 ChatLib.chat(`previous value: ${previousvalue}\nnew value: ${newvalue}`)
	//             }
	//         },
	//         {
	//             title: "Multi Checkbox Test",
	//             configName: "multi2",
	//             value: false
	//         },
	//         {
	//             title: "Multi Checkbox Test",
	//             configName: "multi3",
	//             value: true
	//         },
	//         {
	//             title: "Multi Checkbox Test",
	//             configName: "multi4",
	//             value: false
	//         }
	//     ]
	// })
	// .addTextParagraph({
	//     category: null,
	//     subcategory: null,
	//     configName: "textParagraph", // This is required due to how we check for ConfigTypes change in the backend
	//     title: "Testing Paragraph",
	//     description: "This is a text paragraph example. you can go over the regular component's width limit in here, giving you a little bit more space",
	//     centered: true // Whether the [title] and [description] should be centered
	// })
	// .addKeybind({
	//     category: null,
	//     subcategory: null,
	//     configName: "testingKeybind",
	//     title: "Testing Keybind",
	//     description: "Testing new keybind config type",
	//     value: 0 // this is the initial keyCode
	//     // ^ beware that the Mouse Button keyCode starts with negative values. e.g -100
	// })

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
        onClick(setting) {
            // Opens a book with map names
            ChatLib.command("autododge", true);
            config.closeGui();
            World.playSound("random.orb", 1.0, 1.0); // first pitch
        }
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
        description: "If you can't dodge yet, go to the lobby",
        value: true,
    })

// Here we create our [Settings] instance.
// passing through our [ModuleName], [DefaultConfig] and [ColorSchemePath]
const config = new Settings("CTSkyWarsTools", defaultConf, "data/scheme-vigil.json")
	// Here we define a command with aliases to open this [ConfigGui]
	.setCommand("CTSkyWarsTools", ["testing"])

	// We can also use the #registerListener from our [Settings] instance
	// for example listening to whenever the value of the [height] slider gets changed
	.registerListener("height", (previousvalue, newvalue) => {
		ChatLib.chat(`previous value: ${previousvalue}\nnew value: ${newvalue}`);
	})

	// We can also register listeners for whenever we open and/or close the [Gui]
	.onOpenGui(() => {
		// ChatLib.chat("config gui has been opened");
	})
	.onCloseGui(() => {
		// ChatLib.chat("config gui has been closed");
	});

// Now we set the new position, size and colorScheme for our [ConfigGui]
config
	.setPos(config.settings.x, config.settings.y)
	.setSize(config.settings.width, config.settings.height)
	.setScheme("data/scheme-vigil.json") // This is the path to the colorScheme file
	.apply();

// Now we export the [config.settings]
export default config.settings;
