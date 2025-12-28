import { useState } from "react";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { testAttempts, questions, tests } = useExam(); // destructure tests

  const lastAttempt = testAttempts[testAttempts.length - 1];

  // Find the test associated with this attempt to filter questions
  const attemptTest = lastAttempt
    ? tests.find((t) => t.id === lastAttempt.testId)
    : null;

  const displayQuestions = attemptTest
    ? questions.filter((q) => attemptTest.questionIds.includes(q.id))
    : []; // or questions if fallback needed, but better [] to avoid confusion

  if (!lastAttempt) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900">
            No test attempts found. Take a test to see results.
          </p>
        </div>
      </div>
    );
  }

  const scorePercentage = Math.round(lastAttempt.percentageScore);
  const scoreColor =
    scorePercentage >= 80
      ? "text-green-600"
      : scorePercentage >= 60
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Test Results</h2>
        <Button
          onClick={() => navigate("/student")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      {/* Score Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">Your Score (Marks)</CardTitle>
          <p className="text-xs text-center text-slate-500 font-normal mt-1">
            (+{attemptTest?.marksForCorrect ?? 4} for Correct, {attemptTest?.marksForIncorrect ?? -1} for Wrong)
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`text-6xl font-bold ${scoreColor}`}>
            {lastAttempt.finalScore}/{lastAttempt.totalQuestions * (attemptTest?.marksForCorrect ?? 4)}
          </div>
          <div className={`text-4xl font-bold ${scoreColor}`}>
            {scorePercentage}%
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-blue-200">
            <div>
              <p className="text-sm text-slate-600 mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-600">
                {lastAttempt.correctAnswers}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-red-600">
                {lastAttempt.incorrectAnswers}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Skipped</p>
              <p className="text-2xl font-bold text-slate-600">
                {lastAttempt.unattemptedQuestions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-700 font-medium">
                  Accuracy Rate
                </span>
                <span className="font-bold">{scorePercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-sm text-slate-600 mb-1">
                  Questions Attempted
                </p>
                <p className="text-2xl font-bold">
                  {lastAttempt.attemptedQuestions}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Questions</p>
                <p className="text-2xl font-bold">
                  {lastAttempt.totalQuestions}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({displayQuestions.length})</TabsTrigger>
              <TabsTrigger value="correct">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Correct ({lastAttempt.correctAnswers})
              </TabsTrigger>
              <TabsTrigger value="incorrect">
                <XCircle className="w-4 h-4 mr-1 text-red-600" />
                Wrong ({lastAttempt.incorrectAnswers})
              </TabsTrigger>
              <TabsTrigger value="skipped">
                <HelpCircle className="w-4 h-4 mr-1 text-slate-600" />
                Skipped ({lastAttempt.unattemptedQuestions})
              </TabsTrigger>
            </TabsList>

            {["all", "correct", "incorrect", "skipped"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6 space-y-4">
                {displayQuestions.map((question, idx) => {
                  const userAnswer = lastAttempt.answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const isSkipped = !userAnswer;

                  let shouldShow = true;
                  if (tab === "correct" && !isCorrect) shouldShow = false;
                  if (tab === "incorrect" && (isCorrect || isSkipped))
                    shouldShow = false;
                  if (tab === "skipped" && !isSkipped) shouldShow = false;

                  if (!shouldShow) return null;

                  return (
                    <div
                      key={question.id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">
                          Q{idx + 1}: {question.questionText}
                        </h4>
                        {isSkipped ? (
                          <span className="flex items-center gap-1 text-slate-600 text-sm">
                            <HelpCircle size={16} /> Not Answered
                          </span>
                        ) : isCorrect ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle size={16} /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <XCircle size={16} /> Wrong
                          </span>
                        )}
                      </div>

                      {!isSkipped && (
                        <div className="bg-blue-50 p-3 rounded mb-3 text-sm">
                          <p className="text-slate-700">
                            <span className="font-semibold">Your Answer:</span>{" "}
                            {userAnswer}
                          </p>
                        </div>
                      )}

                      <div className="bg-green-50 p-3 rounded text-sm">
                        <p className="text-slate-700">
                          <span className="font-semibold">Correct Answer:</span>{" "}
                          {question.correctAnswer}
                        </p>
                      </div>

                      {question.explanation && (
                        <div className="bg-amber-50 p-3 rounded mt-3 text-sm">
                          <p className="font-semibold text-amber-900 mb-1">
                            Explanation:
                          </p>
                          <p className="text-amber-800">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/student/tests")}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Take Another Test
        </Button>
        <Button
          onClick={() => navigate("/student")}
          variant="outline"
          className="flex-1"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
