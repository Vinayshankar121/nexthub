import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Zap, BookOpen, Award } from "lucide-react";
import ExamSelection from "./ExamSelection";
import TestInterface from "./TestInterface";
import ResultsPage from "./ResultsPage";

const StudentPortal = () => {
  const { logout, user } = useAuth();
  const { testAttempts } = useExam();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Calculate dynamic stats
  const testsTaken = testAttempts.length;
  const questionsSolved = testAttempts.reduce((acc, curr) => acc + (curr.attemptedQuestions || 0), 0);
  const avgScore = testsTaken > 0
    ? Math.round(testAttempts.reduce((acc, curr) => acc + (curr.percentageScore || 0), 0) / testsTaken)
    : 0;

  const menuItems = [
    { label: "Home", icon: Home, path: "/student" },
    { label: "Practice Tests", icon: Zap, path: "/student/tests" },
    { label: "Subject Practice", icon: BookOpen, path: "/student/subjects" },
    { label: "My Results", icon: Award, path: "/student/results" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <span className="font-bold text-lg">ExamHub</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded transition ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="mb-4 p-3 bg-slate-800 rounded text-sm">
            <p className="text-slate-400">Welcome,</p>
            <p className="font-semibold text-white">{user?.fullName}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Student Portal</h1>
          <p className="text-slate-600">
            Practice exams and track your progress
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<PortalHome testsTaken={testsTaken} questionsSolved={questionsSolved} avgScore={avgScore} />} />
            <Route path="/tests" element={<ExamSelection />} />
            <Route path="/tests/:examId" element={<ExamSelection />} />
            <Route path="/subjects/*" element={<ExamSelection />} />
            <Route path="/take-test/:testId/*" element={<TestInterface />} />
            <Route path="/results/*" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

interface PortalHomeProps {
  testsTaken: number;
  questionsSolved: number;
  avgScore: number;
}

function PortalHome({ testsTaken, questionsSolved, avgScore }: PortalHomeProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Tests Taken</p>
          <p className="text-3xl font-bold text-slate-900">{testsTaken}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Questions Solved</p>
          <p className="text-3xl font-bold text-slate-900">{questionsSolved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Average Score</p>
          <p className="text-3xl font-bold text-slate-900">{avgScore}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Get Started</h2>
        <div className="space-y-3">
          <p className="text-slate-700">
            Welcome to your student dashboard. Here you can:
          </p>
          <ul className="space-y-2 text-slate-700 ml-4">
            <li>✓ Browse and select exams to practice</li>
            <li>✓ Take timed mock tests</li>
            <li>✓ Review your answers with explanations</li>
            <li>✓ Track your performance and progress</li>
          </ul>
          <a href="/student/tests" className="inline-block mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Practicing
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default StudentPortal;
