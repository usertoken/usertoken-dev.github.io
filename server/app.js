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
// Listen to the App Engine-specified port, or 8080 otherwise
const port = process.env.PORT || 8080;
//
let oracles =[]
let sortedOracles = []
//
const network  = require('./network');
const utils = require('./utils');
const { flattenFilterAndSort } = utils;

const startNetwork = async options => {
  try {
    return await network({port})
  } catch(e){
    console.log('1.app network error:',e)
  }
}
const app = async options => {
  const { gun, root } = await startNetwork(options)
  if (root && root.get) {
    root.get('peers').once((peers, value)=> {
      // console.log('1.app peers:', peers)
    })
    root.get('oracles').map().once((oracle, value)=> {
      oracles.push(value)
      sortedOracles = flattenFilterAndSort(oracles)
      // console.log('2.app oracles:', oracles)
      // console.log('3.app sortedOracles:',sortedOracles)
    })
  }
  return ({root,gun})
}
app()
//
module.exports = app;
