// Auth types
export interface DemoResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: "ADMIN" | "STUDENT";
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  role: "ADMIN" | "STUDENT";
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "STUDENT";
  };
}

// Exam types
export interface ExamRequest {
  examName: string;
  description?: string;
}

export interface ExamResponse {
  id: string;
  examName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Subject types
export interface SubjectRequest {
  examId: string;
  subjectName: string;
}

export interface SubjectResponse {
  id: string;
  examId: string;
  subjectName: string;
  createdAt: string;
  updatedAt: string;
}

// Question types
export interface QuestionRequest {
  examId: string;
  subjectId: string;
  questionType: "MCQ" | "Integer";
  questionText: string;
  options?: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  yearAsked: number;
  difficulty: "Easy" | "Medium" | "Hard";
  explanation?: string;
}

export interface QuestionResponse extends QuestionRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Test types
export interface TestRequest {
  examId: string;
  subjectId: string;
  questionType: "MCQ" | "Integer";
  numberOfQuestions: number;
  mode: "manual" | "random";
  questionIds?: string[];
  marksForCorrect?: number;
  marksForIncorrect?: number;
}

export interface TestResponse {
  id: string;
  examId: string;
  subjectId: string;
  questionType: "MCQ" | "Integer";
  numberOfQuestions: number;
  mode: "manual" | "random";
  questionIds: string[];
  marksForCorrect: number;
  marksForIncorrect: number;
  createdAt: string;
  updatedAt: string;
}

// Test Attempt types
export interface TestAttemptRequest {
  testId: string;
  userId: string;
  answers: Record<string, string>;
}

export interface TestAttemptResponse {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, string>;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  finalScore: number;
  percentageScore: number;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Error response type
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
