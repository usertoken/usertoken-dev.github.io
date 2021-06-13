const { masterkey, subkeys } = require('../lib/utils/keys/index')

masterkey().then( 
  mkey => {
    console.log('1.keys test masterkey:',mkey)
    const skey = subkeys({start:10, end:100, masterkey: mkey})
  }
)
