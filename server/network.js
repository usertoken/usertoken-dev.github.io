
// [START app]
const express = require('express');
const path = require('path');
const Gun = require('gun');

const web = express();

require('gun/nts');
require('gun/axe');
require('gun/sea');
require('gun/lib/path.js')

const HOME = __dirname;
const seed = `${HOME}/.data/${Date.now()}-seed`;
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

const createNetwork = options => {
  const { network } = options;
  const root = network.get('/').put({});
  const network = network.get('network').put({});

  const accessnexus = network.get('accessnexus').put({});
  const beaconnexus = network.get('beaconnexus').put({});
  const hiddennexus = network.get('hiddennexus').put({});
  const lognexus = network.get('lognexus').put({});
  const metricnexus = network.get('metricnexus').put({});
  const rewardnexus = network.get('rewardnexus').put({});

  const alex2006hw = network.get('alex2006hw').put({});
  const bellbella = network.get('bellbella').put({});
  const clouderg = network.get('clouderg').put({});
  const nautilusly = network.get('nautilusly').put({});
  const pointlook = network.get('pointlook').put({});
  const usertoken = network.get('usertoken').put({});
  const workagent = network.get('workagent').put({});

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
  const createNetworkNodes = options => {
    const { nexus, path, node } = options
    nexus.path(path).set(node).put({});
  }
  const createNetworkPaths = options => {
    const { nexus, path, nodes } = options
    nodes.map(node => createNetworkNodes({node,nexus,path}))
  }
  const createNetworkConnections = options => {
    const { nexuses, path, nodes } = options
    nexuses.map(nexus => createNetworkPath({nexus, path, nodes}))
  }
  const connectNetworkPaths = options => {
    const { nexus, nodes } = options
    createNetworkPath({nexus, path: 'paths', nodes})
  }
  paths.map(path => path !== 'root' && setupNodesPath({path, nodes}))
  paths.map(path => createNetworkConnections({path, nexuses, nodes}))
  nexuses.map(nexus => connectNetworkPaths(nexus, nodes))
  //
  const setupPath = options => {
    const { path, node} = options
    node.path(path).set(node).put({})
  }
  const setupNodes = options => {
    const { nodes, path} = options
    nodes.map(node => setupPath({path, node}))
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
  setupRootPaths({root, network})
  return ({paths,nodes})
}

const network = options => {
  const { port } = options
  web.listen(port, () => {
    let answer = `Network listening on port ${port}...`
    //
    const optGun = {file: seed, web, peers}
    const network = Gun(optGun);
    //
    const { paths,nodes } = createNetwork({network});
    //
    console.log({answer});
    console.log({paths,nodes});
    //
    return ({paths,nodes})
  });
  return ({web})
}

global.Gun = Gun; /// make global to `node --inspect` - debug only
global.gun = gun; /// make global to `node --inspect` - debug only

// [END app]
module.exports = network;