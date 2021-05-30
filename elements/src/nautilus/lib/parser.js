import Replicator from 'replicator';
import { Long, serialize, deserialize } from 'bson';
import { SodiumPlus } from 'sodium-plus';
// import {db} from './database'

// const cmp = (x, y) => x.a === y.a;
// let sodium;
//
const AWS_SECRET_ACCESS_KEY = '478d28f5294c485b9399c34ed27a5f1b';
// console.log('1.parser db collections : ',db.listCollections())
//////
const replicator = new Replicator({
  serialize (val) {
      return serialize(val, false, true, false);
  },
  deserialize: deserialize
});

const encode = async message => {
    // console.log(
    //   "1.parser encode message : ",
    //   message
    // );
  if (!message) return message;
  try {
    const encoded = await replicator.encode(message);
    // const decoded = replicator.decode(encoded)
    //
    // const encodeed = aesGcmEncrypt(message, AWS_SECRET_ACCESS_KEY)
    // const encoded= replicator.encode(encodeed);
    // validation
    // const decrypted = aesGcmDecrypt(encoded, AWS_SECRET_ACCESS_KEY)
    // const decoded = replicator.decode(decrypted)

    // console.log(  
    //     "2.parser encode encoded : ",
    //     encoded
    //   );
    // console.log('3.parser encode : ', message, ':verify:', decoded)
    return encoded;
  } catch (e) {
    // console.log( "3.parser encode error : ", e);
    return null;
  }
};

const decode = async message => {
    // console.log(
    //   "1.parser decode message : ",
    //   message
    // );
  if (!message) return message;
  try {
    const decoded = await replicator.decode(message)
    // const encoded= replicator.encode(encrypted);
    //
    // const decodeed = aesGcmDecrypt(message, AWS_SECRET_ACCESS_KEY)
    // const decoded = replicator.decode(decodeed)
    // // validation
    // const encrypted = aesGcmEncrypt(decoded, AWS_SECRET_ACCESS_KEY)
    // const encoded= replicator.encode(encrypted);

    // console.log(  
    //     "2.parser decode decoded ==> ",
    //     decoded
    //   );
    // console.log('3.parser decode : ', message, ' :verify:', encoded)
    return decoded;
  } catch (e) {
        // console.log( "3.parser decode error : ", e);
    return null;
  }
};
const encrypt = async message => {
    return await encode(message)
}
const decrypt = async message => {
    return await decode(message)
}
/////////////
export { encode, decode, encrypt, decrypt };