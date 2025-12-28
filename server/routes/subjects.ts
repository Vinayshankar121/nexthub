import { RequestHandler } from "express";
import { db } from "../db";

export const getSubjectsForExam: RequestHandler = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!(await db.getExamById(examId))) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const subjects = await db.getSubjectsByExamId(examId);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

export const createSubject: RequestHandler = async (req, res) => {
  try {
    const { examId } = req.params;
    const { subjectName } = req.body;

    if (!(await db.getExamById(examId))) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (!subjectName || typeof subjectName !== "string") {
      return res.status(400).json({ error: "Invalid subject name" });
    }

    const subject = await db.addSubject({ examId, subjectName });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subject" });
  }
};

export const deleteSubject: RequestHandler = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!(await db.deleteSubject(subjectId))) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subject" });
  }
};
