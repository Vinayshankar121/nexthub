import { RequestHandler } from "express";
import { db } from "../db";

export const getQuestions: RequestHandler = async (req, res) => {
  try {
    const { examId, subjectId, type, year } = req.query;

    const filters = {
      examId: examId as string | undefined,
      subjectId: subjectId as string | undefined,
      type: type as string | undefined,
      year: year ? parseInt(year as string) : undefined,
    };

    const questions = await db.getQuestions(filters);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

export const getQuestionsForExamAndSubject: RequestHandler = async (req, res) => {
  try {
    const { examId, subjectId } = req.params;
    const { type, year } = req.query;

    if (!(await db.getExamById(examId))) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const filters = {
      examId,
      subjectId,
      type: type as string | undefined,
      year: year ? parseInt(year as string) : undefined,
    };

    const questions = await db.getQuestions(filters);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

export const getQuestionById: RequestHandler = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await db.getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
};

export const createQuestion: RequestHandler = async (req, res) => {
  try {
    const { examId, subjectId } = req.params;
    const {
      questionType,
      questionText,
      options,
      correctAnswer,
      yearAsked,
      difficulty,
      explanation,
    } = req.body;

    if (!(await db.getExamById(examId))) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (!questionText || typeof questionText !== "string") {
      return res.status(400).json({ error: "Invalid question text" });
    }

    const question = await db.addQuestion({
      examId,
      subjectId,
      questionType,
      questionText,
      options,
      correctAnswer,
      yearAsked: yearAsked || new Date().getFullYear(),
      difficulty: difficulty || "Medium",
      explanation,
    });

    res.status(201).json(question);
  } catch (error: any) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question", details: error.message });
  }
};

export const updateQuestion: RequestHandler = async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      questionType,
      questionText,
      options,
      correctAnswer,
      yearAsked,
      difficulty,
      explanation,
    } = req.body;

    const question = await db.updateQuestion(questionId, {
      questionType,
      questionText,
      options,
      correctAnswer,
      yearAsked,
      difficulty,
      explanation,
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" });
  }
};

export const deleteQuestion: RequestHandler = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!(await db.deleteQuestion(questionId))) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question" });
  }
};
