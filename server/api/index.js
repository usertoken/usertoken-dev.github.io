const { str2obj, keys } = require('../lib/utils/index')

const api = options => {
  // console.log('1.api options:',options)
  const { root } = options
  let response;
  if (root && root.get) {
    root.get('request').on(request => {
      if (request) {
        console.log('2.api request:',request)
        // let r = eval("(" + request + ")")
        let r = str2obj(request)
        if (r.id && r.task) {
          switch (r.task) {
            case 'echo':
              response = `{id: "${r.id}", data: "yes"}`
              // console.log('3.api response:',response)
              root.get('response').put(response)
            break;
            case 'newkey':
              keys.newkeys().then( result => {
                response = `{id: "${r.id}", data: \"${result}\"}`
                // console.log('4.api response:',response)
                root.get('response').put(response)
              })
            break;
          }
        }

      }
    })
  }
  if (response) return response;
}
////
module.exports = api
