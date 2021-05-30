// App-side
// - App is for internal chain access
//
import Random from 'random-js';
import Gun from 'gun/gun.min.js'
import 'gun/nts'
import 'gun/lib/not.js'
import 'gun/lib/path.js'
import hrtime from 'browser-process-hrtime'
import DeviceInfo from 'react-native-device-info';

import GunSQLite from 'gun-react-native-sqlite'
import { languages } from './dictionary';
GunSQLite.bootstrap(Gun)

Gun.log.squelch = true;
const DEVICE_ID = DeviceInfo.getUniqueID() || '3401BFAC-202C-4AAA-8A20-A7B0E54314F8';
const DEVICE_MODEL = DeviceInfo.getModel();

// const gunPeers = [
//   // 'https://gunjs.herokuapp.com/gun', // open chain
//   'https://troposphere.usertoken.com/gun', // permission chain
//   'https://alex.us-east.mybluemix.net/gun', // permission chain
//   'https://haley.mybluemix.net/gun' // permission chain
// ];
const gunOptions = {
  // peers: gunPeers,
  sqlite: {
    database_name: DEVICE_ID + '-app' // separate worker from app database
  }
}
const LOCAL_CONFIG = {
  HASH_KEY: '0123456789ABCDEFGH',
  SERVER_API_KEY: '7d33e385-abb6-41e8-88d7-262cecc111b7',
  HOSTNAME: DEVICE_ID

}
const gunGlobal = Gun(gunOptions);
gunGlobal.on('out', { get: { '#': { '*': '' } } })
////
const increaseRequestCounter = () => {
  if (++requestCounter >= Number.MAX_SAFE_INTEGER) {
    requestCounter = 1;
    if (++counterLoop >= Number.MAX_SAFE_INTEGER) counterLoop = 1;
  }
};
////////////
// Token Check
///////////
var requestCounter = 1;
var counterLoop = 1;
// var gunServerPeers = []
var serverCountTable = []
var processTimeDelta = []
var siphash24 = require('siphash24')
var Buffer = require('safe-buffer').Buffer
const siphash24Input = processTimeDelta.concat([
  counterLoop,
  requestCounter,
  entropy,
]);
// Update entropy each request
var entropy = siphash24(
  Buffer.from(siphash24Input),
  Buffer.from(LOCAL_CONFIG.HASH_KEY),
).toString(16);
//
// gunServerPeers.push(gunPeers);
const SERVER_SEED = LOCAL_CONFIG.SERVER_API_KEY.replace(/\-/g, '');
// console.log('1.app utils gun serverPeers : ', gunServerPeers);

function Token(salt, seed) {
  const dictionary =
    languages[salt] && languages[salt].collation
      ? languages[salt].collation.replace(/\+|\-/g, '')
      : languages[0].collation.replace(/\+|\-/g, '');
  const dictionaryLength = dictionary.length;
  // console.log('1.app utils gun Token salt : ', salt);
  const array = []; // needs to be var
  // console.log('2.app utils gun Token salt', salt,'entropy', entropy, ' length', dictionaryLength,'dictionary : ', dictionary);
  for (let c = 0; c < seed.length; c += 4) array.push(`0x${seed.substr(c, 4)}`);
  array.push(salt);
  // console.log('3.app utils gun Token seed array : ', array, ' salt : ', salt);
  const engine = Random.engines.mt19937().seedWithArray(array);
  const token = siphash24(
    Buffer.from(Random.string(dictionary)(engine, dictionaryLength)),
    Buffer.from(LOCAL_CONFIG.HASH_KEY),
  ).toString(16);
  // console.log('4.app utils gun Token : ', token);
  return token;
}
function hasValidToken(msg, salt, seed) {
  increaseRequestCounter();
  if (
    msg &&
    msg.headers &&
    msg.headers.token &&
    msg.headers.id &&
    salt &&
    seed &&
    languages &&
    languages[salt] &&
    languages[salt].collation
  ) {
    const validToken = Token(salt, seed);
    const checkToken = msg.headers.token;
    processTimeDelta = hrtime(PROCESS_TIME);
    const entropyBuffer = processTimeDelta.concat([
      counterLoop,
      requestCounter,
      entropy,
    ]);
    // update entropy only when we received a good token
    entropy = siphash24(
      Buffer.from(entropyBuffer),
      Buffer.from(LOCAL_CONFIG.HASH_KEY),
    ).toString(16);
    PROCESS_TIME = hrtime();
    //   console.log(
    //     `1.app utils gun hasValidToken : ${msg.headers.id} : `,
    //     validToken,
    //     validToken === checkToken,
    //     checkToken,
    //    'entropy',entropy
    //   );
    return validToken === checkToken;
  }
  return false;
}

Gun.on('opt', ctx => {
  if (ctx.once) {
    return;
  }
  // Check all incoming traffic
  ctx.on('in', function(msg) {
    console.log('1.app utils gun IN writing : ', msg);
    const to = this.to;
    // restrict put writing
    if (msg.put && msg.headers && msg.headers.token && msg.headers.id) {
      if (
        hasValidToken(msg, serverCountTable[msg.headers.token], SERVER_SEED)
      ) {
          console.log(
            '2.app utils gun IN writing from : ',
            msg.headers.id,
            msg.headers.token,
          );
        delete msg.headers;
        to.next(msg);
      } else {
        console.log(
          '2.app utils gun IN DENIED writing from : ',
          msg.headers.id,
          msg.headers.token,
        );
      }
    } else {
      to.next(msg);
    }
  });
  ctx.on('out', function(msg) {
    const dictionary =
      languages[salt] && languages[salt].collation
        ? languages[salt].collation.replace(/\+|\-/g, '')
        : languages[0].collation.replace(/\+|\-/g, '');
    const dictionaryLength = dictionary.length;
    console.log('1.app utils gun OUT msg : ', JSON.stringify(msg));
    const to = this.to;
    // Adds headers for put writing
    const random = new Random(Random.engines.mt19937().autoSeed());
    const salt = random.integer(1, dictionaryLength);
    const token = Token(salt, SERVER_SEED);
    serverCountTable[token] = salt;
    msg.headers = {
      token,
      id: LOCAL_CONFIG.HOSTNAME,
    };
  console.log(
        '2.app utils gun OUT writing from : ',
        msg.headers.id,
        msg.headers.token,
      );
    // gunServerPeers.forEach(peer => {
    //   //   console.log('3.app utils gun OUT gunServerPeers : ', peer, ' msg : ', msg);
    //   to.next(msg); // pass to next middleware
    // });
    to.next(msg); // pass to next middleware
  });
});
////
const chains = {
  myToken: gunGlobal.get(DEVICE_ID), // my device .. my coin
  pointlook: gunGlobal.get('pointlook'), // another company
  usertoken: gunGlobal.get('usertoken'), // global hub
  hongbao: gunGlobal.get('hongbao') // my company
}

chains.hongbao.path('tokens').set(chains.myToken) // my token is a member of the set hongbao
chains.usertoken.path('chains').set(chains.pointlook) // pointlook is a member of usertoken set of chains
chains.usertoken.path('chains').set(chains.hongbao) // hongbao is a member of usertoken set of chains

chains.usertoken.path('chains').get('hongbao').on((seed, key) => { // get my seed using the path from usertoken to hongbao chain
  console.log('1.Master chains FOUND hongbao seed : ', seed)
})
chains.hongbao.get('message').on((message, key) => { // get message value directly from hongbao chain
  console.log('2.Master chains FOUND hongbao message : ', message)
})
chains.usertoken.path('chains').get('hongbao').get('id').on((id, key) => { // get the hongbao id from usertoken path
  console.log('3.Master chains FOUND hongbao id : ', id)
})
chains.myToken.get('port').on((port, key) => { // get the hongbao port from usertoken path
  console.log('4.Master chains FOUND hongbao port : ', port)
})
// chains.hongbao.put({id: DEVICE_ID, message: 'App Make A Wish', quantity: '1'})

export default {
  chains
};
