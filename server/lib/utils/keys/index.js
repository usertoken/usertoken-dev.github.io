const masterkey = require('./masterKey')
const subkeys = require('./subKeys')

const subkeyCreate = (options) => {
    return new Promise((resolve,reject) => {
        subkeys.create(options).then(keys => {
            // console.log('2.index subkey count :',keys.length)
            // for (i=0;i<keys.length;i++)
            // const i = Math.floor(
            //     Math.random() * (keys.length - 1 + 1) + 1
            // )
            // console.log('3.index subkeys :',i,keys[i].toString('hex'))
            resolve(keys)
        })
    })
}
const masterKeyCreate = (options) => {
    return new Promise((resolve,reject) => {
        masterkey.create(options).then( hexkey => {
            // console.log('1.index masterKey :  ',hexkey)
            // const values = {start,end,context,hexkey,keysize}
            resolve(hexkey)
        }) 
    })
 
}
const newSubkeys = async options => {
    // const keyLimit = Math.pow(2,64) // 18446744073709552000
    // const maxCount = Math.pow(2,16)
    const start = options && options.start? options.start : 10
    const end = options && options.end? options.end : 20
    const context = options && options.context? options.context : 'NAUTILUS'
    const keysize = options && options.keysize? options.keysize : 32
    const masterkeyOptions = {
        start,end,context,keysize
    }
    const hexkey = options && options.masterkey? options.masterkey : await masterKeyCreate(masterkeyOptions)
    const subkeysOptions = {
        ...masterkeyOptions,
        hexkey
    }
    const subKeys = await subkeyCreate(subkeysOptions)
    return(subKeys)
}
////
module.exports = { masterkey: masterKeyCreate, subkeys: newSubkeys }