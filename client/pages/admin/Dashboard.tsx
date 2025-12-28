import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  TestTube,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ExamManagement from "./ExamManagement";
import SubjectManagement from "./SubjectManagement";
import QuestionBank from "./QuestionBank";
import TestBuilder from "./TestBuilder";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { exams, questions, tests } = useExam();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Exams", icon: BookOpen, path: "/admin/exams" },
    { label: "Subjects", icon: FileText, path: "/admin/subjects" },
    { label: "Questions", icon: TestTube, path: "/admin/questions" },
    { label: "Tests", icon: TestTube, path: "/admin/tests" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"
          } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <span className="font-bold text-lg">ExamHub Admin</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">
            Manage exams, subjects, questions, and tests
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome examsCount={exams.length} questionsCount={questions.length} testsCount={tests.length} />} />
            <Route path="/exams/*" element={<ExamManagement />} />
            <Route path="/subjects/*" element={<SubjectManagement />} />
            <Route path="/questions/*" element={<QuestionBank />} />
            <Route path="/tests/*" element={<TestBuilder />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

interface DashboardHomeProps {
  examsCount: number;
  questionsCount: number;
  testsCount: number;
}

function DashboardHome({ examsCount, questionsCount, testsCount }: DashboardHomeProps) {
  return (
    <div className="p-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Total Exams</p>
          <p className="text-3xl font-bold text-slate-900">{examsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Total Subjects</p>
          <p className="text-3xl font-bold text-slate-900">-</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Total Questions</p>
          <p className="text-3xl font-bold text-slate-900">{questionsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Total Tests</p>
          <p className="text-3xl font-bold text-slate-900">{testsCount}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Getting Started
        </h2>
        <div className="space-y-4">
          <p className="text-slate-700">
            Welcome to the ExamHub Admin Dashboard. You can manage all exams,
            subjects, and questions from here.
          </p>
          <ul className="space-y-2 text-slate-700">
            <li>• Use the sidebar to navigate to different sections</li>
            <li>• Create and manage exams in the Exams section</li>
            <li>• Add subjects and questions to organize your content</li>
            <li>• Build custom tests for students</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
