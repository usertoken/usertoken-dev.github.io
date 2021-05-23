
// [START app]
const express = require('express');
const path = require('path');
const Gun = require('gun');
const shelljs = require('shelljs');

const web = express();

require('gun/nts');
require('gun/axe');
require('gun/sea');
require('gun/lib/path.js')

const HOME = __dirname;
const seed = `${HOME}/.data/${Date.now()}-seed`;
shelljs.mkdir('-p',seed)

const peers = [
  'https://seed.alex2006hw.com/gun',
  'https://seed.bellbella.com/gun',
  'https://seed.clouderg.com/gun',
  'https://seed.pointlook.com/gun',
  'https://seed.workagent.com/gun',
  'https://seed.usertoken.com/gun',
  'https://seed.nautilusly.com/gun',
];

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
web.use(express.static(HOME));
web.use(express.json({extended: true}));
web.use(Gun.serve);
// [END enable_parser]

web.get('/login', (req, res) => {
  let answer = `Welcome from ${HOME}`
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
const createNetworkNodes = options => {
  const { nexus, path, node } = options
  nexus.path(path).set(node).put({});
}
const createNetworkPaths = options => {
  const { nexus, path, nodes } = options
  for (const node of nodes ) createNetworkNodes({node,nexus,path})
}
const createNetworkConnections = options => {
  const { nexuses, path, nodes } = options
  for (const nexus of nexuses) createNetworkPaths({nexus, path, nodes})
}
const connectNetworkPaths = options => {
  const { nexus, nodes } = options
  createNetworkPaths({nexus, path: 'paths', nodes})
}
const setupPath = options => {
  const { path, node} = options
  node.path(path).set(node).put({})
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
  const { root, network } = options
  root.path('root').set(root).put({});
  root.path('network').set(network).put({});
 

  // root.path('accessnexus').set(accessnexus).put({});
  // root.path('beaconnexus').set(beaconnexus).put({});
  // root.path('hiddennexus').set(hiddennexus).put({});
  // root.path('lognexus').set(lognexus).put({});
  // root.path('metricnexus').set(metricnexus).put({});
  // root.path('rewardnexus').set(rewardnexus).put({});

  // root.path('alex2006hw').set(alex2006hw).put({});
  // root.path('bellbella').set(bellbella).put({});
  // root.path('clouderg').set(clouderg).put({});
  // root.path('nautilusly').set(nautilusly).put({});
  // root.path('pointlook').set(pointlook).put({});
  // root.path('usertoken').set(usertoken).put({});
  // root.path('workagent').set(workagent).put({});

  // connecting the nodes
  // root.path('paths').set(root).put({})
  // root.path('paths').set(network).put({})
  // root.path('paths').set(accessnexus).put({})
  // root.path('paths').set(beaconnexus).put({});
  // root.path('paths').set(hiddennexus).put({});
  // root.path('paths').set(lognexus).put({});
  // root.path('paths').set(metricnexus).put({});
  // root.path('paths').set(rewardnexus).put({});

  // root.path('paths').set(alex2006hw).put({});
  // root.path('paths').set(bellbella).put({});
  // root.path('paths').set(clouderg).put({});
  // root.path('paths').set(nautilusly).put({});
  // root.path('paths').set(pointlook).put({});
  // root.path('paths').set(usertoken).put({});
  // root.path('paths').set(workagent).put({});
}
//
const createNetwork = options => {
  const { Network } = options;
  const root = Network.get('/').put({});
  const network = Network.get('network').put({});

  const accessnexus = Network.get('accessnexus').put({});
  const beaconnexus = Network.get('beaconnexus').put({});
  const hiddennexus = Network.get('hiddennexus').put({});
  const lognexus = Network.get('lognexus').put({});
  const metricnexus = Network.get('metricnexus').put({});
  const rewardnexus = Network.get('rewardnexus').put({});

  const alex2006hw = Network.get('alex2006hw').put({});
  const bellbella = Network.get('bellbella').put({});
  const clouderg = Network.get('clouderg').put({});
  const nautilusly = Network.get('nautilusly').put({});
  const pointlook = Network.get('pointlook').put({});
  const usertoken = Network.get('usertoken').put({});
  const workagent = Network.get('workagent').put({});
  //
  setupRootPaths({root, network})
  //
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
  ] 
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
  ] 
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

  ]
  //
  for (const nexus of nexuses) connectNetworkPaths({nexus, nodes})
  //
  for (const path of paths) createNetworkConnections({path, nexuses, nodes})
  //
  for(const path of paths) {
    if (path !== 'root') setupNodesPath({path, nodes})
  }
  //
  return ({paths,nodes})
}

const network = options => {
  const { port } = options
  web.listen(port, () => {
    let answer = `Network listening on port ${port}...`
    //
    const optGun = {file: seed, web, peers}
    const Network = Gun(optGun);
    global.Gun = Gun; /// make global to `node --inspect` - debug only
    global.gun = Network; /// make global to `node --inspect` - debug only
    //
    const { paths,nodes } = createNetwork({Network});
    //
    console.log({answer});
    // console.log({paths,nodes});
    //
    return ({paths,nodes})
  });
  return ({web})
}

// [END app]
module.exports = network;