-- Enable UUID extension for generating unique IDs
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password text not null, -- Storing hashed password (or plain for this demo)
  full_name text not null,
  role text check (role in ('ADMIN', 'STUDENT')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Exams Table
create table exams (
  id uuid default uuid_generate_v4() primary key,
  exam_name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Subjects Table
create table subjects (
  id uuid default uuid_generate_v4() primary key,
  exam_id uuid references exams(id) on delete cascade not null,
  subject_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Questions Table
create table questions (
  id uuid default uuid_generate_v4() primary key,
  exam_id uuid references exams(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  question_type text check (question_type in ('MCQ', 'Integer')) not null,
  question_text text not null,
  options jsonb, -- Stores { "A": "...", "B": "..." }
  correct_answer text not null,
  year_asked integer not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')) not null,
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Tests Table
create table tests (
  id uuid default uuid_generate_v4() primary key,
  exam_id uuid references exams(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  question_type text not null,
  number_of_questions integer not null,
  mode text check (mode in ('manual', 'random')) not null,
  question_ids text[] not null, -- Array of question UUIDs
  marks_for_correct integer not null default 4,
  marks_for_incorrect integer not null default -1,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Test Attempts Table
create table test_attempts (
  id uuid default uuid_generate_v4() primary key,
  test_id uuid references tests(id) on delete cascade, -- Optional: keep history if test deleted? For now cascade.
  user_id uuid references users(id) on delete cascade not null,
  answers jsonb not null, -- Stores { "questionId": "answer" }
  total_questions integer not null,
  attempted_questions integer not null,
  correct_answers integer not null,
  incorrect_answers integer not null,
  unattempted_questions integer not null,
  final_score numeric not null,
  percentage_score numeric not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies (Row Level Security) - Optional but recommended for Supabase
-- For this assignment, we will keep it simple and rely on backend logic, 
-- but enabling RLS is good practice.

alter table users enable row level security;
alter table exams enable row level security;
alter table subjects enable row level security;
alter table questions enable row level security;
alter table tests enable row level security;
alter table test_attempts enable row level security;

-- Allow public read access for now (to mimic current open behavior)
-- In a real app, you would restrict this.
create policy "Public read access" on exams for select using (true);
create policy "Public read access" on subjects for select using (true);
create policy "Public read access" on questions for select using (true);

-- Allow service_role (backend) full access. 
-- Note: When using supabase-js with SERVICE_KEY, RLS is bypassed automatically.
-- If using ANON_KEY, we need policies. Assuming backend uses SERVICE_KEY or we add policies.

-- Simple policies for development:
create policy "Enable all access for all users" on users for all using (true);
create policy "Enable all access for all users" on exams for all using (true);
create policy "Enable all access for all users" on subjects for all using (true);
create policy "Enable all access for all users" on questions for all using (true);
create policy "Enable all access for all users" on tests for all using (true);
create policy "Enable all access for all users" on test_attempts for all using (true);
