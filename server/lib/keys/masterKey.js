const {
    CryptographyKey,
    SodiumPlus
} = require('sodium-plus');
let sodium;

// const masterKey = '4956d80f6a09eb2f342f5edd2a8b81efc85d33104e1cf87604c989dfa451dc66'

const create = async () => {
    if (!sodium) sodium = await SodiumPlus.auto();
    await sodium.ensureLoaded( values => {
        console.log({values,
            'libsodium-wrappers': sodium.isLibsodiumWrappers(),
            'sodium-native': sodium.isSodiumNative()
        })
    });
    const key = await sodium.crypto_kdf_keygen();
    const hexkey = key.toString('hex')
    // const hexkey = masterKey
    // let masterKey = await sodium.sodium_hex2bin(hexkey);
    // console.log('1.masterKey create:', hexkey)
    return hexkey
}
/////
module.exports = { create }
