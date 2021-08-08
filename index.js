const { client } = require('./events')

const tokens = []

tokens.forEach(token => {
    client(token)
})