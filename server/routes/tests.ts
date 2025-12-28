import { RequestHandler } from "express";
import { db } from "../db";

export const getTests: RequestHandler = async (req, res) => {
  try {
    const tests = await db.getTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
};

export const getTestById: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await db.getTestById(testId);

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch test" });
  }
};

export const createTest: RequestHandler = async (req, res) => {
  try {
    const {
      examId,
      subjectId,
      questionType,
      numberOfQuestions,
      mode,
      questionIds,
      marksForCorrect = 1, // Default to 1
      marksForIncorrect = 0, // Default to 0
    } = req.body;

    if (!(await db.getExamById(examId))) {
      return res.status(404).json({ error: "Exam not found" });
    }

    if (!questionType || !numberOfQuestions || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let selectedQuestionIds = questionIds || [];

    // If no questions provided and mode is random, select random questions
    if (!questionIds && mode === "random") {
      const questions = await db.getQuestions({ examId, subjectId });
      const shuffled = questions.sort(() => Math.random() - 0.5);
      selectedQuestionIds = shuffled
        .slice(0, numberOfQuestions)
        .map((q) => q.id);
    }

    const test = await db.addTest({
      examId,
      subjectId,
      questionType,
      numberOfQuestions,
      mode,
      questionIds: selectedQuestionIds,
      marksForCorrect,
      marksForIncorrect,
    });

    res.status(201).json(test);
  } catch (error: any) {
    console.error("Error creating test:", error);
    res.status(500).json({ error: "Failed to create test", details: error.message });
  }
};

export const deleteTest: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!(await db.deleteTest(testId))) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete test" });
  }
};

export const submitTest: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;
    const { userId, answers } = req.body;

    const test = await db.getTestById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    // Calculate scores
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unattemptedQuestions = 0;

    // We must fetch questions sequentially or concurrently
    // Since questionIds is an array, let's fetch them all or one by one
    // Ideally we should use a "getQuestionsByIds" method, but for now loop
    for (const qId of test.questionIds) {
      const question = await db.getQuestionById(qId);
      if (!question) continue;

      const userAnswer = answers[qId];
      if (!userAnswer) {
        unattemptedQuestions++;
      } else {
        const normalizedUser = String(userAnswer).trim().toLowerCase();
        const normalizedCorrect = String(question.correctAnswer).trim().toLowerCase();

        if (normalizedUser === normalizedCorrect) {
          correctAnswers++;
        } else {
          console.log(`Mismatch Q:${qId} - User: "${userAnswer}" vs Correct: "${question.correctAnswer}"`);
          incorrectAnswers++;
        }
      }
    }

    const finalScore = correctAnswers * (test.marksForCorrect ?? 4) + incorrectAnswers * (test.marksForIncorrect ?? -1);
    const percentageScore = (correctAnswers / test.questionIds.length) * 100;

    const attempt = await db.addTestAttempt({
      testId,
      userId,
      answers,
      totalQuestions: test.questionIds.length,
      attemptedQuestions: test.questionIds.length - unattemptedQuestions,
      correctAnswers,
      incorrectAnswers,
      unattemptedQuestions,
      finalScore,
      percentageScore,
      submittedAt: new Date().toISOString(),
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit test" });
  }
};

export const getTestAttempts: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const attempts = await db.getTestAttemptsByUserId(userId);
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch test attempts" });
  }
};
