const hyperswarm = require('hyperswarm')
const crypto = require('crypto')
const { swarmApi } = require('./channels')

const swarm = hyperswarm()

const start = options => {
    // look for peers listed under this topic
    const { network, peers } = options;
        
    const topic = crypto.createHash('sha256')
        .update(network)
        .digest()

    swarm.join(topic, {
        lookup: true, // find & connect to peers
        announce: true // optional- announce self as a connection target
    })

    swarm.on('connection', (socket, details) => {
        console.log('new connection!', details)
        swarmApi({network,socket,peers})
        // you can now use the socket as a stream, eg:
        // process.stdin.pipe(socket).pipe(process.stdout)
    })
    return (swarm)
}
//
module.exports = { start }