const { airswarm } = require('../lib/resolvers/index')
// let peersArray = []
const peersSet = new Set()

// const writeSocket = sock => {
//   sock.write('(' + process.pid + ') - hello world \n')
//   sock.pipe(process.stdout)
// }
// const swarm = airswarm('testing', { limit: Infinity }, sock => writeSocket(sock))
const swarm = airswarm('testing', { limit: Infinity })

swarm.on('peer', peer => {
  // peersArray.push(peer)
  // console.log('swarm peers:',peersArray.length)
  // console.log('swarm peer:',peer)
  if (!peersSet.has(peer)) peersSet.add(peer)
  console.log('swarm peers count:',peersSet.size)
  peer.write('(' + process.pid + ') - hello world \n')
  console.log('swarm write:','(' + process.pid + ')')
  peer.pipe(process.stdout)
})