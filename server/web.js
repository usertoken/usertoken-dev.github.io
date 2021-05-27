
// [START app]
const express = require('express');
const Gun = require('gun');
const path = require('path');
const FS = require('fs');

const web = express();

const HOME = __dirname;

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
web.use(express.static(HOME));
web.use(express.json({extended: true}));
web.use(Gun.serve);

// [END enable_parser]
web.get('/peers', (req, res) => {
  let answer = JSON.parse(fs.readFileSync('/tmp/peers.json', 'utf-8'))
  console.log(answer);
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
  let answer = {msg:`Welcome from ${HOME}`, peers}
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

const start = options => {
  const { port } = options
  web.listen(port, () => {
    let answer = `Web listening on port ${port}...`
    console.log({answer})
  });
  return web
}

// [END app]
module.exports = {start};
