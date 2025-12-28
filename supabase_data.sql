-- 1. Insert Users
INSERT INTO users (id, email, password, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'admin123', 'Admin User', 'ADMIN'),
('22222222-2222-2222-2222-222222222222', 'student@example.com', 'student123', 'Student User', 'STUDENT');

-- 2. Insert Exams
INSERT INTO exams (id, exam_name, description) VALUES
('33333333-3333-3333-3333-333333333333', 'JEE Mains', 'Joint Entrance Examination for Engineering'),
('44444444-4444-4444-4444-444444444444', 'NEET', 'National Eligibility cum Entrance Test for Medical');

-- 3. Insert Subjects
-- Physics for JEE Mains (Linked to 3333...)
INSERT INTO subjects (id, exam_id, subject_name) VALUES
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Physics'),
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Chemistry'),
('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'Mathematics');

-- Biology for NEET (Linked to 4444...)
INSERT INTO subjects (id, exam_id, subject_name) VALUES
('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Biology'),
('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'Physics');

-- 4. Insert Questions
-- Physics Question (Linked to Exam 3333... and Subject 5555...)
INSERT INTO questions (id, exam_id, subject_id, question_type, question_text, options, correct_answer, year_asked, difficulty, explanation) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'MCQ', 'What is the SI unit of Force?', '{"A": "Newton", "B": "Joule", "C": "Watt", "D": "Pascal"}', 'A', 2023, 'Easy', 'Force is measured in Newtons (N).');

-- Chemistry Question (Linked to Exam 3333... and Subject 6666...)
INSERT INTO questions (id, exam_id, subject_id, question_type, question_text, options, correct_answer, year_asked, difficulty, explanation) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'MCQ', 'Which element has the atomic number 1?', '{"A": "Helium", "B": "Hydrogen", "C": "Lithium", "D": "Carbon"}', 'B', 2022, 'Easy', 'Hydrogen is the first element.');

-- Biology Question (Linked to Exam 4444... and Subject 8888...)
INSERT INTO questions (id, exam_id, subject_id, question_type, question_text, options, correct_answer, year_asked, difficulty, explanation) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'MCQ', 'Which organelle is known as the powerhouse of the cell?', '{"A": "Nucleus", "B": "Ribosome", "C": "Mitochondria", "D": "Golgi Body"}', 'C', 2023, 'Easy', 'Mitochondria generate most of the chemical energy needed to power the cell''s biochemical reactions.');
