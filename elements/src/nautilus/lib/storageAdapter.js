const Gun = require('gun');
// const { AsyncStorage } = require('react-native');
var AWS = require('aws-sdk');

const AWS_ACCESS_KEY_ID = '23d82a53da3c4750a3e1039f0ba4c896';
const AWS_SECRET_ACCESS_KEY = '478d28f5294c485b9399c34ed27a5f1b';
const AWS_S3_BUCKET = AWS_ACCESS_KEY_ID;
const AWS_S3_ENDPOINT = 'https://genesis.nautilusly.com';

var s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  endpoint: AWS_S3_ENDPOINT,
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4',
});

const readNode = (key, cb) => {
  let chunks = [];
  let fileBuffer;
  var params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
  };
  s3.getObject(params)
    .on('httpData', function (chunk) {
      chunks.push(chunk);
    })
    .on('httpDone', function () {
      fileBuffer = Buffer.concat(chunks);
      const stringData = JSON.parse(fileBuffer.toString('utf8'));
      // console.log('1.storageAdaptor data : ', stringData);
      cb(null, stringData);
    })
    .send();
  // AsyncStorage.getItem(key || '', cb);
};

const read = (request, db) => {
  const { get } = request;

  const dedupid = request['#'];
  const key = get['#'];
  const field = get['.'];

  const done = (err, data) => {
    if (!data && !err) {
      db.on('in', {
        '@': dedupid,
        put: null,
        err: null,
      });
    } else {
      db.on('in', {
        '@': dedupid,
        put: Gun.graph.node(data),
        err,
      });
    }
  };

  const acknowledgeRet = (err, result) => {
    if (err) {
      done(err);
    } else if (result === null) {
      // Nothing found
      done(null);
    } else {
      const temp = JSON.parse(result);
      if (field) {
        done(null, temp[field] || null);
      } else {
        done(null, temp);
      }
    }
  };

  readNode(key || '', acknowledgeRet);
};

const write = (request, db) => {
  const { put: graph } = request;
  const keys = Object.keys(graph);
  const dedupid = graph['#'];

  const instructions = keys.map((key) => {
    // console.log('2.storageAdaptor write key :',key,' graph: ',JSON.stringify(graph[key] || {}))
    // return [key, JSON.stringify(graph[key] || {})];
    var params = {
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: JSON.stringify(graph[key] || {}),
    };

    s3.putObject(params, function (err, data) {
      db.on('in', {
        '#': dedupid,
        ok: !err || err.length === 0,
        err,
      });
      // console.log('3..storageAdaptor Successfully uploaded data s3:',params);
    });
  });

  // AsyncStorage.multiMerge(instructions, (err) => {
  // 	db.on('in', {
  // 		'#': dedupid,
  // 		ok: !err || err.length === 0,
  // 		err,
  // 	});
  // });
};

// This returns a promise, it can be awaited!
// const reset = () => AsyncStorage.clear();

const reset = (key) => {
  var params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
  };

  s3.deleteObject(params, function (err, data) {
    // if (err) console.log('4.storageAdaptor delete error', err, err.stack);
    // else console.log('5.storageAdaptor delete successful data : ', data); // successful response
  });
};
module.exports = {
  read,
  write,
  reset,
};
