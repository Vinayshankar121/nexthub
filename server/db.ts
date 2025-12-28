
import { createClient } from "@supabase/supabase-js";
import {
  ExamResponse,
  SubjectResponse,
  QuestionResponse,
  TestResponse,
  TestAttemptResponse,
} from "@shared/api";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // OR SERVICE_KEY if available for backend

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces for DB rows (snake_case)
interface UserRow {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: "ADMIN" | "STUDENT";
  created_at: string;
}

interface ExamRow {
  id: string;
  exam_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface SubjectRow {
  id: string;
  exam_id: string;
  subject_name: string;
  created_at: string;
  updated_at: string;
}

interface QuestionRow {
  id: string;
  exam_id: string;
  subject_id: string;
  question_type: "MCQ" | "Integer";
  question_text: string;
  options?: any;
  correct_answer: string;
  year_asked: number;
  difficulty: "Easy" | "Medium" | "Hard";
  explanation?: string;
  created_at: string;
  updated_at: string;
}

interface TestRow {
  id: string;
  exam_id: string;
  subject_id: string;
  question_type: string;
  number_of_questions: number;
  mode: "manual" | "random";
  question_ids: string[];
  marks_for_correct: number;
  marks_for_incorrect: number;
  created_at: string;
  updated_at: string;
}

interface TestAttemptRow {
  id: string;
  test_id: string;
  user_id: string;
  answers: any;
  total_questions: number;
  attempted_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unattempted_questions: number;
  final_score: number;
  percentage_score: number;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export const db = {
  // Users
  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 is no rows
    if (!data) return null;
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      fullName: data.full_name,
      role: data.role,
    };
  },

  addUser: async (user: { email: string; password: string; fullName: string; role: string }) => {
    const { data, error } = await supabase
      .from("users")
      .insert({
        email: user.email,
        password: user.password,
        full_name: user.fullName,
        role: user.role,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
    };
  },

  // Exams
  getExams: async (): Promise<ExamResponse[]> => {
    const { data, error } = await supabase.from("exams").select("*");
    if (error) throw error;
    return data.map((e: ExamRow) => ({
      id: e.id,
      examName: e.exam_name,
      description: e.description,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
  },

  getExamById: async (id: string): Promise<ExamResponse | null> => {
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;
    return {
      id: data.id,
      examName: data.exam_name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  addExam: async (exam: { examName: string; description?: string }) => {
    const { data, error } = await supabase
      .from("exams")
      .insert({ exam_name: exam.examName, description: exam.description })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      examName: data.exam_name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  updateExam: async (id: string, exam: { examName?: string; description?: string }) => {
    const updates: any = {};
    if (exam.examName) updates.exam_name = exam.examName;
    if (exam.description !== undefined) updates.description = exam.description;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("exams")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      examName: data.exam_name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  deleteExam: async (id: string) => {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) return false;
    return true;
  },

  // Subjects
  getSubjectsByExamId: async (examId: string): Promise<SubjectResponse[]> => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("exam_id", examId);
    if (error) throw error;
    return data.map((s: SubjectRow) => ({
      id: s.id,
      examId: s.exam_id,
      subjectName: s.subject_name,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));
  },

  addSubject: async (subject: { examId: string; subjectName: string }) => {
    const { data, error } = await supabase
      .from("subjects")
      .insert({ exam_id: subject.examId, subject_name: subject.subjectName })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      examId: data.exam_id,
      subjectName: data.subject_name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  deleteSubject: async (id: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) return false;
    return true;
  },

  // Questions
  getQuestions: async (filters: {
    examId?: string;
    subjectId?: string;
    type?: string;
    year?: number;
  }): Promise<QuestionResponse[]> => {
    let query = supabase.from("questions").select("*");

    if (filters.examId) query = query.eq("exam_id", filters.examId);
    if (filters.subjectId) query = query.eq("subject_id", filters.subjectId);
    if (filters.type) query = query.eq("question_type", filters.type);
    if (filters.year) query = query.eq("year_asked", filters.year);

    const { data, error } = await query;
    if (error) throw error;

    return data.map((q: QuestionRow) => ({
      id: q.id,
      examId: q.exam_id,
      subjectId: q.subject_id,
      questionType: q.question_type,
      questionText: q.question_text,
      options: q.options,
      correctAnswer: q.correct_answer,
      yearAsked: q.year_asked,
      difficulty: q.difficulty,
      explanation: q.explanation,
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    }));
  },

  getQuestionById: async (id: string): Promise<QuestionResponse | null> => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;
    return {
      id: data.id,
      examId: data.exam_id,
      subjectId: data.subject_id,
      questionType: data.question_type,
      questionText: data.question_text,
      options: data.options,
      correctAnswer: data.correct_answer,
      yearAsked: data.year_asked,
      difficulty: data.difficulty,
      explanation: data.explanation,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  addQuestion: async (question: any) => {
    const { data, error } = await supabase
      .from("questions")
      .insert({
        exam_id: question.examId,
        subject_id: question.subjectId,
        question_type: question.questionType,
        question_text: question.questionText,
        options: question.options,
        correct_answer: question.correctAnswer,
        year_asked: question.yearAsked,
        difficulty: question.difficulty,
        explanation: question.explanation,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      examId: data.exam_id,
      subjectId: data.subject_id,
      questionType: data.question_type,
      questionText: data.question_text,
      options: data.options,
      correctAnswer: data.correct_answer,
      yearAsked: data.year_asked,
      difficulty: data.difficulty,
      explanation: data.explanation,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  updateQuestion: async (id: string, question: any) => {
    const updates: any = {};
    if (question.questionType) updates.question_type = question.questionType;
    if (question.questionText) updates.question_text = question.questionText;
    if (question.options) updates.options = question.options;
    if (question.correctAnswer) updates.correct_answer = question.correctAnswer;
    if (question.yearAsked) updates.year_asked = question.yearAsked;
    if (question.difficulty) updates.difficulty = question.difficulty;
    if (question.explanation) updates.explanation = question.explanation;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("questions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      examId: data.exam_id,
      subjectId: data.subject_id,
      questionType: data.question_type,
      questionText: data.question_text,
      options: data.options,
      correctAnswer: data.correct_answer,
      yearAsked: data.year_asked,
      difficulty: data.difficulty,
      explanation: data.explanation,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  deleteQuestion: async (id: string) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) return false;
    return true;
  },

  // Tests
  getTests: async (): Promise<TestResponse[]> => {
    const { data, error } = await supabase.from("tests").select("*");
    if (error) throw error;
    return data.map((t: TestRow) => ({
      id: t.id,
      examId: t.exam_id,
      subjectId: t.subject_id,
      questionType: t.question_type as any,
      numberOfQuestions: t.number_of_questions,
      mode: t.mode,
      questionIds: t.question_ids,
      marksForCorrect: t.marks_for_correct,
      marksForIncorrect: t.marks_for_incorrect,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
  },

  getTestById: async (id: string): Promise<TestResponse | null> => {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;
    return {
      id: data.id,
      examId: data.exam_id,
      subjectId: data.subject_id,
      questionType: data.question_type as any,
      numberOfQuestions: data.number_of_questions,
      mode: data.mode,
      questionIds: data.question_ids,
      marksForCorrect: data.marks_for_correct,
      marksForIncorrect: data.marks_for_incorrect,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  addTest: async (test: any) => {
    const { data, error } = await supabase
      .from("tests")
      .insert({
        exam_id: test.examId,
        subject_id: test.subjectId,
        question_type: test.questionType,
        number_of_questions: test.numberOfQuestions,
        mode: test.mode,
        question_ids: test.questionIds,
        marks_for_correct: test.marksForCorrect,
        marks_for_incorrect: test.marksForIncorrect,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      examId: data.exam_id,
      subjectId: data.subject_id,
      questionType: data.question_type,
      numberOfQuestions: data.number_of_questions,
      mode: data.mode,
      questionIds: data.question_ids,
      marksForCorrect: data.marks_for_correct,
      marksForIncorrect: data.marks_for_incorrect,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  deleteTest: async (id: string) => {
    const { error } = await supabase.from("tests").delete().eq("id", id);
    if (error) return false;
    return true;
  },

  addTestAttempt: async (attempt: any) => {
    const { data, error } = await supabase
      .from("test_attempts")
      .insert({
        test_id: attempt.testId,
        user_id: attempt.userId,
        answers: attempt.answers,
        total_questions: attempt.totalQuestions,
        attempted_questions: attempt.attemptedQuestions,
        correct_answers: attempt.correctAnswers,
        incorrect_answers: attempt.incorrectAnswers,
        unattempted_questions: attempt.unattemptedQuestions,
        final_score: attempt.finalScore,
        percentage_score: attempt.percentageScore,
        submitted_at: attempt.submittedAt,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      testId: data.test_id,
      userId: data.user_id,
      answers: data.answers,
      totalQuestions: data.total_questions,
      attemptedQuestions: data.attempted_questions,
      correctAnswers: data.correct_answers,
      incorrectAnswers: data.incorrect_answers,
      unattemptedQuestions: data.unattempted_questions,
      finalScore: data.final_score,
      percentageScore: data.percentage_score,
      submittedAt: data.submitted_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  getTestAttemptsByUserId: async (userId: string): Promise<TestAttemptResponse[]> => {
    const { data, error } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return data.map((a: TestAttemptRow) => ({
      id: a.id,
      testId: a.test_id,
      userId: a.user_id,
      answers: a.answers,
      totalQuestions: a.total_questions,
      attemptedQuestions: a.attempted_questions,
      correctAnswers: a.correct_answers,
      incorrectAnswers: a.incorrect_answers,
      unattemptedQuestions: a.unattempted_questions,
      finalScore: a.final_score,
      percentageScore: a.percentage_score,
      submittedAt: a.submitted_at,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));
  },
};
