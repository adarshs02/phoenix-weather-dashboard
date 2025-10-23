const pool = require('../config/database');

class Reading {
  static async getLatest() {
    const query = `
      WITH latest_readings AS (
        SELECT DISTINCT ON (station_id, variable_id)
          station_id,
          variable_id,
          observed_at,
          value_num,
          value_text
        FROM reading
        ORDER BY station_id, variable_id, observed_at DESC
      )
      SELECT
        s.id as station_id,
        s.name as station_name,
        s.latitude,
        s.longitude,
        v.code as variable_code,
        v.unit as variable_unit,
        lr.observed_at,
        lr.value_num,
        lr.value_text,
        src.name as source_name
      FROM latest_readings lr
      JOIN station s ON lr.station_id = s.id
      JOIN variable v ON lr.variable_id = v.id
      LEFT JOIN source src ON s.source_id = src.id
      ORDER BY s.name, v.code
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching latest readings:', error);
      throw error;
    }
  }

  static async getLatestByStation(stationId) {
    const query = `
      WITH latest_readings AS (
        SELECT DISTINCT ON (variable_id)
          variable_id,
          observed_at,
          value_num,
          value_text
        FROM reading
        WHERE station_id = $1
        ORDER BY variable_id, observed_at DESC
      )
      SELECT
        v.code as variable_code,
        v.unit as variable_unit,
        lr.observed_at,
        lr.value_num,
        lr.value_text
      FROM latest_readings lr
      JOIN variable v ON lr.variable_id = v.id
      ORDER BY v.code
    `;

    try {
      const result = await pool.query(query, [stationId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching latest readings by station:', error);
      throw error;
    }
  }

  static async upsert(stationId, variableId, observedAt, valueNum, valueText = null) {
    const query = `
      INSERT INTO reading (station_id, variable_id, observed_at, value_num, value_text)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (station_id, variable_id, observed_at)
      DO UPDATE SET
        value_num = EXCLUDED.value_num,
        value_text = EXCLUDED.value_text,
        created_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [stationId, variableId, observedAt, valueNum, valueText]);
      return result.rows[0];
    } catch (error) {
      console.error('Error upserting reading:', error);
      throw error;
    }
  }
}

module.exports = Reading;
