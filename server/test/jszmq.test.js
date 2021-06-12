// import * as jsmq from 'jszmq'
const jsmq = require('jszmq')

//////
const simple_request_response = port => {
    const req = new jsmq.Req()
    const rep = new jsmq.Rep()

    rep.bind(`ws://localhost:${port}`)
    req.connect(`ws://localhost:${port}`)

    req.send('Hello')
    rep.once('message', msg => {
        console.log('received:',msg.toString())
        rep.send('World')
    })
    req.once('message', msg => {
        if ( msg.toString() === 'World')
        console.log('received:',msg.toString())
        req.close()
        rep.close()
    })
}
const multiple_requests = port => {
    const rep = new jsmq.Rep()
    const reqs = []
    const last = new jsmq.Req()

    rep.bind(`ws://localhost:${port}`)

    for (let i = 0; i < 100; i++) {
        reqs[i] = new jsmq.Req()
        reqs[i].connect(`ws://localhost:${port}`)
    }
    last.connect(`ws://localhost:${port}`)

    rep.on('message', msg => rep.send(msg))
    for (let i = 0; i < 100; i++) {
        reqs[i].send("send:" + i.toString())
        reqs[i].once('message', reply => console.log(reply.toString()))
    }
    last.send('last finished')
    last.once('message', reply => {
        console.log(reply.toString())

        for (let i = 0; i < 100; i++)
            reqs[i].close()
        last.close()
        rep.close()

    })
}
//////
const subscribe = port => {
    const pub = new jsmq.XPub()
    const sub = new jsmq.Sub()

    pub.bind(`ws://localhost:${port}`)
    sub.subscribe('A')
    sub.connect(`ws://localhost:${port}`)

    // Waiting for subscriptions before publishing
    pub.once('message', () => {
        pub.send('B')
        pub.send('AAA')

        sub.once('message', topic => {
            console.log('topic received:',topic.toString())
            pub.close()
            sub.close()

        })
    })
}
const unsubscribe = port => {
    const pub = new jsmq.XPub()
    const sub = new jsmq.Sub()

    pub.bind(`ws://localhost:${port}`)
    sub.subscribe('A')
    sub.subscribe('B')
    sub.connect(`ws://localhost:${port}`)

    // Waiting for subscriptions before publishing
    pub.once('message', () => {
        pub.send('A')
        sub.once('message', topic => {
            sub.unsubscribe('A')
            pub.send('A')
            pub.send('B')

            sub.once('message', topic2 => {
                console.log('topic received:',topic2.toString())
                pub.close()
                sub.close()
    
            })
        })
    })
}
//////
const dealerRouter = port => {
    const router = new jsmq.Router()
    const dealer = new jsmq.Dealer()
    router.bind(`ws://localhost:${port}/dealer-router`)
    dealer.connect(`ws://localhost:${port}/dealer-router`)

    console.log('dealer send:','hello')
    dealer.send('hello')
    router.once('message', (routingId, message) => {
        console.log('router received:',message.toString())
        console.log('router send:','world')
        router.send([routingId, 'world'])
        dealer.once('message', reply => {
            console.log('dealer received:',reply.toString())
        })
    })
}
//////
const test = () => {
    simple_request_response(55555)
    multiple_requests(55556)
    subscribe(55557)
    unsubscribe(55558)
    dealerRouter(55559)
}

test()