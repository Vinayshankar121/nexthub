import { useState, useEffect } from "react";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function QuestionBank() {
  const { exams, questions, addQuestion, deleteQuestion } = useExam();
  const [open, setOpen] = useState(false);
  const [filterExam, setFilterExam] = useState<string>("");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [subjectsForExam, setSubjectsForExam] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    examId: "",
    subjectId: "",
    questionType: "MCQ" as "MCQ" | "Integer",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    yearAsked: new Date().getFullYear(),
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    explanation: "",
  });

  // Fetch subjects when exam is selected
  const { examId } = formData;
  useEffect(() => {
    if (examId) {
      fetch(`/api/exams/${examId}/subjects`)
        .then((res) => res.json())
        .then((data) => setSubjectsForExam(data))
        .catch((err) => console.error("Failed to fetch subjects:", err));
    } else {
      setSubjectsForExam([]);
    }
  }, [examId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.questionText.trim() && formData.examId && formData.subjectId) {
      addQuestion({
        id: Date.now().toString(),
        examId: formData.examId,
        subjectId: formData.subjectId,
        questionType: formData.questionType,
        questionText: formData.questionText,
        options:
          formData.questionType === "MCQ"
            ? {
              A: formData.optionA,
              B: formData.optionB,
              C: formData.optionC,
              D: formData.optionD,
            }
            : undefined,
        correctAnswer: formData.correctAnswer,
        yearAsked: formData.yearAsked,
        difficulty: formData.difficulty,
        explanation: formData.explanation,
      });
      setFormData({
        examId: "",
        subjectId: "",
        questionType: "MCQ",
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        yearAsked: new Date().getFullYear(),
        difficulty: "Medium",
        explanation: "",
      });
      setOpen(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterExam && q.examId !== filterExam) return false;
    if (filterSubject && q.subjectId !== filterSubject) return false;
    if (filterType && q.questionType !== filterType) return false;
    if (filterYear && q.yearAsked !== parseInt(filterYear)) return false;
    return true;
  });

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Question Bank</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              New Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Add a question to the question bank
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam">Exam *</Label>
                  <Select
                    value={formData.examId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, examId: v, subjectId: "" })
                    }
                  >
                    <SelectTrigger id="exam">
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.examName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subjectId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, subjectId: v })
                    }
                    disabled={!formData.examId}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* We need subjects for this exam. Since we don't have them in global context easily separated, 
                          we should ideally fetch them. For now, fetch from API on render or filter if context has them.
                          The current context doesn't expose subjects separately or grouped by exam well.
                          Let's add a temporary fetch or assume we need to update context.
                          
                          Wait, the USER's error was sending "english" (string) instead of UUID. 
                          The previous code was an Input field: 
                          <Input ... value={formData.subjectId} ... />
                          User typed "English".
                          We need to force them to select a valid Subject ID (UUID).
                          
                          I will use a local state to fetch subjects for the selected exam.
                      */}
                      {subjectsForExam.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.subjectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type *</Label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(v: any) =>
                      setFormData({ ...formData, questionType: v })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">MCQ</SelectItem>
                      <SelectItem value="Integer">Short Answer / Integer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(v: any) =>
                      setFormData({ ...formData, difficulty: v })
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year Asked *</Label>
                  <Select
                    value={formData.yearAsked.toString()}
                    onValueChange={(v) =>
                      setFormData({ ...formData, yearAsked: parseInt(v) })
                    }
                  >
                    <SelectTrigger id="year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question Text *</Label>
                <Textarea
                  id="question"
                  placeholder="Enter the question"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              {formData.questionType === "MCQ" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt} className="space-y-2">
                        <Label htmlFor={`opt${opt}`}>Option {opt}</Label>
                        <Input
                          id={`opt${opt}`}
                          placeholder={`Option ${opt}`}
                          value={
                            formData[`option${opt}` as keyof typeof formData]
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [`option${opt}`]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answer">Correct Answer *</Label>
                    <Select
                      value={formData.correctAnswer}
                      onValueChange={(v) =>
                        setFormData({ ...formData, correctAnswer: v })
                      }
                    >
                      <SelectTrigger id="answer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D"].map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.questionType === "Integer" && (
                <div className="space-y-2">
                  <Label htmlFor="intAnswer">Correct Answer (Short Answer / Int) *</Label>
                  <Input
                    id="intAnswer"
                    placeholder="e.g., 42 or Apple"
                    value={formData.correctAnswer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correctAnswer: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  placeholder="Provide explanation for the answer"
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Question
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-4 bg-white rounded-lg p-4">
        <div className="space-y-2">
          <Label>Filter by Exam</Label>
          <Select
            value={filterExam || "all"}
            onValueChange={(v) => setFilterExam(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Exams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {exams.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.examName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Filter by Type</Label>
          <Select
            value={filterType || "all"}
            onValueChange={(v) => setFilterType(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="Integer">Short Answer / Integer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Filter by Year</Label>
          <Select
            value={filterYear || "all"}
            onValueChange={(v) => setFilterYear(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button
            onClick={() => {
              setFilterExam("");
              setFilterType("");
              setFilterYear("");
            }}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500"
                >
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-xs truncate">
                    {q.questionText}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {q.questionType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${q.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : q.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {q.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>{q.yearAsked}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteQuestion(q.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
