import { useExam } from "@/context/ExamContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, ArrowLeft, Clock, HelpCircle } from "lucide-react";
import { useParams, Link } from "react-router-dom";

export default function ExamSelection() {
  const { exams, tests } = useExam();
  const { examId } = useParams();

  // If examId is present, show Tests for that exam
  if (examId) {
    const selectedExam = exams.find((e) => e.id === examId);
    const availableTests = tests.filter((t) => t.examId === examId);

    if (!selectedExam) {
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-900">Exam not found.</p>
            <Link to="/student/tests">
              <Button variant="link" className="mt-2 text-red-700 p-0">
                &larr; Back to Exams
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div>
          <Link to="/student/tests" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Exams
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {selectedExam.examName} - Available Tests
          </h2>
          <p className="text-slate-600">Select a test to begin practice.</p>
        </div>

        {availableTests.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-900">
              No tests available for this exam yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Test #{test.id.slice(0, 4)}
                  </CardTitle>
                  <CardDescription>
                    {test.mode === "random" ? "Randomized Test" : "Standard Test"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <HelpCircle size={16} />
                        <span>{test.numberOfQuestions} Qs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Placeholder duration logic if needed */}
                        <Clock size={16} />
                        <span>{test.numberOfQuestions * 2} mins</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 mb-2">
                      Type: {test.questionType === "Both" ? "Mixed (MCQ + Integer)" : test.questionType}
                    </div>

                    <Link to={`/student/take-test/${test.id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Start Test <ChevronRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Otherwise, show list of Exams
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Select an Exam
        </h2>
        <p className="text-slate-600">Choose an exam to practice</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            No exams available yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="hover:shadow-lg transition cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <CardTitle>{exam.examName}</CardTitle>
                      <CardDescription>{exam.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    This exam contains multiple subjects and question types.
                  </p>
                  <Link to={`/student/tests/${exam.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Tests <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
