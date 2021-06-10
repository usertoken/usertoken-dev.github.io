
// [START app]
const Gun = require('gun');
const shelljs = require('shelljs');

const Peers = require('./peers');
const Web = require('./web');
const HyperSwarm = require('./hyperswarm');
const MulticastDns = require('./multicast-dns');
// const Mdns = require('./mdns');
const Bonjour = require('./bonjour');

require('gun/nts');
require('gun/axe');
require('gun/sea');

const peers = JSON.parse(Peers.get('peers'));

//
const seed = `/tmp/${Date.now()}-seed`;
shelljs.mkdir('-p',seed)
//
const createNetworkNodes = options => {
  const { nexus, path, node } = options
  nexus.get(path).set(node).put({});
}
const createNetworkPaths = options => {
  const { nexus, path, nodes } = options
  for (const node of nodes ) createNetworkNodes({node,nexus,path})
}
const createNetworkConnections = options => {
  const { nexuses, path, nodes } = options
  for (const nexus of nexuses) createNetworkPaths({nexus, path, nodes})
}
const connectNetworkOracles = options => {
  const { nexus, nodes } = options
  createNetworkPaths({nexus, path: 'oracles', nodes})
}
const setupPath = options => {
  const { path, node} = options
  node.get(path).set(node).put({})
}
const setupNodes = options => {
  const { nodes, path} = options
  nodes.forEach(node => setupPath({path, node}))
}
const setupNodesPath = options => {
  const { nodes, path } = options
  setupNodes({nodes, path})
}
const setupRootPaths = options => {
  const { root, nodes } = options
  for (const node of nodes) node.get('root').set(root).put({});
}
//
const createNetwork = options => {
  const paths = [
    'root',
    'network',
    'accessnexus',
    'beaconnexus',
    'hiddennexus',
    'lognexus',
    'metricnexus',
    'rewardnexus',
  
    'alex2006hw',
    'bellbella',
    'clouderg',
    'nautilusly',
    'pointlook',
    'usertoken',
    'workagent',
  ];
  const { gunoptions, host, dnsconfig } = options
  const gun = Gun(gunoptions);
  global.Gun = Gun; /// make global to `node --inspect` - debug only
  global.gun = gun; /// make global to `node --inspect` - debug only
  //
  const root = gun.get('/').put({});
  if(dnsconfig && dnsconfig.port && host)
    root.get('root').set(root).put({address:host,port:dnsconfig.port})
  else root.get('root').set(root).put({})
  //
  root.get('peers').put(JSON.stringify(peers));
  //
  const network = gun.get('network').put({});

  const accessnexus = gun.get('accessnexus').put({});
  const beaconnexus = gun.get('beaconnexus').put({});
  const hiddennexus = gun.get('hiddennexus').put({});
  const lognexus = gun.get('lognexus').put({});
  const metricnexus = gun.get('metricnexus').put({});
  const rewardnexus = gun.get('rewardnexus').put({});

  const alex2006hw = gun.get('alex2006hw').put({});
  const bellbella = gun.get('bellbella').put({});
  const clouderg = gun.get('clouderg').put({});
  const nautilusly = gun.get('nautilusly').put({});
  const pointlook = gun.get('pointlook').put({});
  const usertoken = gun.get('usertoken').put({});
  const workagent = gun.get('workagent').put({});
  //
  const nexuses = [
    root,
    network,
    accessnexus,
    beaconnexus,
    hiddennexus,
    lognexus,
    metricnexus,
    rewardnexus,
  
    alex2006hw,
    bellbella,
    clouderg,
    nautilusly,
    pointlook,
    usertoken,
    workagent,
  ];
  const nodes = [
    root,
    accessnexus,
    beaconnexus,
    hiddennexus,
    lognexus,
    metricnexus,
    rewardnexus,
  
    alex2006hw,
    bellbella,
    clouderg,
    nautilusly,
    pointlook,
    usertoken,
    workagent,
  
  ];
  //
  setupRootPaths({root, nodes})
  //
  for (const nexus of nexuses) connectNetworkOracles({nexus, nodes})
  //
  for (const path of paths) createNetworkConnections({path, nexuses, nodes})
  //
  for (const path of paths) setupNodesPath({path, nodes})
  //
  return ({gun,root})
}
//
const network = options => {
  const web = Web.start(options);
  const swarmOptions = {
    peers,
    network: 'usertoken'
  }
  const swarm = HyperSwarm.start(swarmOptions);
  
  // const mdns = Mdns.start(swarmOptions);
  const bonjour = Bonjour.start(swarmOptions);
  const gunoptions = {
    web, peers,
    multicast: false,
    localStorage: false,
    radisk: false,
    file: false
  }
  const usertoken = {
    gunoptions,
    swarm,
  };
  // console.log('1.network start:',host,dnsconfig)
  const result = createNetwork(usertoken);
  

  const mdnsOptions = {
    ...result, ...gunoptions
  }

  MulticastDns.start(mdnsOptions);
 
  return(mdnsOptions)
}

// [END app]
module.exports = network;
