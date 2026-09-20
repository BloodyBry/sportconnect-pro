CREATE TABLE IF NOT EXISTS activities (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    sport VARCHAR(80) NOT NULL,

    min_age SMALLINT NOT NULL
        CHECK (min_age >= 0),

    max_age SMALLINT NOT NULL
        CHECK (max_age >= min_age),

    base_price NUMERIC(10, 2) NOT NULL
        CHECK (base_price >= 0),

    medical_certificate_required BOOLEAN
        NOT NULL DEFAULT FALSE,

    is_active BOOLEAN
        NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP
);