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
    const { root } = await startNetwork(options)
    if (root && root.get) {
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
      root.get('request').put("{id: \"5678\", task: \"echo\", data: \"say yes\"}")
      //
      root.get('request').put("{id: \"2345\", task: \"newkey\"}")
      //
      // direct response
      //
      // const response = 
      api({root})
      // console.log('5.app api response:',response)
      return ({root})
    }
}
app({})
//
module.exports = app;
