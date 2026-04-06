const modules = [
    { path: "./submodules/experience", name: "SkyWars Game Experience" },
    { path: "./submodules/swlevel", name: "SkyWars Levels" },
    { path: "./submodules/autododge2", name: "Autododge" },
    { path: "./submodules/islandfinder", name: "IslandFinder" },
    { path: "./submodules/swtcommand", name: "SkyWars Stats Command" },
];

const loadModules = () => {
    let total = 0;
    let errors = 0;
    for (const module of modules) {
        const { path, name } = module;
        const start = Date.now();
        try {
            require(path);
            const end = Date.now();
            const elapsed = end - start;
            total += elapsed;
        } catch (e) {
            errors++;
            console.log(`&cError loading ${name} module: ${e.stack || e}`);
        }
    }
    console.log(`Loaded ${modules.length - errors}/${modules.length} modules in ${total}ms`);
};

require('./amaterasu/config');

loadModules();








