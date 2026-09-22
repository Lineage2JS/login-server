const Server = require('./core/Server');
const database = require('./database');
const config = require('./config');
const server = new Server();

async function init() {
  console.log('starting login server...');

  try {
    await database.connect(
      config.database.username,
      config.database.password,
      config.database.host,
      config.database.port,
      config.database.dbname,
      () => {
        console.log("database connected: success");
    });
  } catch(e) {
    console.log(e.message);

    return;
  }

  try {
    server.start(config.loginserver.host, config.loginserver.port, () => {
      console.log(`login server listening on ${config.loginserver.host}:${config.loginserver.port}`);
    });
  } catch(e) {
    console.error(e);
  }
}

init();