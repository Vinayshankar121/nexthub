import { useState, useEffect } from "react";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function TestBuilder() {
  const { exams, questions, addTest, deleteTest, tests } = useExam();
  const [open, setOpen] = useState(false);
  const [subjectsForExam, setSubjectsForExam] = useState<any[]>([]); // state for subjects

  const [formData, setFormData] = useState({
    examId: "",
    subjectId: "",
    includeAllSubjects: false,
    questionType: "MCQ" as "MCQ" | "Integer" | "Both",
    numberOfQuestions: "10",
    mode: "random" as "manual" | "random",
    marksForCorrect: "1",
    marksForIncorrect: "0",
  });

  // Fetch subjects when exam changes
  useEffect(() => {
    if (formData.examId) {
      fetch(`/api/exams/${formData.examId}/subjects`)
        .then((res) => res.json())
        .then((data) => setSubjectsForExam(data))
        .catch((err) => console.error(err));
    } else {
      setSubjectsForExam([]);
    }
  }, [formData.examId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.examId && formData.subjectId && formData.numberOfQuestions) {
      const numQuestions = parseInt(formData.numberOfQuestions);
      const availableQuestions = questions.filter((q) => {
        if (formData.examId && q.examId !== formData.examId) return false;
        if (
          formData.subjectId &&
          !formData.includeAllSubjects &&
          q.subjectId !== formData.subjectId
        )
          return false;
        if (
          formData.questionType !== "Both" &&
          q.questionType !== formData.questionType
        )
          return false;
        return true;
      });

      const selectedQuestionIds =
        formData.mode === "random"
          ? availableQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, numQuestions)
            .map((q) => q.id)
          : availableQuestions.slice(0, numQuestions).map((q) => q.id);

      addTest({
        id: Date.now().toString(),
        examId: formData.examId,
        subjectId: formData.subjectId,
        questionType: formData.questionType as any,
        numberOfQuestions: numQuestions,
        mode: formData.mode,
        questionIds: selectedQuestionIds,
        marksForCorrect: parseInt(formData.marksForCorrect || "1"),
        marksForIncorrect: parseInt(formData.marksForIncorrect || "0"),
      });

      setFormData({
        examId: "",
        subjectId: "",
        includeAllSubjects: false,
        questionType: "MCQ",
        numberOfQuestions: "10",
        mode: "random",
        marksForCorrect: "1",
        marksForIncorrect: "0",
      });
      setOpen(false);
    }
  };

  const selectedExam = exams.find((e) => e.id === formData.examId);
  const availableQuestions = questions.filter((q) => {
    if (formData.examId && q.examId !== formData.examId) return false;
    if (
      formData.subjectId &&
      !formData.includeAllSubjects &&
      q.subjectId !== formData.subjectId
    )
      return false;
    if (
      formData.questionType !== "Both" &&
      q.questionType !== formData.questionType
    )
      return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Test Builder</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Create New Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Test</DialogTitle>
              <DialogDescription>
                Build a custom test by selecting exam, subject, and questions
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Exam Selection */}
              <div className="space-y-2">
                <Label htmlFor="exam">Select Exam *</Label>
                <Select
                  value={formData.examId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, examId: v, subjectId: "" })
                  }
                >
                  <SelectTrigger id="exam">
                    <SelectValue placeholder="Select an exam" />
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



              {/* Subject Selection */}
              <div className="space-y-2">
                <Label htmlFor="subject">Select Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, subjectId: v })
                  }
                  disabled={!formData.examId}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* We need to fetch subjects. Let's assume we have them in subjectsForExam */}
                    {subjectsForExam.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAll"
                  checked={formData.includeAllSubjects}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      includeAllSubjects: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="includeAll"
                  className="text-sm font-normal cursor-pointer text-slate-600"
                >
                  Include questions from all subjects in this exam (Subject selection required for primary category)
                </Label>
              </div>

              {/* Question Type */}
              <div className="space-y-3">
                <Label>Question Type *</Label>
                <RadioGroup
                  value={formData.questionType}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, questionType: v })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MCQ" id="mcq" />
                    <Label htmlFor="mcq" className="font-normal cursor-pointer">
                      MCQ Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Integer" id="integer" />
                    <Label
                      htmlFor="integer"
                      className="font-normal cursor-pointer"
                    >
                      Short Answer / Integer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Both" id="both" />
                    <Label
                      htmlFor="both"
                      className="font-normal cursor-pointer"
                    >
                      All Types
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="numQuestions">Number of Questions *</Label>
                  <span className="text-sm text-slate-500">
                    {availableQuestions.length} available
                  </span>
                </div>
                <Input
                  id="numQuestions"
                  type="number"
                  min="1"
                  max={availableQuestions.length}
                  placeholder="e.g., 50"
                  value={formData.numberOfQuestions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfQuestions: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Marking Scheme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marksCorrect">Marks for Correct (+)</Label>
                  <Input
                    id="marksCorrect"
                    type="number"
                    value={formData.marksForCorrect}
                    onChange={(e) =>
                      setFormData({ ...formData, marksForCorrect: e.target.value })
                    }
                    placeholder="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marksIncorrect">Marks for Wrong (-)</Label>
                  <Input
                    id="marksIncorrect"
                    type="number"
                    value={formData.marksForIncorrect}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marksForIncorrect: e.target.value,
                      })
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Selection Mode */}
              <div className="space-y-3">
                <Label>Selection Mode *</Label>
                <RadioGroup
                  value={formData.mode}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, mode: v })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random" id="random" />
                    <Label
                      htmlFor="random"
                      className="font-normal cursor-pointer"
                    >
                      Random Selection
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label
                      htmlFor="manual"
                      className="font-normal cursor-pointer"
                    >
                      Manual Selection (Coming Soon)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Create Test
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tests List */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-500"
                >
                  No tests created yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((test) => {
                const exam = exams.find((e) => e.id === test.examId);
                return (
                  <TableRow key={test.id}>
                    <TableCell className="font-mono text-sm">
                      {test.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{exam?.examName || "Unknown"}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {test.questionType === "Both"
                          ? "Mixed"
                          : test.questionType}
                      </span>
                    </TableCell>
                    <TableCell>{test.numberOfQuestions}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${test.mode === "random"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {test.mode.charAt(0).toUpperCase() + test.mode.slice(1)}
                      </span>
                    </TableCell>
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
                        onClick={() => deleteTest(test.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
