const http = require('http')
const url = require('url');
const AccountRoutes = require('../business/Account/AccountHttpRoutes.js')

const httpServer= http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const endpoint = parsedUrl.pathname;

  try {
    const route = AccountRoutes.routes[req.method][endpoint];
    return route(req, res)
  } catch (e) {
    res.writeHead(404)
    res.end('Route not found')
  }
})

exports.server = httpServer

exports.runServer = () => {
  const port = process.env.PORT || 3000
  return httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}