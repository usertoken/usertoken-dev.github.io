// const mdns = require('mdns');
const publicIp = require('public-ip');
var MDNS = require('multicast-dns')
var dgram = require('dgram')
const dnsApi = require('./multicast-dns-api')

var port = (cb) => {
  try {
    var s = dgram.createSocket('udp4')
    s.bind(0, () => {
      var port = s.address().port
      s.on('close', () => {
        cb(port)
      })
      s.close()
    })
  } catch(e) {
    console.log('1.multicast-dns port error:',e)
  }
}
const publicIP = async () => {
  return await publicIp.v4()

	// console.log(await publicIp.v6());
	//=> 'fe80::200:f8ff:fe21:67cf'
}
const start = async options => {
  const { peers } = options
  try {
    const host = await publicIP()
    const MDNSconfig = {
      multicast: true, // use udp multicasting
      bind: "0.0.0.0",
      // interface: '0.0.0.0', // explicitly specify a network interface. defaults to all
      port: 33355, // set the udp port
      ip: '224.0.0.251', // set the udp ip
      ttl: 255, // set the multicast ttl
      loopback: true, // receive your own packets
      reuseAddr: true // set the reuseAddr option when creating the socket (requires node >=0.11.13)
    }
    const dns = MDNS(MDNSconfig)

    // console.log('1.multicast-dns start:', options, MDNSconfig);

    dns.on('response', function(response) {
      // console.log('1.multicast-dns got a response packet:', response.answers)
    })

    dns.on('query', function(query) {
      // console.log('1.multicast-dns got a query questions:', query.questions)
      if(query.questions.length) {
        // console.log('2.multicast-dns got a query questions length:', query.questions.length)
        query.questions.forEach((question, index) => {
          // console.log(`3.multicast-dns (${index}) | name:`, question.name);
          dnsApi({peers, dns,host,dnsconfig: MDNSconfig,question})
        })
      }
    })
    return {dns, host, dnsconfig: MDNSconfig}
  } catch(e) {
    console.log('1.multicast-dns error:',e)
    return(null)
  }
}

//
module.exports = { start }
