// const Gun = require('gun');
// const { flattenFilterAndSort, copyfs } = require('./utils');
const dnsPacket = require('./lib/dns-packet')

const api = options => {
  // let answer = []
  // if (options && options.peers) peers.concat(options.peers)
  const { dns, port, ip, host, question, root } = options
  // console.log('1.multicast-dns-api options:', options)
  // const gun = Gun({peers})
  // const root = gun.get('root')
  root.get('address').once((address, index)=> {
    // console.log('1.multicast-dns-api address:', address)
  })
  root.get('port').once((port, index)=> {
    // console.log('1.multicast-dns-api port:', port)
  })
  console.log('1.multicast-dns-api query:', question);
  if (question && question.name && host)
  switch (question.name) {
    case 'genesis': 
    let answer = [
        {
          type: 'A', 
          name: question.name, 
          id: 65535, 
          class: 'IN', 
          ttl: 120, 
          flags: dnsPacket.RECURSION_DESIRED | dnsPacket.RECURSION_AVAILABLE,
          data: `${host}:${port}` || ip,
        }
      ]
      console.log('2.multicast-dns-api response:', answer);
      dns.respond(answer)
    break;
    case 'peers': 
      if (root && root.get)
      root.get('peers').once((p, value)=> {
        // console.log('3.multicast-dns-api peers:', p)
        let answer = [
          {
            type: 'A', 
            name: question.name, 
            id: 65535, 
            class: 'IN', 
            ttl: 120, 
            flags: dnsPacket.RECURSION_DESIRED | dnsPacket.RECURSION_AVAILABLE,
            data: `${p}`,
          }
        ]
        console.log('4.multicast-dns-api response:', answer);
        dns.respond(answer)
      })
      break;
  }
}
////
module.exports = api
