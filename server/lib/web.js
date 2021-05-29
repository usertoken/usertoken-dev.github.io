//
let examples = [];
require("marko/node-require"); // Allow Node.js to require and load `.marko` files
// [START app]
const express = require('express');
const Gun = require('gun');
const path = require('path');
const FS = require('fs');
const { ExpressPeerServer } = require("peer");
const Peers = require('./peers');
const { wSocket } = require('./channels');
const markoExpress = require("marko/express");
const Keys = require('./keys/index');
// const compiler = require('@marko/compiler');
const template = require("../ui/index.marko");

const web = express();

// const MARKO = path.join(__dirname, 'marko');

// [START enable_parser]
require('lasso').configure({
    bundlingEnabled: false,
    minify: false,
    fingerprintsEnabled: false,
    outputDir: path.join(__dirname, 'static'),
    plugins: [
        'lasso-marko'
    ]
});
//
// compiler.configure({ output: "dom" });
// This middleware is available in Express v4.16.0 onwards
web.use(require('lasso/middleware').serveStatic());
// web.use(express.static(HOME));
web.use(express.json({extended: true}));
web.use(Gun.serve);
web.use(markoExpress()); //enable res.marko(template, data)

const peerServer = ExpressPeerServer(web, {
  debug: false,
  path: "/peerjs"
});
// [END enable_parser]
const markoRouting = () => {
        examples.push({
            name: example,
            route: '/' + name,
            controller: function(req, res) {
                res.marko(template, {
                    examples: examples
                });
            }
        });

  examples.forEach(function(example) {
      web.use(example.route, example.controller);
  });
}
web.get('/ui', async function(req, res) {
  console.log("1.web GET /ui");
  res.marko(template, data={
    fname: "Amazing",
    lname: "Person",
    host: "Usertoken",
    drinks : ["Token", "Beer", "Champagne"],
    title: "UserToken",
    key: await Keys.masterkey(),
  });
});
// [START web API]
web.get('/peers', (req, res) => {
  // let peers = FS.readFileSync('/tmp/peers.json', 'utf-8')
  let answer = Peers.get('peers');
  console.log('1.web GET /peers data:',answer);
  // let peers = JSON.parse(answer)
  // console.log('2.web GET /peers peers:',peers);
  res.send(answer);
});
web.get('/gun.js', (req, res) => {
  if(Gun.wsp.server(req, res)){
		return; // filters gun requests!
	}
  console.log('1.web GET /gun.js');
  res.writeHead(200, {'Content-Type': 'text/html'});
  FS.createReadStream(path.join(__dirname, 'node_modules', 'gun', 'gun.min.js')).pipe(res); // stream
});

web.get('/login', (req, res) => {
  let answer = {msg:`Welcome from ${HOME}`}
  console.log(answer);
  res.send({answer});
});

web.get('/:room', function(req, res) {
      res.redirect('/?room=' + req.params.room);
});
// [START add_display_form]
web.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
});
// [END add_display_form]

// [START add_post_handler]
web.post('/submit', (req, res) => {
  let answer = {
    name: req.body.name,
    message: req.body.message,
  }
  console.log(answer);

  res.send({answer});
});
// [END add_post_handler]
//
// [START websocket_handler]
web.on("upgrade", (request, socket, head) => wSocket(request, socket, head))
// [END websocket_handler]
// [START web API]
//
const start = options => {
  const { port } = options
  // setupBFS()
  web.listen(port, () => {
    let answer = `Web listening on port ${port}...`
    console.log({answer})
  });
  return web
}

// [END app]
module.exports = {start};