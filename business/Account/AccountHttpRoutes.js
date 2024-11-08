const AccountService = require('./AccountService')

const reset = (req, res) => {
  AccountService.reset()
  res.writeHead(200)
  res.end('OK')
}

const balance = (req, res) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1])
  const accountId = urlParams.get('account_id')

  try {
    const response = AccountService.getBalance(accountId)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(response))
  } catch (e) {
    res.writeHead(404)
    res.end("0")
  }
}

const event = (req, res) => {
  let body = ''
  let response
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    try {
      const event = JSON.parse(body)
      response = AccountService.processEvent(event)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(response))
    } catch (e) {
      res.writeHead(404)
      res.end("0")
    }
  })
}

exports.routes = {
  'GET': {
    '/balance': balance,
  },
  'POST': {
    '/reset': reset,
    '/event': event,
  },
}