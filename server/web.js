
// [START app]
const express = require('express');
const Gun = require('gun');
const path = require('path');
// const BrowserFS = require('browserfs');
const FS = require('fs');
const Peers = require('./peers');

const web = express();

const HOME = __dirname;

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
web.use(express.static(HOME));
web.use(express.json({extended: true}));
web.use(Gun.serve);

// [END enable_parser]
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

// const setupBFS = () => {
//   // Grab the BrowserFS Emscripten FS plugin.
//   var BFS = new BrowserFS.EmscriptenFS();
//   // Create the folder that we'll turn into a mount point.
//   FS.createFolder(FS.root, 'data', true, true);
//   // Mount BFS's root folder into the '/data' folder.
//   FS.mount(BFS, {root: '/'}, '/data');
// }
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
