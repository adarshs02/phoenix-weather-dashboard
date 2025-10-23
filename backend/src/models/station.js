const pool = require('../config/database');

class Station {
  static async getAll() {
    const query = `
      SELECT
        s.id,
        s.external_id,
        s.name,
        s.latitude,
        s.longitude,
        src.name as source_name
      FROM station s
      LEFT JOIN source src ON s.source_id = src.id
      ORDER BY s.name
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  }

  static async getById(id) {
    const query = `
      SELECT
        s.id,
        s.external_id,
        s.name,
        s.latitude,
        s.longitude,
        src.name as source_name
      FROM station s
      LEFT JOIN source src ON s.source_id = src.id
      WHERE s.id = $1
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching station by id:', error);
      throw error;
    }
  }

  static async getByExternalId(externalId) {
    const query = `
      SELECT id, external_id, name, latitude, longitude, source_id
      FROM station
      WHERE external_id = $1
    `;

    try {
      const result = await pool.query(query, [externalId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching station by external id:', error);
      throw error;
    }
  }
}

module.exports = Station;
