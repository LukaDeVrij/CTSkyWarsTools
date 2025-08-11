const pathSymbol = Symbol("path")
class PogObject {
    constructor(module, defaultObject = {}, fileName = ".data.json") {
        this[pathSymbol] = [module, fileName]
        let data = FileLib.read(module, fileName)
        try {
            data = data ? JSON.parse(data) : {}
        } catch (e) {
            console.error(e)
            console.log(`[PogData] Reset ${module} to default data`)
            data = {}
        }
        Object.assign(this, defaultObject, data)
    }

    save() {
        FileLib.write(
            this[pathSymbol][0],
            this[pathSymbol][1],
            JSON.stringify(this, null, 4),
            true
        )
    }

    autosave(interval = 5) {
        register("step", () => this.save()).setDelay(60 * interval)
        register("gameUnload", () => this.save())
    }
}

export default PogObject
