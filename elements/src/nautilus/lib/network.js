const Gun = require('gun');
// const AWS = require('aws-sdk');
const adapter = require('./storageAdapter');

// require('gun/axe');
require('gun/sea.js');
require('gun/nts.js');
require('gun/lib/time.js');
require('gun/lib/path.js');
require('gun/lib/open');

Gun.log.verbose = true;

var gunPeers = [];

const gunRel_ = Gun.val.rel._; // '#'
const gunNode_ = Gun.node._; // '_'

Gun.on('create', function (db) {
  this.to.next(db);
  const pluginInterop = function (middleware) {
    return function (request) {
      this.to.next(request);
      return middleware(request, db);
    };
  };

  // Register the adapter
  db.on('get', pluginInterop(adapter.read));
  db.on('put', pluginInterop(adapter.write));
});

Gun.on('out', function (msg) {
  this.to.next(msg);
  msg = JSON.stringify(msg);
  gunPeers.forEach(function (peer) {
    peer.send(msg);
  });
});

Gun.chain.unset = function (node) {
  // console.log('1.buildNode Gun.chain.unset node:', gunNode_);
  if (
    this &&
    node &&
    node[gunNode_] &&
    node[gunNode_].put &&
    node[gunNode_].put[gunNode_] &&
    node[gunNode_].put[gunNode_][gunRel_]
  )
    this.put({ [node[gunNode_].put[gunNode_][gunRel_]]: null });
  return this;
};

// Gun.log.once = () => console.log;

const forLoop = (node, start, end) => {
  node.get('counters').once((count) => {
    count = count ? count : 0;
    console.log('5.buildNode last bob counters : ', count); // Bob
    for (let i = start + count; i < start + count + end; i++) {
      console.log('4.buildNode bob new counter = ', i);
      node.get('counters').put(i);
    }
  });
};
const persistenceTest = (gun) => {
  const friends = gun.get('friends').put({});
  const bob = gun.get('bob').put({ name: 'Bob' });
  const dave = gun.get('dave').put({ name: 'Dave' });
  const karing = gun.get('Karing').put({ name: 'Karing' });

  // Write a fun circular reference.
  bob.get('friend').put(dave);
  dave.get('friend').put(bob);
  bob.get('friend').put(karing);
  karing.get('friend').put(dave);

  // Print the data!
  // bob.get('friend').once((friend) => {
  //   console.log('1.buildNode : ',friend.name); // Dave
  // });

  // Now with a circular reference
  // bob
  //   .get('friend')
  //   .get('friend')
  //   .once((friend) => {
  //     console.log('2.buildNode : ',friend.name); // Bob
  //   });

  // bob.get('counters').once(count => {
  //   console.log('3.buildNode bob counter : ',count); // Bob
  // })
  const timer = setInterval(forLoop, 1000, bob, 0, 100);

  // bob.get('counters').once(count => {
  //     console.log('5.buildNode bob counter : ',count); // Bob
  // })
  friends.set(bob);
  friends.set(dave);
  friends.set(karing);

  friends
    .get('friend')
    .map()
    .val((name, ID) => {
      console.log('6.buildNode friend ID: ', ID, 'name : ', name);
    });
  // get all records
  const queryAll = (data_path) => {
    console.log('10.buildNode queryAll for: ' + data_path);
    gun
      .get(data_path)
      .map()
      .val((name, ID) => {
        console.log('10.buildNode queryAll ID: ', ID, ' name : ', name);
      });
  };
  // filter out deleted (null) records
  const queryFilterAll = (data_path) => {
    console.log('queryFilterAll for: ' + data_path);
    gun
      .get(data_path)
      .map()
      .val((name, ID) => {
        if (!name) {
          return;
        }
        console.log('11.buildNode queryFilterAll ID: ', ID, ' name : ', name);
      });
  };
  // delete record
  const deletebyID = (data_path, qID) => {
    console.log('12.buildNode DELETE record :', qID);
    gun.get(data_path).path(qID).put(null);
  };
  const dataChange = (data_path) => {
    gun
      .get(data_path)
      .map()
      .on((name, ID) => {
        // var UI = $("#name-" + ID);
        if (!name) {
          console.log('8.buildNode dataChange (NULL) ID: ', ID);
          // UI.remove();
          return;
        }
        console.log('9.buildNode dataChange (VALID) ID: ', ID);
        // updateUI(ID, name);
      });
    // queryAll('friends');
  };
  //
  dataChange('friends');
  queryAll('friends');
  // queryFilterAll('friends');

  // deletebyID('friends', 'karing');
  // gun.get('friends').unset(karing)
  // bob.get('friend').put(null);

  // dataChange('friends');
  // queryAll('friends');
  // queryFilterAll('friends');
};
const buildNautilus = (options) => {
  const { gun, address } = options;
  // console.log('1.network buildnautilus :', address);
  const state = gun.get('state').put({ address });
  const network = gun.get('network').put({ address });
  const oracle = gun.get('oracle').put({ address });
  const nautilus = gun.get('nautilus').put({ name: 'nautilus', address });
  const root = gun.get('/').put({ address });

  root.set(nautilus);
  root.set(state);
  root.set(network);
  root.set(oracle);
  root.set(root);

  oracle.set(nautilus);
  oracle.set(state);
  oracle.set(network);
  oracle.set(oracle);
  oracle.set(root);

  network.set(nautilus);
  network.set(state);
  network.set(network);
  network.set(oracle);
  network.set(root);

  state.set(nautilus);
  state.set(state);
  state.set(network);
  state.set(oracle);
  state.set(root);

  nautilus.set(nautilus);
  nautilus.set(root);
  nautilus.set(network);
  nautilus.set(oracle);
  nautilus.set(state);
  return { oracle, nautilus, state, network };
};
const network = (options) => {
  // console.log('1.buildNode start :', options);
  const address = options.s3.accessKeyId;

  const gun = Gun(options);

  // persistenceTest(gun);
  const nodes = buildNautilus({ gun, address });
  return nodes;
};
export { network };
