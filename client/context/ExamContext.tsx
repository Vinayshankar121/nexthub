import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface Question {
  id: string;
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

export interface Subject {
  id: string;
  examId: string;
  subjectName: string;
  questions?: Question[];
}

export interface Exam {
  id: string;
  examName: string;
  description?: string;
  subjects?: Subject[];
}

export interface Test {
  id: string;
  examId: string;
  subjectId: string;
  questionType: "MCQ" | "Integer" | "Both";
  numberOfQuestions: number;
  mode: "manual" | "random";
  questionIds: string[];
  marksForCorrect: number;
  marksForIncorrect: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, string>;
  submittedAt?: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  finalScore: number;
  percentageScore: number;
}

export interface ExamContextType {
  exams: Exam[];
  questions: Question[];
  tests: Test[];
  testAttempts: TestAttempt[];
  addExam: (exam: Exam) => void;
  updateExam: (examId: string, exam: Exam) => void;
  deleteExam: (examId: string) => void;
  addSubject: (examId: string, subject: Subject) => void;
  updateSubject: (subjectId: string, subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  addTest: (test: Test) => void;
  deleteTest: (testId: string) => void;
  submitTest: (attempt: TestAttempt) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);



import { useAuth } from "@/context/AuthContext";

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch Exams
  const { data: exams = [], isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await fetch("/api/exams");
      if (!res.ok) throw new Error("Failed to fetch exams");
      return res.json();
    },
  });

  // Fetch Questions (Global fetch for now, can be optimized)
  const { data: questions = [] } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const res = await fetch("/api/questions");
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
  });

  const { data: tests = [] } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const res = await fetch("/api/tests");
      if (!res.ok) throw new Error("Failed to fetch tests");
      return res.json();
    },
  });

  const { data: testAttempts = [] } = useQuery({
    queryKey: ["testAttempts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/tests/attempts/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch test attempts");
      return res.json();
    },
    enabled: !!user?.id,
  });


  // Mutations
  const createExamMutation = useMutation({
    mutationFn: async (newExam: Exam) => {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });
      if (!res.ok) throw new Error("Failed to create exam");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({ title: "Success", description: "Exam created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateExamMutation = useMutation({
    mutationFn: async ({ id, exam }: { id: string; exam: Exam }) => {
      const res = await fetch(`/api/exams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exam),
      });
      if (!res.ok) throw new Error("Failed to update exam");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({ title: "Success", description: "Exam updated successfully" });
    },
  });

  const deleteExamMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete exam");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({ title: "Success", description: "Exam deleted successfully" });
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: async ({ examId, subject }: { examId: string; subject: Subject }) => {
      const res = await fetch(`/api/exams/${examId}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subject),
      });
      if (!res.ok) throw new Error("Failed to create subject");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries that might fetch subjects (if we had a specific subjects query)
      // For now, refreshing exams might suffice if exams included subjects, but here we likely need a separate subject fetch or invalidation logic if subjects are nested
      // Assuming we might fetch subjects on demand
      toast({ title: "Success", description: "Subject created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete subject");
    },
    onSuccess: () => {
      // Invalidate queries. We don't have a specific global subject query, but we can invalidate "subjects" generally if we use that key pattern
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({ title: "Success", description: "Subject deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });



  const createQuestionMutation = useMutation({
    mutationFn: async (question: Question) => {
      const res = await fetch(`/api/exams/${question.examId}/subjects/${question.subjectId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
      if (!res.ok) throw new Error("Failed to create question");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Success", description: "Question added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const createTestMutation = useMutation({
    mutationFn: async (test: Test) => {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create test");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      toast({ title: "Success", description: "Test created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });


  const submitTestMutation = useMutation({
    mutationFn: async (attempt: TestAttempt) => {
      const res = await fetch(`/api/tests/${attempt.testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: attempt.userId, // make sure AuthContext provided this or attempts has it
          answers: attempt.answers,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit test");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testAttempts"] });
      toast({ title: "Success", description: "Test submitted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  /* Existing mutations */

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, question }: { id: string; question: Question }) => {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
      if (!res.ok) throw new Error("Failed to update question");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Success", description: "Question updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete question");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast({ title: "Success", description: "Question deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteTestMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete test");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      toast({ title: "Success", description: "Test deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Wrappers
  const addExam = (exam: Exam) => createExamMutation.mutate(exam);
  const updateExam = (id: string, exam: Exam) => updateExamMutation.mutate({ id, exam });
  const deleteExam = (id: string) => deleteExamMutation.mutate(id);

  const addSubject = (examId: string, subject: Subject) => createSubjectMutation.mutate({ examId, subject });
  const updateSubject = (id: string, subject: Subject) => console.log("Update subject not implemented yet");
  const deleteSubject = (id: string) => deleteSubjectMutation.mutate(id);

  const addQuestion = (question: Question) => createQuestionMutation.mutate(question);
  const updateQuestion = (id: string, question: Question) => updateQuestionMutation.mutate({ id, question });
  const deleteQuestion = (id: string) => deleteQuestionMutation.mutate(id);

  const addTest = (test: Test) => createTestMutation.mutate(test);
  const deleteTest = (id: string) => deleteTestMutation.mutate(id);
  const submitTest = (attempt: TestAttempt) => submitTestMutation.mutate(attempt);

  return (
    <ExamContext.Provider
      value={{
        exams,
        questions,
        tests,
        testAttempts,
        addExam,
        updateExam,
        deleteExam,
        addSubject,
        updateSubject,
        deleteSubject,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addTest,
        deleteTest,
        submitTest,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within ExamProvider");
  }
  return context;
};
