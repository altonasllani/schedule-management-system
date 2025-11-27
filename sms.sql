-- NUK na duhet më uuid-ossp, po përdorim SERIAL
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

-- 1) roles me ID numerik
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- 2) users me ID numerik
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3) userroles me ID numerik
CREATE TABLE userroles (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4) semesters me ID numerik
CREATE TABLE semesters (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (start_date < end_date)
);

-- 5) courses me ID numerik
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 6) groups me ID numerik
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 7) group_courses me ID numerik
CREATE TABLE group_courses (
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, course_id)
);

-- 8) rooms me ID numerik
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    capacity INT CHECK (capacity > 0)
);

-- 9) professors me ID numerik
CREATE TABLE professors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

-- 10) sessions me ID numerik
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id),
    group_id INT REFERENCES groups(id),
    room_id INT REFERENCES rooms(id),
    professor_id INT REFERENCES professors(id),
    semester_id INT REFERENCES semesters(id),
    day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    week_type TEXT DEFAULT 'all',
    CHECK (start_time < end_time)
);

-- 11) audit_logs me ID numerik
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id INT,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);


-- Kontrolloni strukturën e tabelës courses
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND table_schema = 'public';

-- Kontrolloni nëse ka mbetur ndonjë tabelë
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';



-- 1) Të dhënat bazë dhe testimi
INSERT INTO roles (name) VALUES ('admin'), ('professor'), ('student');

INSERT INTO users (name, email, password_hash) VALUES 
('Admin User', 'admin@uni.edu', 'admin123'),
('Prof. Ali Aliu', 'ali.aliu@uni.edu', 'prof123'),
('Prof. Maria Marku', 'maria.marku@uni.edu', 'prof456'),
('Student John Doe', 'student1@uni.edu', 'student123'),
('Student Jane Smith', 'student2@uni.edu', 'student456');

INSERT INTO courses (name) VALUES 
('Matematikë 1'), ('Programim'), ('Fizikë'), ('Kimî'),
('Bazat e Databazave'), ('Inxhinieri Software'), ('Rrjetat Kompjuterike'),
('Algjebër Lineare'), ('Statistikë'), ('Arkitektura e Kompjuterave');

INSERT INTO professors (name, email) VALUES 
('Prof. Dr. Ali Aliu', 'ali.aliu@uni.edu'),
('Prof. Dr. Maria Marku', 'maria.marku@uni.edu'),
('Prof. Dr. Sokol Sokoli', 'sokol.sokoli@uni.edu'),
('Prof. Dr. Anisa Hoxha', 'anisa.hoxha@uni.edu'),
('Prof. Dr. Fatmir Gjoka', 'fatmir.gjoka@uni.edu');

INSERT INTO groups (name) VALUES 
('Grupi A'), ('Grupi B'), ('Grupi C'), ('Grupi D'), ('Master Grupi');

INSERT INTO rooms (name, capacity) VALUES 
('A101', 30), ('A102', 25), ('B201', 40), ('B202', 35),
('Lab 1', 20), ('Lab 2', 15), ('Auditor 1', 100), ('Auditor 2', 80);

INSERT INTO semesters (name, start_date, end_date) VALUES 
('Semestri Viti 2024-2025', '2024-09-15', '2025-02-15'),
('Semestri Viti 2025-2026', '2025-03-01', '2025-07-31');

-- 2) Lidhjet
INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'admin@uni.edu' AND r.name = 'admin';

INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'ali.aliu@uni.edu' AND r.name = 'professor';

INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'maria.marku@uni.edu' AND r.name = 'professor';

INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'student1@uni.edu' AND r.name = 'student';

INSERT INTO userroles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'student2@uni.edu' AND r.name = 'student';

INSERT INTO group_courses (group_id, course_id) 
SELECT g.id, c.id FROM groups g, courses c 
WHERE g.name = 'Grupi A' AND c.name IN ('Matematikë 1', 'Programim', 'Bazat e Databazave', 'Algjebër Lineare');

INSERT INTO group_courses (group_id, course_id) 
SELECT g.id, c.id FROM groups g, courses c 
WHERE g.name = 'Grupi B' AND c.name IN ('Fizikë', 'Kimî', 'Rrjetat Kompjuterike', 'Statistikë');

INSERT INTO sessions (course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type) 
SELECT c.id, g.id, r.id, p.id, s.id, 1, '08:00', '10:00', 'all'
FROM courses c, groups g, rooms r, professors p, semesters s
WHERE c.name = 'Matematikë 1' AND g.name = 'Grupi A' AND r.name = 'A101' 
  AND p.name = 'Prof. Dr. Ali Aliu' AND s.name = 'Semestri Viti 2024-2025';

INSERT INTO sessions (course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type) 
SELECT c.id, g.id, r.id, p.id, s.id, 1, '10:00', '12:00', 'all'
FROM courses c, groups g, rooms r, professors p, semesters s
WHERE c.name = 'Programim' AND g.name = 'Grupi A' AND r.name = 'Lab 1' 
  AND p.name = 'Prof. Dr. Maria Marku' AND s.name = 'Semestri Viti 2024-2025';

-- 3) Kontrolli
SELECT 'roles' as table, COUNT(*) as count FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'professors', COUNT(*) FROM professors
UNION ALL SELECT 'groups', COUNT(*) FROM groups
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'semesters', COUNT(*) FROM semesters
UNION ALL SELECT 'userroles', COUNT(*) FROM userroles
UNION ALL SELECT 'group_courses', COUNT(*) FROM group_courses
UNION ALL SELECT 'sessions', COUNT(*) FROM sessions;
