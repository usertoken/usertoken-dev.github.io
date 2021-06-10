'use strict';
//
let oracles =[]
let sortedOracles = []
//
const network  = require('./lib/network');
const utils = require('./lib/utils');
const { flattenFilterAndSort, copyfs } = utils;
const Gun = require('gun')

const startNetwork = options => {
  // Listen to the App Engine-specified port, or 8080 otherwise
  const port = options.port || process.env.PORT || 8080;
  try {
    return network({port})
  } catch(e){
    console.log('1.app network error:',e)
  }
}
const app = options => {
  // try {
    // const { gun, root } = 
    const { root } = startNetwork(options)
    if (root && root.get) {
      // const root = gun.get('root')
      root.get('address').once((address, index)=> {
        console.log('1.app address:', address)
      })
      root.get('port').once((port, index)=> {
        console.log('1.app port:', port)
      })
      root.get('peers').once((peers, value)=> {
        // console.log('1.app peers:', peers)
      })
      root.get('oracles').map().once((oracle, value)=> {
        oracles.push(value)
        sortedOracles = flattenFilterAndSort(oracles)
        // console.log('2.app oracles:', oracles)
        // console.log('3.app sortedOracles:',sortedOracles)
      })
      // return ({root,gun})
    }
  // } catch(e) {
    // console.log('1.app error:',e)
    return ({root,gun})
  // }
}
app({})
//
module.exports = app;
