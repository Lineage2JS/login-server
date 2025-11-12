const { Client } = require('pg');

class Database {
  constructor() {
    this._client = null;
  }

  async connect(username, password, host, port,  dbname, callback) {
    this._client = new Client({
      user: username,
      password,
      host,
      port,
      database: dbname,
    });
    
    try {
      await this._client.connect();

      callback()
    } catch(e) {
      throw new Error(`database connected: failed (${e.message})`);
    }
  }
  
  async getAccountByLogin(login) {
    const result = await this._client.query(`
      SELECT 
      login,
      password,
      access_level AS "accessLevel"
      FROM accounts
      WHERE login = $1
    `, [login]);
    const account = result.rows[0];

    if (account) {
      return account;
    } else {
      return null;
    }
  }

  async getOnlineCharactersCount() {
    const result = await this._client.query(`
      SELECT
      COUNT(*) AS "onlineCount"
      FROM characters
      WHERE online = true
    `);
    const onlineCharactersCount = result.rows[0].onlineCount;

    return onlineCharactersCount;
  }

  async getGameServers() {
    const result = await this._client.query(`
      SELECT
      id,
      host,
      port,
      age_limit AS "ageLimit",
      is_pvp AS "isPvP",
      max_players AS "maxPlayers",
      server_status AS status,
      server_type AS type
      FROM gameservers
    `);
    const gameservers = result.rows;

    return gameservers;
  }
}

module.exports = new Database();