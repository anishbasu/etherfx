const etherfx = {
    namespace: (namespace) => console.log(`Running on ${namespace}`),
    register: (fn, args, returns) => console.log(`Args: ${args}\n Returns: ${returns}`)
}
module.exports = etherfx