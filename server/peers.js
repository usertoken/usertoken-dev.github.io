const FS = require('fs');

const peers = [
  "https://usertoken.com/gun",
  "https://seed10.usertoken.com/gun",
  "https://seed11.usertoken.com/gun",
  'https://ut-one.uc.r.appspot.com/gun'
]

FS.writeFileSync('/tmp/peers.json', JSON.stringify(peers), {encoding:'utf8',flag:'w'});

const get = options => {
  let answer;
  switch (options) {
    case 'peers' : answer = JSON.stringify(peers)
      break
    default : answer = {}
  }
  return answer
}

module.exports = { get }