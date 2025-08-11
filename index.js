const modules = [
    { path: "./submodules/experience.js", name: "SkyWars Game Experience" },
    { path: "./submodules/swt.js", name: "SkyWars Levels" },
    { path: "./submodules/autododge.js", name: "Autododge" },
    { path: "./submodules/testing.js", name: "testing" },
];

const loadModules = () => {
    let total = 0;

    for (const module of modules) {
        const { path, name } = module;
        const start = Date.now();
        try {
            require(path);
            const end = Date.now();
            const elapsed = end - start;
            total += elapsed;
        } catch (e) {
            console.log(`&cError loading ${name} module: ${e}`);
        }
    }
    console.log(`Loaded ${modules.length} modules in ${total}ms`);
};

require('./ameterasu/amaterasu.js');

loadModules();








