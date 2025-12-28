import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
} from "./routes/exams";
import {
  getSubjectsForExam,
  createSubject,
  deleteSubject,
} from "./routes/subjects";
import {
  getQuestions,
  getQuestionsForExamAndSubject,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "./routes/questions";
import {
  getTests,
  getTestById,
  createTest,
  deleteTest,
  submitTest,
  getTestAttempts,
} from "./routes/tests";
import { login, register } from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  app.get("/api/demo", handleDemo);

  // Exam routes
  app.get("/api/exams", getExams);
  app.get("/api/exams/:examId", getExam);
  app.post("/api/exams", createExam);
  app.put("/api/exams/:examId", updateExam);
  app.delete("/api/exams/:examId", deleteExam);

  // Subject routes
  app.get("/api/exams/:examId/subjects", getSubjectsForExam);
  app.post("/api/exams/:examId/subjects", createSubject);
  app.delete("/api/subjects/:subjectId", deleteSubject);

  // Question routes
  app.get("/api/questions", getQuestions);
  app.get(
    "/api/exams/:examId/subjects/:subjectId/questions",
    getQuestionsForExamAndSubject,
  );
  app.get("/api/questions/:questionId", getQuestionById);
  app.post("/api/exams/:examId/subjects/:subjectId/questions", createQuestion);
  app.put("/api/questions/:questionId", updateQuestion);
  app.delete("/api/questions/:questionId", deleteQuestion);

  // Test routes
  app.get("/api/tests", getTests);
  app.get("/api/tests/:testId", getTestById);
  app.post("/api/tests", createTest);
  app.post("/api/tests/:testId/submit", submitTest);
  app.delete("/api/tests/:testId", deleteTest);
  app.get("/api/tests/attempts/:userId", getTestAttempts);

  return app;
}
