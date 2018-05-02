const etherfx = {
    protocol: [],
    
}

class etherfx {
    constructor() {
        this.protocol = []
    }

    namespace (namespace) {
        console.log(`Running on ${namespace}`)
    }
    register(fn) {
        this.protocol.push(fn)
    }
    bind() {
        console.log(this.protocol)
    }
}
module.exports = etherfx