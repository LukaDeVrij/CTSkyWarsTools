/// <reference types="../imports/CTAutocomplete" />
/// <reference lib="es2015" />

import settings from "./config"

register("command", (...args) => {
    // If no arguments were passed to the command
    // (meaning only "/mytest" was ran and not "/mytest something here")
    // we open our Amaterasu gui
    if (!args.length) return settings.getConfig().openGui()

    // If args[0] is defined we do something else
    if (args[0]) {
        // For example sending a message or whatever your custom command options may be
        ChatLib.chat("arg 1 is defined!")

        return
    }
}).setName("qwerty");