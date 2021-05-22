// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START app]
const express = require('express');
const path = require('path');
const Gun = require('gun');

const app = express();
require('gun/nts');
require('gun/axe');
require('gun/sea');

const peers = [
      'https://genesis.bellbella.com/gun',
      'https://seed01.usertoken.com/gun',
      'https://usertoken.com/gun',
]

const  gun = Gun({file: '/tmp/www-usertoken-app', web: app, peers});

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.static(__dirname));
app.use(express.json({extended: true}));
app.use(Gun.serve);
// [END enable_parser]

app.get('/hello', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/:room', function(req, res) {
      res.redirect('/?room=' + req.params.room);
});

// [START add_display_form]
app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/form.html'));
});
// [END add_display_form]

// [START add_post_handler]
app.post('/submit', (req, res) => {
  console.log({
    name: req.body.name,
    message: req.body.message,
  });
  res.send('Thanks for your message!');
});
// [END add_post_handler]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

global.Gun = Gun; /// make global to `node --inspect` - debug only
global.gun = gun; /// make global to `node --inspect` - debug only

// [END app]

module.exports = app;
