import { genBins } from '@vx/mock-data';
import { SodiumPlus } from 'sodium-plus';
import { database } from './lib/database';
import { network } from './lib/network';
// import { encrypt, decrypt } from './lib/parser';

///
let sodium;
///
const AWS_ACCESS_KEY_ID = '23d82a53da3c4750a3e1039f0ba4c896';
const AWS_SECRET_ACCESS_KEY = '478d28f5294c485b9399c34ed27a5f1b';
const AWS_S3_BUCKET = AWS_ACCESS_KEY_ID;
const AWS_S3_ENDPOINT = 'https://genesis.nautilusly.com';
const s3 = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  endpoint: AWS_S3_ENDPOINT,
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4',
  bucket: AWS_S3_BUCKET,
  key: 'nautilus',
};

const testSodium1 = async () => {
  sodium = await SodiumPlus.auto();
  let key = await sodium.crypto_secretbox_keygen();
  console.log('1.parser testSodium key : ', key);

  let nonce = await sodium.randombytes_buf(24);
  console.log('2.parser testSodium randombytes : ', nonce);

  // Message can be a string, buffer, array, etc.
  let message = AWS_SECRET_ACCESS_KEY;
  console.log('3.parser testSodium message : ', message);
  let ciphertext = await sodium.crypto_secretbox(message, nonce, key);
  console.log('4.parser testSodium ciphertext : ', ciphertext);

  let decrypted = await sodium.crypto_secretbox_open(ciphertext, nonce, key);
  console.log('5.parser testSodium decrypted message : ', decrypted);
  console.log(decrypted.toString('utf-8'));
};
const testSodium = async options => {
  // sodium = await SodiumPlus.auto();
  // const masterKey = await sodium.crypto_kdf_keygen();
  // const context = 'Nautilus';
  const { masterKey, context } = options;
  const key = await sodium.crypto_kdf_derive_from_key(32, 1, context, masterKey);
  const subkey2 = await sodium.crypto_kdf_derive_from_key(32, 2, context, masterKey);
  const subkey3 = await sodium.crypto_kdf_derive_from_key(32, 3, context, masterKey);

  console.log({
    'master-key': masterKey.getBuffer().toString('hex'),
    key: key.getBuffer().toString('hex'),
    subkey2: subkey2.getBuffer().toString('hex'),
    subkey3: subkey3.getBuffer().toString('hex'),
  });
  console.log('1.parser testSodium key : ', key.getBuffer().toString('hex'));
  // const key = await sodium.crypto_secretbox_keygen();
  // console.log('1.parser testSodium key : ',key)

  const nonce = await sodium.randombytes_buf(24);
  console.log('2.parser testSodium randombytes : ', nonce);

  // Message can be a string, buffer, array, etc.
  const message = AWS_SECRET_ACCESS_KEY;
  console.log('3.parser testSodium message : ', message);
  const ciphertext = await sodium.crypto_secretbox(message, nonce, key);
  console.log('4.parser testSodium ciphertext : ', ciphertext);

  const decrypted = await sodium.crypto_secretbox_open(ciphertext, nonce, key);
  console.log('5.parser testSodium decrypted message : ', decrypted);
  console.log(decrypted.toString('utf-8'));
};
const startSodium = async () => {
  sodium = await SodiumPlus.auto();
  const masterKey = await sodium.crypto_kdf_keygen();
  const context = 'Nautilus';

  testSodium({ masterKey, context });
};
//////////////////////
const formatGunData = values =>
  Object.keys(values)
    .map(key => ({ key, val: values[key] }))
    .filter(t => Boolean(t.val) && t.key !== '_');

// const updateStubdata = async options => {
//   const { network, data } = options;
//   // const data = genBins(64, 16)
//   // console.log('1.nautilus updateStubdata :', JSON.stringify(data))
//   const encryptedData = await encrypt(data);
//   network.nautilus.get('stubdata').put(JSON.stringify(encryptedData));
//   // network.nautilus.get('stubdata').once(stubdata => {
//   //     console.log('2.nautilus updateStubdata validate :  ',stubdata)
//   // })
//   secrets.insert({
//     name: 'stubdata',
//     data: encryptedData,
//   });
//   const count = secrets.count();
//   console.log('3.nautilus count: ', count);
//   return encryptedData;
// };

const Nautilus = () => {
  startSodium();
  const nautilus = network({ s3 });
  const { db } = database();
  db.loadDatabase();
  const data = genBins(64, 16);
  // console.log('1.nautilus db collections : ',db.listCollections())
  const secrets = db.getCollection('secrets');
  secrets.flushChanges();
  // console.log('2.nautilus db secrets collection : ',secrets)
  // console.log('1.nautilus secrets count: ',count)
  // const encryptedData = await encrypt(genBins(64, 16));
  // console.log('1.nautilus create new encryptedData:', encryptedData)
  // const encryptedData = updateStubdata({network,data})
  // console.log('2.nautilus encryptedData: ',encryptedData)
  // network.nautilus.get('stubdata').once(value => {
  //     const pdata = JSON.parse(value).data
  //     console.log('3.nautilus stubdata :  ', pdata)
  //     if (!pdata) {
  //         const newData = genBins(64, 16)
  //         updateStubdata({network, data:newData})
  //         return newData
  //     }
  //     return pdata
  // })

  // if  (secrets) console.log('4.nautilus secrets count: ',secrets.count,secrets.findOne({}))
  return { data, network: nautilus };
};
////
export default Nautilus;
