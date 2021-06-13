
const api = options => {
  // console.log('1.api options:',options)
  const { root } = options
  let response;
  if (root && root.get) {
    root.get('request').on(request => {
      if (request) {
        console.log('2.api request:',request)
        let r = eval("(" + request + ")")
        response = `{id: ${r.id}, data: 'yes'}`
        root.get('response').put(response)
      }
    })
  }
  if (response) return response;
}
////
module.exports = api
