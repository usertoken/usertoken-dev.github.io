'use strict';
//
let oracles =[]
let sortedOracles = []
//
const network  = require('./lib/network');
const utils = require('./lib/utils');
const { flattenFilterAndSort, copyfs } = utils;

const startNetwork = async options => {
  // Listen to the App Engine-specified port, or 8080 otherwise
  const port = options.port || process.env.PORT || 8080;
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
app({})
//
module.exports = app;
