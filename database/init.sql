-- Création de la table des contacts
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des questionnaires web
CREATE TABLE IF NOT EXISTS web_questionnaires (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    project_objective VARCHAR(50),
    target_audience TEXT,
    project_needs TEXT,
    inspiration TEXT,
    domain_hosting TEXT,
    mvp_features TEXT,
    secondary_features TEXT,
    tech_features TEXT[], -- Stocké comme un tableau
    security_requirements TEXT,
    visual_style TEXT[],  -- Stocké comme un tableau
    design_needs TEXT[],  -- Stocké comme un tableau
    maintenance TEXT,
    future_evolution TEXT,
    legal_requirements TEXT,
    budget VARCHAR(20),
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 