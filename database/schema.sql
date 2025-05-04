-- Table pour les sujets principaux
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Table pour les sections
CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    order_num INTEGER NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    UNIQUE(subject_id, order_num)
);

-- Table pour les questions
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    order_num INTEGER NOT NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id),
    UNIQUE(section_id, order_num)
);

-- Table pour les réponses
CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    client_email TEXT NOT NULL,
    response_text TEXT NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    UNIQUE(question_id, client_email)
);

-- Table pour les soumissions de formulaire
CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    client_email TEXT NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    UNIQUE(subject_id, client_email)
); 