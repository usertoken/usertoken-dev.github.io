const FS = require('fs');

const peers = [
  "https://usertoken-home.uc.r.appspot.com/gun",
  "https://concise-rampart-314505.ew.r.appspot.com/gun",
  "https://seed.alex2006hw.com/gun",
  "https://seed.bellbella.com/gun",
  "https://seed.clouderg.com/gun",
  "https://seed.pointlook.com/gun",
  "https://seed.workagent.com/gun",
  "https://seed.usertoken.com/gun",
  "https://seed.nautilusly.com/gun",
  "https://gun-us.herokuapp.com/gun",
  "https://gun-eu.herokuapp.com/gun",
  "https://gunjs.herokuapp.com/gun",
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