const Bonjour = require('bonjour')

const port = function (cb) {
  const s = dgram.createSocket('udp4')
  s.bind(0, function () {
    var port = s.address().port
    s.on('close', function () {
      cb(port)
    })
    s.close()
  })
}
const Bconfig =   {
  multicast: true, // use udp multicasting
  // bind: "0.0.0.0",
  // interface: '0.0.0.0', // explicitly specify a network interface. defaults to all
  port: port, // set the udp port
  ip: '224.0.0.251', // set the udp ip
  ttl: 255, // set the multicast ttl
  loopback: true, // receive your own packets
  reuseAddr: true // set the reuseAddr option when creating the socket (requires node >=0.11.13)
}
const bonjour = Bonjour(Bconfig)

const start = options => {
  console.log('1.bonjour start config:',Bconfig,options);

  // advertise an HTTP server on port 3000
  bonjour.publish({ name: 'cow', type: 'http', port: 3000 })

  // browse for all http services
  bonjour.find({ type: 'http' }, function (service) {
    console.log('Found an HTTP server:', service)
  })
}

module.exports = { start }