const { pool } = require("../../config/database");

async function findAllActivities() {
    const query = `
        SELECT
            id,
            name,
            description,
            sport,
            min_age,
            max_age,
            base_price,
            medical_certificate_required
        FROM activities
        WHERE is_active = TRUE
        ORDER BY name ASC
    `;

    const result = await pool.query(query);

    return result.rows;
}

module.exports = { findAllActivities };