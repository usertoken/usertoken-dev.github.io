let requestID = 'onboarding'
const api = options => {
  // console.log('1.api options:',options)
  const { root } = options
  let response;
  if (root && root.get) {
    root.get(requestID).on(request => {
      console.log('2.api request:',request)
      response = "{id: '1234', data: 'yes'}"
    })
  }
  if (response) return response;
}
////
module.exports = api
