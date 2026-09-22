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

async function findActivityById(id) {
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
        WHERE id = $1
          AND is_active = TRUE
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
}

// Ajouter une activité
async function createActivity(activity) {
    const query = `
        INSERT INTO activities (
            name,
            description,
            sport,
            min_age,
            max_age,
            base_price,
            medical_certificate_required
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name
    `;

    const values = [
        activity.name,
        activity.description,
        activity.sport,
        activity.minAge,
        activity.maxAge,
        activity.basePrice,
        activity.medicalCertificateRequired
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}

async function updateActivity(id, activity) {
    const query = `
        UPDATE activities
        SET
            name = $1,
            description = $2,
            sport = $3,
            min_age = $4,
            max_age = $5,
            base_price = $6,
            medical_certificate_required = $7,
            updated_at = NOW()
        WHERE id = $8
          AND is_active = TRUE
        RETURNING id, name
    `;

    const values = [
        activity.name,
        activity.description,
        activity.sport,
        activity.minAge,
        activity.maxAge,
        activity.basePrice,
        activity.medicalCertificateRequired,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0] || null;
}


async function deactivateActivity(id) {
    const query = `
        UPDATE activities
        SET
            is_active = FALSE,
            updated_at = NOW()
        WHERE id = $1
          AND is_active = TRUE
        RETURNING id, name
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
}


module.exports = {
    findAllActivities,
    findActivityById,
    createActivity,
    updateActivity,
    deactivateActivity
};