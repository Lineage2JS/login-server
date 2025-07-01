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
  
  async getUserByLogin(userLogin) {
    const result = await this._client.query(`
      SELECT 
      user_login AS login,
      user_password AS password
      FROM users
      WHERE user_login = $1
    `, [userLogin]);
    const user = result.rows[0];

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async getOnlineCharactersCount() {
    const result = await this._client.query(`
      SELECT COUNT(*) as online_count
      FROM characters
      WHERE online = true
    `);
    const onlineCharactersCount = result.rows[0].online_count;

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