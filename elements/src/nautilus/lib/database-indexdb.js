import { genBins } from "@vx/mock-data";
let secrets;
/////
const loki = require('lokijs');
// import { encrypt, decrypt } from './parser'
// const LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter')
const IncrementalIndexedDBAdapter = require('lokijs/src/incremental-indexeddb-adapter.js')

const idbAdapter = new IncrementalIndexedDBAdapter();
const pa = new loki.LokiPartitioningAdapter(idbAdapter, { paging: true });

const AWS_ACCESS_KEY_ID = '23d82a53da3c4750a3e1039f0ba4c896';
const data = genBins(64, 16)

const db = new loki(AWS_ACCESS_KEY_ID, { 
  env: 'BROWSER',
  adapter: pa,
  autoload: true,
  autoloadCallback,
  autosave: true, 
  closeAfterSave: true,
  autosaveInterval: 4000
});

async function autoloadCallback() {
  // if database did not exist it will be empty so I will intitialize here
    secrets = db.getCollection('secrets');
  if (secrets === null) {
    secrets = db.addCollection('secrets');
    // console.log('1.database create new secrets collection:',secrets)
  }
  // const encryptedData = encrypt(data);
  // if (secrets) {
  //   await secrets.insert({
  //     name: 'stubdata',
  //     data: data
  //   })
  //   const count = secrets.count()
  //   console.log('1.database secrets count: ',count)
  //   const findOne = await secrets.findOne({})
  //   console.log('2.database secrets findOne: ',findOne)
  // }
}
const start = () => {
  db.loadDatabase()
  secrets = db.getCollection('secrets');
  if (secrets === null) {
    secrets = db.addCollection('secrets');
    // console.log('1.database start secrets:',secrets)
  }
  secrets.flushChanges()
  secrets.insert({
    name: 'stubdata',
    data: data
  })
  // const count = secrets.count()
  // console.log('1.database start secrets count: ',count)
  const findOne = secrets.findOne({})
  // console.log('2.database start secrets findOne: ',findOne)
  return {db, secrets}
}
// db.listCollections();

// db.saveDatabase();

module.exports =  {start}