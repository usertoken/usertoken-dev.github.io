const mdns = require('mdns');


var browser = mdns.createBrowser(mdns.tcp('http'));

// const browser = mdns.browseThemAll();

browser.on('serviceUp', service => {
  console.log('service up: ', service);
});
browser.on('serviceDown', service => {
  console.log('service down: ', service);
});

browser.on('warning', function (err) {
  console.log(err.stack);
});

browser.on('response', function (response) {
  console.log('got a response packet:', response);
});

browser.on('query', function (query) {
  console.log('got a query packet:', query);

  // iterate over all questions to check if we should respond
  query.questions.forEach(function (q) {
    if (q.type === 'A' && q.name === 'example.local') {
      // send an A-record response for example.local
      browser.respond({
        answers: [
          {
            name: 'example.local',
            type: 'A',
            ttl: 300,
            data: '192.168.1.5',
          },
        ],
      });
    }
  });
});

///
const start = options => {
  const port = options.port || 4321;
  const ad = mdns.createAdvertisement(mdns.tcp('http'), port).start();

  browser.start();
}
start()
////
module.exports = { start }