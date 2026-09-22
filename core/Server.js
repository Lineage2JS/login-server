const net = require('net');
const Client = require('./Client');

class Server {
  constructor() {
    this._server = null;
  }

  start(host, port, callback) {
    this._server = net.createServer(this._handler.bind(this));

    this._server.on('listening', this._onListening.bind(this, callback));
    this._server.on('connection', this._onConnection);
    this._server.listen(port, host);
  }

  _onListening(callback) {
    callback();
  }

  _onConnection() {
    console.log('client connection');
  }

  _handler(socket) {
    new Client(socket);
  }
}

module.exports = Server;