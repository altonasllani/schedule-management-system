-- =====================================================================
-- 0) DROP TABLES
-- =====================================================================

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS userroles CASCADE;
DROP TABLE IF EXISTS group_courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS professors CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;

-- =====================================================================
-- Create Tables
-- =====================================================================

-- 1) Table roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- 2) Table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3) Table userroles (many-to-many midis users dhe roles)
CREATE TABLE userroles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4) Table semesters
CREATE TABLE semesters (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (start_date < end_date)
);

-- 5) Table courses
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 6) Table groups (për grupet e studentëve)
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 7) Table group_courses (many-to-many midis groups dhe courses)
CREATE TABLE group_courses (
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, course_id)
);

-- 8) Table rooms për ambientet (dhomat e mësimit, laboratoret)
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    capacity INT CHECK (capacity > 0)
);

-- 9) Table professors 
CREATE TABLE professors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

-- 10) Tabls sessions 
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id),
    group_id INT REFERENCES groups(id),
    room_id INT REFERENCES rooms(id),
    professor_id INT REFERENCES professors(id),
    semester_id INT REFERENCES semesters(id),
    day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7), -- 1=E Hënë, 7=E Diel
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    week_type TEXT DEFAULT 'all', -- 'even', 'odd', 'all'
    CHECK (start_time < end_time)
);

-- 11) Tabela audit_logs (Për regjistrimin e veprimeve)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id INT,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================================
-- 2) TË DHËNAT BAZË TË SISTEMIT
-- =====================================================================

-- 2.1) Shto rolet bazë në sistem
-- Vetëm këto 3 role: admin, professor, student (s’ka role "user")
INSERT INTO roles (name) VALUES ('admin'), ('professor'), ('student');

-- 2.2) Shto përdoruesit bazë
-- Mund t’i ndryshosh password_hash më vonë me hash real bcrypt.
INSERT INTO users (name, email, password_hash) VALUES 
('Admin User',         'admin@uni.edu',        'admin123'),
('Prof. Ali Aliu',     'ali.aliu@uni.edu',     'prof123'),
('Prof. Maria Marku',  'maria.marku@uni.edu',  'prof456'),
('Student John Doe',   'student1@uni.edu',     'student123'),
('Student Jane Smith', 'student2@uni.edu',     'student456');

-- 2.3) Shto lëndët akademike
INSERT INTO courses (name) VALUES 
('Matematikë 1'), ('Programim'), ('Fizikë'), ('Kimî'),
('Bazat e Databazave'), ('Inxhinieri Software'), ('Rrjetat Kompjuterike'),
('Algjebër Lineare'), ('Statistikë'), ('Arkitektura e Kompjuterave');

-- 2.4) Shto profesorët
INSERT INTO professors (name, email) VALUES 
('Prof. Dr. Ali Aliu',     'ali.aliu@uni.edu'),
('Prof. Dr. Maria Marku',  'maria.marku@uni.edu'),
('Prof. Dr. Sokol Sokoli', 'sokol.sokoli@uni.edu'),
('Prof. Dr. Anisa Hoxha',  'anisa.hoxha@uni.edu'),
('Prof. Dr. Fatmir Gjoka', 'fatmir.gjoka@uni.edu');

-- 2.5) Shto grupet e studentëve
INSERT INTO groups (name) VALUES 
('Grupi A'), ('Grupi B'), ('Grupi C'), ('Grupi D'), ('Master Grupi');

-- 2.6) Shto ambientet (dhomat)
INSERT INTO rooms (name, capacity) VALUES 
('A101', 30), ('A102', 25), ('B201', 40), ('B202', 35),
('Lab 1', 20), ('Lab 2', 15), ('Auditor 1', 100), ('Auditor 2', 80);

-- 2.7) Shto semestrat akademike
INSERT INTO semesters (name, start_date, end_date) VALUES 
('Semestri Viti 2024-2025', '2024-09-15', '2025-02-15'),
('Semestri Viti 2025-2026', '2025-03-01', '2025-07-31');

-- =====================================================================
-- 3) LIDHJET MIDIS TABELAVE
-- =====================================================================

-- 3.1) Cakto rolet për përdoruesit ekzistues

-- Admini
INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'admin@uni.edu' AND r.name = 'admin';

-- Profesorët
INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'ali.aliu@uni.edu' AND r.name = 'professor';

INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'maria.marku@uni.edu' AND r.name = 'professor';

-- Studentët ekzistues (këtu u japim rolin 'student' manualisht)
INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'student1@uni.edu' AND r.name = 'student';

INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'student2@uni.edu' AND r.name = 'student';

-- 3.2) Lidh grupet me lëndët
INSERT INTO group_courses (group_id, course_id) 
SELECT g.id, c.id FROM groups g, courses c 
WHERE g.name = 'Grupi A' AND c.name IN ('Matematikë 1', 'Programim', 'Bazat e Databazave', 'Algjebër Lineare');

INSERT INTO group_courses (group_id, course_id) 
SELECT g.id, c.id FROM groups g, courses c 
WHERE g.name = 'Grupi B' AND c.name IN ('Fizikë', 'Kimî', 'Rrjetat Kompjuterike', 'Statistikë');

-- 3.3) Krijo sesione të orarit
INSERT INTO sessions (course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type) 
SELECT c.id, g.id, r.id, p.id, s.id, 1, '08:00', '10:00', 'all'
FROM courses c, groups g, rooms r, professors p, semesters s
WHERE c.name = 'Matematikë 1' 
  AND g.name = 'Grupi A' 
  AND r.name = 'A101' 
  AND p.name = 'Prof. Dr. Ali Aliu' 
  AND s.name = 'Semestri Viti 2024-2025';

INSERT INTO sessions (course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type) 
SELECT c.id, g.id, r.id, p.id, s.id, 1, '10:00', '12:00', 'all'
FROM courses c, groups g, rooms r, professors p, semesters s
WHERE c.name = 'Programim' 
  AND g.name = 'Grupi A' 
  AND r.name = 'Lab 1' 
  AND p.name = 'Prof. Dr. Maria Marku' 
  AND s.name = 'Semestri Viti 2024-2025';


-- =====================================================================
-- 5) TRIGGER: ÇDO USER I RI → ROLE 'student' NË userroles
-- =====================================================================

CREATE OR REPLACE FUNCTION assign_default_student_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Shto rolin 'student' për çdo user të ri që krijohet
    INSERT INTO userroles (user_id, role_id)
    SELECT NEW.id, id FROM roles WHERE name = 'student';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_default_student
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION assign_default_student_role();

-- =====================================================================
-- 6) TESTIMI I TRIGGER-IT
-- =====================================================================
INSERT INTO users (name, email, password_hash) VALUES 
('Test Student', 'test.student@uni.edu', 'test123');

-- Kontrollo nëse roli 'student' u caktua automatikisht për user-in e ri
SELECT u.name AS user_name, r.name AS role_name 
FROM users u 
JOIN userroles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id 
WHERE u.email = 'test.student@uni.edu';

-- =====================================================================
-- 7) KONTROLLI I TË DHËNAVE
-- =====================================================================

-- Shfaq numrin e të dhënave në çdo tabelë
SELECT 'roles' AS table, COUNT(*) AS count FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'professors', COUNT(*) FROM professors
UNION ALL SELECT 'groups', COUNT(*) FROM groups
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'semesters', COUNT(*) FROM semesters
UNION ALL SELECT 'userroles', COUNT(*) FROM userroles
UNION ALL SELECT 'group_courses', COUNT(*) FROM group_courses
UNION ALL SELECT 'sessions', COUNT(*) FROM sessions;

-- Kontrollo strukturën e tabelës courses për verifikim
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND table_schema = 'public';

-- Kontrollo nëse ka mbetur ndonjë tabelë
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
