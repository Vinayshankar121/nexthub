import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Zap,
  BookOpen,
  BarChart3,
  Users,
  Lock,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">ExamHub</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Master Your Exams with{" "}
            <span className="text-blue-400">ExamHub</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            The Complete Online Exam & PYQ Test Platform for competitive exam
            preparation. Practice with real exam questions, track your progress,
            and ace your goals.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-400 text-white hover:bg-slate-800"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">
                Comprehensive Question Bank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Thousands of PYQ (Previous Year Questions) from major exams like
                JEE, NEET, and GATE.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Zap className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Adaptive Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Create custom tests with MCQ and Integer type questions. Manual
                or random selection modes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Track your progress with comprehensive performance metrics and
                answer explanations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Choose Your Role
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Portal */}
          <div className="group">
            <Card className="bg-gradient-to-br from-blue-900/50 to-slate-800 border-blue-700/50 hover:border-blue-500 transition-all h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <GraduationCap className="w-12 h-12 text-blue-400" />
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Student Portal
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Practice exams and track your preparation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">What You Can Do:</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Browse and select
                      from multiple exams
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Practice by
                      subject and difficulty
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Take timed mock
                      tests
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Review answers
                      with explanations
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Track performance
                      metrics
                    </li>
                  </ul>
                </div>
                <Link to="/login" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Enter Student Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Admin Dashboard */}
          <div className="group">
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-800 border-purple-700/50 hover:border-purple-500 transition-all h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Users className="w-12 h-12 text-purple-400" />
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Admin Dashboard
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage exams, questions, and tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">What You Can Do:</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-purple-400">✓</span> Create and
                      manage exams
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400">✓</span> Add subjects
                      and questions
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400">✓</span> Build custom
                      tests
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400">✓</span> Manage question
                      bank
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-400">✓</span> View student
                      analytics
                    </li>
                  </ul>
                </div>
                <Link to="/login" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Enter Admin Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-slate-700 py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400">50+</p>
              <p className="text-slate-400 mt-2">Exams Available</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400">10,000+</p>
              <p className="text-slate-400 mt-2">Questions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400">100%</p>
              <p className="text-slate-400 mt-2">Free to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2024 ExamHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
