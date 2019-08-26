const app = require("../app")
const http = require("http")

const server = http.createServer(app)
const port = process.env.PORT || 3000

server.listen(port, () => console.log(`HTTP server is listening on port ${port}`))