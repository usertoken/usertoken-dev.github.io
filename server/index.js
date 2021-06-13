'use strict';
//
let oracles =[]
let sortedOracles = []
//
const api = require('./api/index');
const { network, utils, resolvers }  = require('./lib/index');
const { flattenFilterAndSort, copyfs } = utils;
const { mdns } = resolvers;

const startNetwork = async options => {
  try {
    return await network(options)
  } catch(e){
    console.log('1.app network error:',e)
  }
}
const app = async options => {
  // try {
    // const { gun, root } = 
    const { root, gun } = await startNetwork(options)
    if (root && root.get) {
      // const root = gun.get('root')
      root.get('address').once((address, index)=> {
        // console.log('1.app address:', address)
      })
      root.get('port').once((port, index)=> {
        // console.log('1.app port:', port)
      })
      root.get('peers').once((peers, value)=> {
        // console.log('1.app peers:', peers)
        mdns.start({root,peers});
      })
      root.get('oracles').map().once((oracle, value)=> {
        oracles.push(value)
        sortedOracles = flattenFilterAndSort(oracles)
        // console.log('2.app oracles:', oracles)
        // console.log('3.app sortedOracles:',sortedOracles)
      })
      //
      // root message response
      //
      root.get('response').on(response => {
        console.log('4.app api response:',response)
      })
      root.get('request').put("{id: '5678', data: 'say yes'}")
      //
      // direct response
      //
      const response = api({root})
      console.log('5.app api response:',response)
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
