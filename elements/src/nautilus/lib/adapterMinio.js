var db
/////
// const AWS = require('aws-sdk')
var Minio = require('minio')
const Loki = require('lokijs')
const AWSS3SyncAdapter = require('./aws-s3-sync-adapter.js')

const AWS_ACCESS_KEY_ID = '23d82a53da3c4750a3e1039f0ba4c896';
const AWS_SECRET_ACCESS_KEY = '478d28f5294c485b9399c34ed27a5f1b';
const AWS_S3_BUCKET = AWS_ACCESS_KEY_ID;
const AWS_S3_ENDPOINT = 'https://genesis.nautilusly.com';

// const awsOptions = {
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     endpoint: AWS_S3_ENDPOINT,
//     s3ForcePathStyle: true, // needed with minio?
//     signatureVersion: 'v4',
//     bucket: AWS_S3_BUCKET
// }

const minioOptions = {
    useSSL: true,
    accessKey: AWS_ACCESS_KEY_ID,
    secretKey: AWS_SECRET_ACCESS_KEY,
    endpoint: AWS_S3_ENDPOINT,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4',
    bucket: AWS_S3_BUCKET
}
const minioClient = new Minio.Client(minioOptions);

// const s3 = new AWS.S3(awsOptions);

const initS3 = function () {
    const options = {
    ...minioOptions,
    'AWS': Minio,
    }
    const adapter = new AWSS3SyncAdapter(options);
    db = new Loki(AWS_ACCESS_KEY_ID, {
    autoload: false,
    autosave: true,
    adapter: adapter
    })
}
const saveS3 = function () {
    db.saveDatabase(function (err, data) {
    if (err) {
        console.log('1.adapterMinio saveDatabase Err:',err)
    } else {
        console.log('2.adapterMinio DB saved to AWS S3')
        loadS3() // Now attempt to load it back.
    }
    })
}
const loadS3 = function () {
    db.loadDatabase({}, function (err) {
    if (err) {
        console.log('1.adapterMinio loadDatabase Err:',err)
    } else {
        console.log('2.adapterMinio DB loaded from AWS S3')
    }
    })
}
/////
module.exports =  {
    init: initS3,
    save: saveS3,
    load: loadS3
}