
// [START app]
const express = require('express');
const path = require('path');
const Gun = require('gun');
const shelljs = require('shelljs');

const web = express();

require('gun/nts');
require('gun/axe');
require('gun/sea');

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
const connectNetworkPaths = options => {
  const { nexus, nodes } = options
  createNetworkPaths({nexus, path: 'paths', nodes})
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

  // root.get('network').set(network).put({});
  // root.get('accessnexus').set(accessnexus).put({});
  // root.get('beaconnexus').set(beaconnexus).put({});
  // root.get('hiddennexus').set(hiddennexus).put({});
  // root.get('lognexus').set(lognexus).put({});
  // root.get('metricnexus').set(metricnexus).put({});
  // root.get('rewardnexus').set(rewardnexus).put({});

  // root.get('alex2006hw').set(alex2006hw).put({});
  // root.get('bellbella').set(bellbella).put({});
  // root.get('clouderg').set(clouderg).put({});
  // root.get('nautilusly').set(nautilusly).put({});
  // root.get('pointlook').set(pointlook).put({});
  // root.get('usertoken').set(usertoken).put({});
  // root.get('workagent').set(workagent).put({});

  // connecting the nodes
  // root.get('paths').set(root).put({})
  // root.get('paths').set(network).put({})
  // root.get('paths').set(accessnexus).put({})
  // root.get('paths').set(beaconnexus).put({});
  // root.get('paths').set(hiddennexus).put({});
  // root.get('paths').set(lognexus).put({});
  // root.get('paths').set(metricnexus).put({});
  // root.get('paths').set(rewardnexus).put({});

  // root.get('paths').set(alex2006hw).put({});
  // root.get('paths').set(bellbella).put({});
  // root.get('paths').set(clouderg).put({});
  // root.get('paths').set(nautilusly).put({});
  // root.get('paths').set(pointlook).put({});
  // root.get('paths').set(usertoken).put({});
  // root.get('paths').set(workagent).put({});
}
//
const createNetwork = options => {
  const gun = Gun(options);
  global.Gun = Gun; /// make global to `node --inspect` - debug only
  global.gun = gun; /// make global to `node --inspect` - debug only
  //
  const root = gun.get('/').put({});
  root.get('root').set(root).put({})

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
  setupRootPaths({root, nodes})
  //
  for (const nexus of nexuses) connectNetworkPaths({nexus, nodes})
  //
  for (const path of paths) createNetworkConnections({path, nexuses, nodes})
  //
  for (const path of paths) setupNodesPath({path, nodes})
  //
  // root.get('paths').map().once(node => {
  //   console.log('1.network createNetwork node:',{node})
  // })
  return ({gun,root})
}

const network = options => {
  const { port } = options
  return web.listen(port, () => {
    let answer = `Network listening on port ${port}...`
    //
    const optGun = {file: seed, web, peers}
    //
    const { gun, root } = createNetwork(optGun);
    //
    console.log({answer});
    // console.log({root});
    // root.get('paths').map().once(node => {
    //   console.log('1.network node:',{node})
    // })
    //
    return ({gun,root})
  });
}

// [END app]
module.exports = network;