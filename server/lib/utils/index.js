///
const fs = require('fs');
const logger = require('./logger')
const stream = require('./stream')
const keys = require('./keys/index')

const str2obj = str => {
    const answer = str.replace(/(\w+:)|(\w+ :)/g, matchedStr => {
      return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
    })
    return JSON.parse(answer)
}
const flattenFilterAndSort = arr => {
  let flatArray = [];
  for(var i = 0; i < arr.length; i++) {
      if(Array.isArray(arr[i])) {
          flatArray = flatArray.concat(flatten(arr[i]));
      } else {
          flatArray.push(arr[i]);
      }
  }
  return typeof(flatArray[0]) === 'string' ? [...new Set(flatArray)].sort() : [...new Set(flatArray)].sort((num1, num2) => {return num1 - num2})
}
const copyfs = (oldPath, newPath, callback) => {
        const readStream = fs.createReadStream(oldPath);
        const writeStream = fs.createWriteStream(newPath);
        readStream.on('error', callback);
        writeStream.on('error', callback);
        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });
        readStream.pipe(writeStream);
}
const movefs = (oldPath, newPath, callback) => {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });
}
///
module.exports = {
    flattenFilterAndSort, 
    str2obj,
    copyfs,
    movefs,
    logger,
    keys,
    stream,
};
