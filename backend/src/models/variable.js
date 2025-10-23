const pool = require('../config/database');

class Variable {
  static async getAll() {
    const query = 'SELECT id, code, unit FROM variable ORDER BY code';

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching variables:', error);
      throw error;
    }
  }

  static async getByCode(code) {
    const query = 'SELECT id, code, unit FROM variable WHERE code = $1';

    try {
      const result = await pool.query(query, [code]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching variable by code:', error);
      throw error;
    }
  }
}

module.exports = Variable;
