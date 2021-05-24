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

// require('@google-cloud/debug-agent').start({
//   serviceContext: {
//     service: 'www',
//     version: '1.0.0',
//     enableCanary: true,
//   }
// });

const network  = require('./network');

const app = async options => {
  // Listen to the App Engine-specified port, or 8080 otherwise
  let port = process.env.PORT || options && options.port? options.port : 3000;
  let root = {}
  // console.log('1.app starting on port:', port)
  try {
    const { gun } = await network({port})
  } catch(e){
    console.log('2.app network error:',e)
  }
  if (gun) {
    root = gun.get('/');
    root.get('paths').map().once((node, value)=> {
      // console.log('3.app node:', value, node)
    })
  }
}
app()
//
module.exports = app;
