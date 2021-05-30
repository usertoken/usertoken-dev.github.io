/* eslint */
/* global define */

/* jslint browser: true, node: true, plusplus: true, indent: 2 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.lokiAWSS3SyncAdapter = factory();
  }
}(this, function () {
  return (function (options) {
    'use strict';

    function AWSS3SyncAdapterError (message) {
      this.name = 'AWSS3SyncAdapterError';
      this.message = (message || '');
    }

    AWSS3SyncAdapterError.prototype = Error.prototype;

    /**
     * This adapter requires an object options is passed containing the following properties:
     *  AWS: Reference to the AWS SDK.
     *  accessKeyId: AWS access key ID
     *  secretAccessKey: AWS secret access key
     *  bucket: A global aws bucket name
     */
    function AWSS3SyncAdapter (options) {
      this.options = options;
      this.options.ENV = 'BROWSER'

      if (!options) {
        throw new AWSS3SyncAdapterError('No options configured in AWSS3SyncAdapter');
      }

      if (!options.AWS) {
        throw new AWSS3SyncAdapterError('No AWS library specified in options');
      }

      if (!options.accessKeyId) {
        throw new AWSS3SyncAdapterError('No accessKeyId property specified in options');
      }

      if (!options.secretAccessKey) {
        throw new AWSS3SyncAdapterError('No secretAccessKey property specified in options');
      }

      if (!options.bucket) {
        throw new AWSS3SyncAdapterError('No bucket property specified in options');
      }

      if (!options.endpoint) {
        throw new AWSS3SyncAdapterError('No endpoint property specified in options');
      }
      
      this.options.AWS.config.update({
        accessKeyId: options.accessKeyId, secretAccessKey: options.secretAccessKey,
        endpoint:options.endpoint, bucket: options.bucket,
        s3ForcePathStyle: true, signatureVersion: 'v4',
      });
    }

    AWSS3SyncAdapter.prototype.saveDatabase = function (name, data, callback) {
      console.log('1.awsS3sync saveDatabase:', name);
        var params = {
          Bucket: this.options.bucket,
          Key: name,
          Body: Buffer.from(data).toString('base64'),
          Tagging: '' // key1=value1&key2=value2
        };
        const s3 = new this.options.AWS.S3();
        s3.putObject(params, function (err, data) {
          if (err) {
            console.log('2.awsS3sync saveDatabase Error:', err, err.stack);
            throw new AWSS3SyncAdapterError('Remote S3 sync failed');
          } else {
            console.log('3.awsS3sync Successfully uploaded data s3:',data);
            return callback(null, data);
          }
        });
    }

    AWSS3SyncAdapter.prototype.loadDatabase = function (key, cb) {
      let chunks = [];
      let fileBuffer;
      
      var params = {
        Bucket: this.options.bucket,
        Key: key,
      };
      const s3 = new this.options.AWS.S3();
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

    return AWSS3SyncAdapter;
  }());
}));
