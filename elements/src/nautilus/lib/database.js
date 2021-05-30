import { genBins } from "@vx/mock-data";
let secrets;
/////
const loki = require('lokijs');
// const AWS = require('aws-sdk')
const {initS3,loadS3,saveS3} = require('./adapterS3')
// import { encrypt, decrypt } from './parser'

const IncrementalIndexedDBAdapter = require('lokijs/src/incremental-indexeddb-adapter.js')

const idbAdapter = new IncrementalIndexedDBAdapter();
const pa = new loki.LokiPartitioningAdapter(idbAdapter, { paging: true });

const AWS_ACCESS_KEY_ID = '23d82a53da3c4750a3e1039f0ba4c896';

const db = new loki(AWS_ACCESS_KEY_ID, { 
  ENV: 'BROWSER',
  adapter: pa,
  autoload: true,
  autoloadCallback,
  autosave: true, 
  closeAfterSave: true,
  autosaveInterval: 4000
});

async function autoloadCallback() {
    secrets = db.getCollection('secrets');
  if (secrets === null) {
    secrets = db.addCollection('secrets');
  }
}
// const updateS3 = () => {
//   secrets.flushChanges()
//   const {init,load,save} = S3Adapter
//   init()
//   save()
//   load()
// }
const database = () => {
  // const {initS3,loadS3,saveS3} = S3Adapter
  initS3()
  loadS3()
  db.loadDatabase()
  secrets = db.getCollection('secrets');
  if (secrets === null) {
    secrets = db.addCollection('secrets');
    console.log('1.database create new secrets:',secrets)
    secrets.flushChanges()
    const data = genBins(64, 16)
    secrets.insert({
      name: 'stubdata',
      data: data
    })
  }
  const count = secrets.count()
  console.log('1.database start secrets count: ',count)
  secrets.flushChanges()
  db.saveDatabase()
  const saveInterval = setInterval(saveS3,100)
  // saveS3()
  const findAll = secrets.find({})
  console.log('2.database start secrets findAll: ',findAll)
  return {db, secrets}
}
// db.listCollections();

// db.saveDatabase();

export { database }