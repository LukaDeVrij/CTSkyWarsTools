const modules = [
    { path: "./submodules/experience", name: "SkyWars Game Experience" },
    { path: "./submodules/swt", name: "SkyWars Levels" },
    { path: "./submodules/autododge", name: "Autododge" },
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
            console.log(`&cError loading ${name} module: ${e.stack || e}`);
        }
    }
    console.log(`Loaded ${modules.length} modules in ${total}ms`);
};

require('./amaterasu/config');

loadModules();








