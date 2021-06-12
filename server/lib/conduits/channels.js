const url = require("url");
const Gun = require("gun");
const nomem = require('./nomem')(); // no-memory storage adapter for RAD
const WebSocket = require("ws");

// LRU with last used sockets
const QuickLRU = require("quick-lru");
const lru = new QuickLRU({ maxSize: 10, onEviction: false });
const swarmLru = new QuickLRU({ maxSize: 10, onEviction: false });

const peers = require('../peers').get('peers');

require("./gun-ws.js"); // required to allow external websockets into gun constructor
require("./mem.js"); // disable to allow file writing for debug

require("gun/sea");
require("gun/lib/then");
const SEA = Gun.SEA;

let gun = {};
let sigs = {};
let swarmSocket;
let pathname = url.pathname || "/gun";

const swarmApi = async ({network,socket,peers}) => {
  Gun.on('opt',function(ctx){
    if(ctx.once) return;
    ctx.on('in',function(msg){
      // console.log("1.channels in msg",msg);
      this.to.next(msg);
    })
    ctx.on('out',function(msg){
      // console.log("2.channels out msg",msg);
      this.to.next(msg);
    })
  })
  gun = Gun({
    peers: peers, // should we use self as peer?
    localStorage: false,
    store: nomem,
    file: "/tmp/" + Gun.state() + "-" + pathname, // make sure not to reuse same storage context
    radisk: true, // important for nomem!
    multicast: false,
    ws: { noServer: true, path: pathname }
  })
  if (swarmLru.has(network)) {
    // Existing Node
    swarmSocket = await swarmLru.get(network);
    // console.log("1.channels swarmApi network:", network);
  }
  swarmLru.set(network, socket);
}
//
const wSocket = async (request, socket, head) => {
    let parsed = url.parse(request.url, true);
    console.log("1.channels parsed", parsed);
    let sig = parsed.query && parsed.query.sig ? parsed.query.sig : false;
    let creator =
      parsed.query && parsed.query.creator ? parsed.query.creator : "server";
    let pathname = parsed.pathname || "/gun";
    pathname = pathname.replace(/^\/\//g, "/");
    console.log("2.channels Got WS request", pathname);
  
    gun = { gun: false, server: false };
    if (pathname) {
      let roomname = pathname
        .split("")
        .slice(1)
        .join("");
      console.log("3.channels roomname", roomname);
      if (lru.has(pathname)) {
        // Existing Node
        console.log("4.channels Recycle id", pathname);
        gun = await lru.get(pathname);
      } else {
        // Create Node
        console.log("5.channels Create id", pathname);
        // NOTE: Only works with lib/ws.js shim allowing a predefined WS as ws.web parameter in Gun constructor
        gun.server = new WebSocket.Server({ noServer: true, path: pathname });
        console.log("6.channels set peer", request.headers.host + pathname);
        if (sig) {
          sigs[roomname] = sig;
          console.log("7.channels stored sig ", sig, "to pathname", roomname);
        }
        console.log("8.channels gunsea",Gun.SEA);
        SEA.throw = 1;
        Gun.on('opt',function(ctx){
            if(ctx.once) return;
            ctx.on('in',function(msg){
                    console.log("9.channels msg",msg);
                    this.to.next(msg);
                })
        })
        let qs = [
          "sig=" + encodeURIComponent(sig ? sig : ""),
          "creator=" + encodeURIComponent(creator ? creator : "")
        ].join("&");
        // let relaypath = roomname + "?" + qs;
        // let peers = []; //relaypeers.split(',').map(function(p){ return p+relaypath; });
        console.log("10.channels peers", peers);
        const g = (gun.gun = Gun({
          peers: peers, // should we use self as peer?
          localStorage: false,
          store: nomem,
          file: "/tmp/" + Gun.state() + "-" + pathname, // make sure not to reuse same storage context
          radisk: true, // important for nomem!
          multicast: false,
          ws: { noServer: true, path: pathname }
        }));
        gun.server = gun.gun.back("opt.ws.web"); // this is the websocket server
        lru.set(pathname, gun);
        let obj = {
          label: roomname.replace(/(_.*)/, ""),
          timestamp: Gun.state(),
          roomname: roomname,
          creator: creator
        };
        var meething = g.get("meething").put({ label: "Meething" });
        console.log("11.channels object is", obj);
        if (sig) {
          let user = g.user();
          user.create(roomname, sig, function(dack) {
              console.log("12.channels We've got user create ack", dack, roomname, sig);
            if (dack.err) {
              console.log("13.channels error in user.create", dack.err);
            }
            user.auth(roomname, sig, function(auth) {
              console.log("14.channels We've got user auth ack", auth);
              if (auth.err) {
                console.log("15.channels error in auth", auth.err);
              }
              console.log("16.channels auth",auth,roomname,sig);
              Object.assign(obj, {
                pub: dack.pub,
                passwordProtected: "true"
              });
                console.log(
                  "putting",
                  roomname,
                  "with object",
                  obj,
                  `to user ${dack.pub}`
                );
              user.get(roomname).put(obj, function(roomack) {
                //TODO: @marknadal fix me
                console.log("17.channels roomnode?", roomack);
                var roomnode = user.get(roomname);
                g.get("meething")
                  .get(roomname)
                  .put(roomnode, function(puback) {
                    console.log("18.channels put object", puback);
                  });
              });
            });
          });
        } else {
          Object.assign(obj, { passwordProtected: false });
          g.get("meething")
            .get(roomname)
            .put(obj, function(grack) {
              console.log("19.channels room created", grack);
            });
        }
      }
    }
    if (gun.server) {
      // Handle Request
      gun.server.handleUpgrade(request, socket, head, function(ws) {
          console.log("20.channels connecting to gun instance", gun.gun.opt()._.opt.ws.path);
        gun.server.emit("connection", ws, request);
      });
    } else {
      console.log("21.channels destroying socket", pathname);
      socket.destroy();
    }
}
///
module.exports = { wSocket, swarmApi }
