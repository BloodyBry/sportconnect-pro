INSERT INTO activities (
    name,
    description,
    sport,
    min_age,
    max_age,
    base_price,
    medical_certificate_required
)
VALUES
(
    'Natation',
    'Cours de natation pour enfants et adolescents.',
    'Natation',
    6,
    17,
    350.00,
    TRUE
),
(
    'Basketball',
    'Entraînement collectif de basketball.',
    'Basketball',
    10,
    17,
    300.00,
    TRUE
),
(
    'Judo',
    'Initiation et perfectionnement au judo.',
    'Judo',
    8,
    17,
    320.00,
    TRUE
)
ON CONFLICT (name) DO NOTHING;