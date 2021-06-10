const Gun = require('gun');

const api = options => {
  const { dns, dnsconfig, host, question, peers } = options
  const port = dnsconfig.port
  const ip = dnsconfig.ip
  const gun = Gun({peers})
  const root = gun.get('root')
  root.get('address').once((address, index)=> {
    console.log('1.multicast-dns-api address:', address)
  })
  root.get('port').once((port, index)=> {
    console.log('1.multicast-dns-api port:', port)
  })
  root.get('peers').once((peers, value)=> {
    // console.log('1.multicast-dns-api peers:', peers)
  })
  console.log('1.multicast-dns-api query:', question);
  if (question && question.name && host)
  switch (question.name) {
    case 'genesis': 
      const answer = [
        {type: 'A', name: JSON.stringify({id:question.name, host, port}), ttl: 120, data: ip}
      ]
      console.log('1.multicast-dns-api response:', answer);
      dns.respond(answer)
      break;

  }
}
////
module.exports = api
