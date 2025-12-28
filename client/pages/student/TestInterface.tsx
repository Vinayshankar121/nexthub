import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatTime, calculateScore } from "@/lib/utils";
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TestInterface() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, tests, submitTest, testAttempts } = useExam();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(
    new Set(),
  );
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [submitted, setSubmitted] = useState(false);

  const currentTest = tests.find((t) => t.id === testId);
  const testQuestions = currentTest
    ? questions.filter((q) => currentTest.questionIds.includes(q.id))
    : [];

  if (!currentTest) {
    return <div className="p-6 text-center text-red-600">Test not found.</div>;
  }

  if (testQuestions.length === 0) {
    return <div className="p-6 text-center text-slate-600">Loading questions or no questions valid...</div>;
  }

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const currentQuestion = testQuestions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const toggleMarkForReview = () => {
    const newSet = new Set(markedForReview);
    if (newSet.has(currentQuestionIndex)) {
      newSet.delete(currentQuestionIndex);
    } else {
      newSet.add(currentQuestionIndex);
    }
    setMarkedForReview(newSet);
  };

  const handleClearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    testQuestions.forEach((q) => {
      if (!answers[q.id]) {
        unattemptedCount++;
      } else if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const attempt = {
      id: Date.now().toString(),
      testId: testId || "",
      userId: user?.id || "",
      answers,
      submittedAt: new Date().toISOString(),
      totalQuestions: testQuestions.length,
      attemptedQuestions: testQuestions.length - unattemptedCount,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattemptedQuestions: unattemptedCount,
      finalScore: calculateScore(correctCount, incorrectCount),
      percentageScore: (correctCount / testQuestions.length) * 100,
    };

    submitTest(attempt);
    setSubmitted(true);
    setTimeout(() => navigate("/student/results"), 2000);
  };

  const isAnswered = !!answers[currentQuestion.id];
  const isMarked = markedForReview.has(currentQuestionIndex);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Question Panel */}
      <div className="flex-1 p-6 overflow-auto">
        <Card className="p-6">
          {/* Question Header */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">
                  Question {currentQuestionIndex + 1} of {testQuestions.length}
                </h3>
                <div className="flex gap-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {currentQuestion.questionType}
                  </span>
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                    {currentQuestion.difficulty}
                  </span>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {currentQuestion.yearAsked}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Question Options */}
          <div className="mb-8">
            {currentQuestion.questionType === "MCQ" &&
              currentQuestion.options ? (
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleAnswer}
              >
                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center space-x-3 p-4 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                      >
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="flex-1 cursor-pointer">
                          <span className="font-semibold text-slate-700 mr-3">
                            ({key})
                          </span>
                          <span className="text-slate-700">{value}</span>
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="integer-answer">Enter your answer:</Label>
                <Input
                  id="integer-answer"
                  type="text"
                  placeholder="Enter answer"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={toggleMarkForReview}
              variant={isMarked ? "default" : "outline"}
              className={isMarked ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              <Flag size={16} className="mr-2" />
              {isMarked ? "Marked for Review" : "Mark for Review"}
            </Button>
            <Button onClick={handleClearResponse} variant="outline">
              Clear Response
            </Button>
          </div>
        </Card>
      </div >

      {/* Right Panel - Timer & Navigation */}
      < div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col" >
        {/* Timer */}
        < div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200" >
          <p className="text-sm text-slate-600 mb-2">Time Remaining</p>
          <p
            className={`text-3xl font-bold font-mono ${timeLeft < 600 ? "text-red-600" : "text-blue-600"}`}
          >
            {formatTime(timeLeft)}
          </p>
        </div >

        {/* Question Navigator */}
        < div className="mb-6" >
          <h3 className="font-semibold text-slate-900 mb-3">Questions</h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {testQuestions.map((_, idx) => {
              const isAnsw = !!answers[testQuestions[idx].id];
              const isMark = markedForReview.has(idx);
              let bgColor = "bg-slate-100";
              if (isAnsw && isMark) bgColor = "bg-yellow-400";
              else if (isAnsw) bgColor = "bg-green-400";
              else if (isMark) bgColor = "bg-yellow-300";

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded font-semibold text-sm transition ${idx === currentQuestionIndex
                    ? "ring-2 ring-blue-600 " + bgColor
                    : bgColor + " hover:bg-slate-200"
                    }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-slate-700">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
              <span className="text-slate-700">Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-100 rounded"></div>
              <span className="text-slate-700">Not Attempted</span>
            </div>
          </div>
        </div >

        {/* Navigation */}
        < div className="flex gap-2 mb-6" >
          <Button
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentQuestionIndex(
                Math.min(testQuestions.length - 1, currentQuestionIndex + 1),
              )
            }
            disabled={currentQuestionIndex === testQuestions.length - 1}
            variant="outline"
            className="flex-1"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div >

        {/* Submit Button */}
        < Button
          onClick={handleSubmitTest}
          className="w-full bg-green-600 hover:bg-green-700 mt-auto"
        >
          <Send size={16} className="mr-2" />
          Submit Test
        </Button >
      </div >
    </div >
  );
}
