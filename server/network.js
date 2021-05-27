
// [START app]
const Gun = require('gun');
const shelljs = require('shelljs');
const Web = require('./web');

require('gun/nts');
require('gun/axe');
require('gun/sea');

const seed = `/tmp/${Date.now()}-seed`;
shelljs.mkdir('-p',seed)
//
const peers = [
  'https://usertoken-home.uc.r.appspot.com/gun',
  'https://concise-rampart-314505.ew.r.appspot.com/gun',
  'https://seed.alex2006hw.com/gun',
  'https://seed.bellbella.com/gun',
  'https://seed.clouderg.com/gun',
  'https://seed.pointlook.com/gun',
  'https://seed.workagent.com/gun',
  'https://seed.usertoken.com/gun',
  'https://seed.nautilusly.com/gun',
  'https://gun-us.herokuapp.com/gun',
  'https://gun-eu.herokuapp.com/gun',
  'https://gunjs.herokuapp.com/gun',
];
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

  const gun = Gun(options);
  global.Gun = Gun; /// make global to `node --inspect` - debug only
  global.gun = gun; /// make global to `node --inspect` - debug only
  //
  const root = gun.get('/').put({});
  root.get('root').set(root).put({});
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
  const optGun = {file: seed, web, peers}
  // const { gun, root } = 
  return createNetwork(optGun);
  //
  // root.get('oracles').map().once(oracle => {
  //   console.log('1.network oracle:',oracle)
  // })
  // return ({gun,root})
}

// [END app]
module.exports = network;
