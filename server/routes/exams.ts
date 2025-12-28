import { RequestHandler } from "express";
import { db } from "../db";
import { ExamResponse } from "@shared/api";

export const getExams: RequestHandler = async (req, res) => {
  try {
    const exams = await db.getExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

export const getExam: RequestHandler = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await db.getExamById(examId);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exam" });
  }
};

export const createExam: RequestHandler = async (req, res) => {
  try {
    const { examName, description } = req.body;

    if (!examName || typeof examName !== "string") {
      return res.status(400).json({ error: "Invalid exam name" });
    }

    const exam = await db.addExam({ examName, description });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create exam" });
  }
};

export const updateExam: RequestHandler = async (req, res) => {
  try {
    const { examId } = req.params;
    const { examName, description } = req.body;

    const exam = await db.updateExam(examId, { examName, description });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to update exam" });
  }
};

export const deleteExam: RequestHandler = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!(await db.deleteExam(examId))) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete exam" });
  }
};
