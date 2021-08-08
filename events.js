const WebSocket = require('ws')

function client(token) {
    ws_url = 'wss://gateway.discord.gg/?encoding=json&v=8'
    const ws = new WebSocket(ws_url)

    ws.on('open', () => authenticate(ws, token))

    ws.on('message', rawData => {
        const data = JSON.parse(rawData.toString('utf8'))
        
        switch (data['op']) {
            // Hello
            case 10:
                heartbeat(ws, data['d'])
                break
        }
    })

    ws.on('error', _ => client(token))
    ws.on('close', _ => client(token))
}

exports.client = client;

// Authenticate
function authenticate(ws, token) {
    ws.send(JSON.stringify({
        op: 2,
        d: {
            token: token,
            properties: {}
        }
    }))
}

// Heartbeat
function heartbeat(ws, data) { 
    let last_beat = data['heartbeat_interval'] / 2
    setInterval(() => {
        ws.send(JSON.stringify({
            op: 1,
            d: last_beat
        }))
        last_beat += data['heartbeat_interval'] / 2
    }, last_beat)
}