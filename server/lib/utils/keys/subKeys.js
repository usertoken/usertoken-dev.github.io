const {
    CryptographyKey,
    SodiumPlus 
} = require('sodium-plus');
const logger = require('../logger')

let sodium, keys=[];

async function genkeys(options) {
    const { start, end, context, keysize, hexkey } = options
    let subkeys = []
    if (!sodium) sodium = await SodiumPlus.auto();
    await sodium.ensureLoaded( values => {
        console.log({values,
            'libsodium-wrappers': sodium.isLibsodiumWrappers(),
            'sodium-native': sodium.isSodiumNative()
        })
    });
    // let masterKey = await sodium.crypto_kdf_keygen();
    // let context = 'NAUTILUS';
    // const masterKey = await sodium.sodium_hex2bin(hexkey);
    const masterKey = new CryptographyKey(Buffer.from(hexkey, 'hex'))
    // logger.log({level: 'info', message: '1.subkeys options :',options, masterKey})
    // subkeys[0] = hexkey
    for (i=start;i<end;i++) {
        await sodium.crypto_kdf_derive_from_key(keysize, i, context, masterKey).then(key => {
            const hexkey = key.getBuffer().toString('hex')
            subkeys[i-start] =  Buffer.from(hexkey, 'hex')
            // logger.log({level: 'info', message: `1.subkeys ${i}`, hexkey, subkeys[i]})
        })
    }
    // subkeys[1] = await sodium.crypto_kdf_derive_from_key(32, 1, context, masterKey);
    // subkeys[2] = await sodium.crypto_kdf_derive_from_key(32, 2, context, masterKey);
    // subkeys[3] = await sodium.crypto_kdf_derive_from_key(32, 3, context, masterKey);
    
    // const k0 = await masterKey.getBuffer().toString('hex')
    // const k1 = await subkeys[1].getBuffer().toString('hex')
    // const k2 = await subkeys[2].getBuffer().toString('hex')
    // const k3 = await subkeys[3].getBuffer().toString('hex')

    // logger.log({level: 'info', message: }{
    //     '1': 'subkeys',
    //     'master-key': k0,
    //     'subkey1': k1,
    //     'subkey2': k2,
    //     'subkey3': k3
    // });
    // const keys = {
    //     k0,k1,k2,k3
    // }
    keys = keys.concat(subkeys)
    return keys
}

async function create(options) {
    const { start, context, keysize, hexkey } = options
    // let subkeys = []
    if (!sodium) sodium = await SodiumPlus.auto();
    await sodium.ensureLoaded( values => {
        console.log({values,
            'libsodium-wrappers': sodium.isLibsodiumWrappers(),
            'sodium-native': sodium.isSodiumNative()
        })
    });
    // let masterKey = await sodium.crypto_kdf_keygen();
    // let context = 'NAUTILUS';
    // const masterKey = await sodium.sodium_hex2bin(hexkey);
    const masterKey = new CryptographyKey(Buffer.from(hexkey, 'hex'))
    // logger.log({level: 'info', message: '1.subkeys options :',options, masterKey})
    // subkeys[0] = hexkey
    // for (i=start;i<end;i++) {
        return await sodium.crypto_kdf_derive_from_key(keysize, start, context, masterKey).then(key => {
            const subkey = key.getBuffer().toString('hex')
            // subkeys[i-start] =  Buffer.from(hexkey, 'hex')
            const   result = {masterkey: hexkey, subkey}
            // logger.log({level: 'info', message: '1.subkeys create', result})
            return result
        })
    // })
    // subkeys[1] = await sodium.crypto_kdf_derive_from_key(32, 1, context, masterKey);
    // subkeys[2] = await sodium.crypto_kdf_derive_from_key(32, 2, context, masterKey);
    // subkeys[3] = await sodium.crypto_kdf_derive_from_key(32, 3, context, masterKey);
    
    // const k0 = await masterKey.getBuffer().toString('hex')
    // const k1 = await subkeys[1].getBuffer().toString('hex')
    // const k2 = await subkeys[2].getBuffer().toString('hex')
    // const k3 = await subkeys[3].getBuffer().toString('hex')

    // logger.log({level: 'info', message: }{
    //     '1': 'subkeys',
    //     'master-key': k0,
    //     'subkey1': k1,
    //     'subkey2': k2,
    //     'subkey3': k3
    // });
    // const keys = {
    //     k0,k1,k2,k3
    // }
    // keys = keys.concat(subkeys)
    // return subkey
}

// const create = options => {
//     // const maxCount = Math.pow(2,8)
//     const start = options && options.start? options.start : 1
//     const end = options && options.end? options.end : 10
//     const context = options && options.context? options.context : 'NAUTILUS'
//     const hexkey = options && options.hexkey? options.hexkey : 0
//     const keysize = options && options.keysize? options.keysize : 32
//     const value = {start,end,context,hexkey,keysize}
//     const keys = subkeys(value)
//     return keys
// }
////
module.exports = { genkeys, create }