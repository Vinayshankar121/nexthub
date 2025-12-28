# ExamHub - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Access the Application

The app is already running at:

```
https://27502ccb241349e0864ac6607399d68d-br-5980445e8d0649448bbc0f0f7.projects.builder.codes/
```

### Step 2: Explore the Homepage

- Beautiful landing page with dark theme
- Features section showcasing platform capabilities
- Role selection cards for Student and Admin portals

### Step 3: Choose Your Role

#### As a Student:

1. Click "Sign In" or "Get Started Free"
2. Select "Student" tab
3. Use demo credentials:
   - Email: `demo@example.com`
   - Password: `any password`
4. Click "Sign In"
5. You'll be taken to the Student Dashboard

#### As an Admin:

1. Click "Sign In"
2. Select "Admin" tab
3. Use demo credentials (same as above)
4. Click "Sign In"
5. You'll be taken to the Admin Dashboard

## 📚 Student Portal Walkthrough

### Dashboard

- View statistics (Tests Taken, Questions Solved, Average Score)
- Navigate using the left sidebar
- Click "Start Practicing" to begin

### Practice Tests

1. Click "Practice Tests" in sidebar
2. Browse available exams
3. Click "Start Practice" on any exam
4. Select questions and take the test

### Taking a Test

1. **Timer**: See countdown in top right
2. **Questions**: Navigate using the grid on the right
3. **Options**:
   - Click radio buttons for MCQ
   - Enter number for Integer questions
4. **Mark for Review**: Yellow flag for later review
5. **Previous/Next**: Navigate between questions
6. **Submit**: Click when done

### Reviewing Results

1. See overall score and accuracy rate
2. Review each answer with explanation
3. Filter by correct/incorrect/skipped
4. Take another test or return to dashboard

## 👨‍💼 Admin Dashboard Walkthrough

### Dashboard Home

- See statistics (Total Exams, Subjects, Questions, Tests)
- Quick overview of platform content

### Exam Management

1. Click "Exams" in sidebar
2. View all exams in table
3. Click "New Exam" button
4. Enter exam name and description
5. Click "Create Exam"
6. Delete exams with trash icon

### Subject Management

1. Click "Subjects" in sidebar
2. Filter by exam using dropdown
3. Click "New Subject" button
4. Select an exam
5. Enter subject name
6. Click "Add Subject"

### Question Bank

1. Click "Questions" in sidebar
2. Click "New Question" button
3. Fill in details:
   - Select exam
   - Enter subject
   - Choose question type (MCQ/Integer)
   - Enter question text
   - For MCQ: Add 4 options and select correct answer
   - For Integer: Enter correct answer value
   - Set difficulty level
   - Set year
   - Add explanation (optional)
4. Click "Add Question"
5. Use filters to find questions:
   - Filter by exam
   - Filter by type (MCQ/Integer)
   - Filter by year
   - Clear filters to reset

### Test Builder

1. Click "Tests" in sidebar
2. Click "Create New Test" button
3. Select an exam
4. Choose question type (MCQ, Integer, or Mixed)
5. Set number of questions
6. Choose selection mode:
   - Random: System selects randomly
   - Manual: (Coming soon) You select manually
7. Click "Create Test"
8. View created tests in table
9. Delete tests with trash icon

## 🎯 Key Features to Try

### Student Features

- [ ] Take a practice test
- [ ] Mark questions for review
- [ ] Clear your response
- [ ] Navigate using question grid
- [ ] See timer counting down
- [ ] Submit test
- [ ] Review your score
- [ ] See correct answers with explanations
- [ ] Filter results by question type

### Admin Features

- [ ] Create an exam
- [ ] Add subjects to exam
- [ ] Add MCQ questions
- [ ] Add Integer questions
- [ ] Filter questions by criteria
- [ ] Create a test
- [ ] Delete test data
- [ ] View all statistics

## 💾 Sample Data

The application comes with:

- **Exams**: JEE Main 2024, NEET 2024
- **Subjects**: Physics, Chemistry, Mathematics (JEE), Physics, Chemistry, Biology (NEET)
- **Questions**: 2 sample questions with explanations
- **Ready to add more**: Use admin panel to add questions

## 🔐 Authentication

**Demo Account:**

- Email: `demo@example.com`
- Password: Any password (demo doesn't validate passwords)
- Roles: Select ADMIN or STUDENT at login

**Sign Up:**

- Create new account with any email
- Choose role (ADMIN or STUDENT)
- Password requirements: Any password works (for demo)

## 📱 Responsive Design

The application works on:

- Desktop browsers (optimized)
- Tablets (responsive)
- Mobile phones (full responsive layout)

Try resizing your browser to see responsive design in action!

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: In-memory (ready for MongoDB/PostgreSQL)
- **Authentication**: localStorage-based (ready for JWT)
- **Styling**: TailwindCSS with Radix UI components

## 🔧 Environment Variables

No additional setup needed! The app works out of the box.

For production deployment, add a `.env` file with:

```env
PING_MESSAGE=pong
NODE_ENV=production
```

## 📊 Scoring Rules

When you submit a test:

- **Correct Answer**: +4 points
- **Wrong Answer**: -1 point
- **Unattempted**: 0 points
- **Percentage**: (Correct Answers / Total Questions) × 100

**Example**:

- 10 questions total
- 8 correct, 2 wrong
- Score: (8 × 4) + (2 × -1) = 32 - 2 = 30/40
- Percentage: (8/10) × 100 = 80%

## 🚀 Deployment Ready

The app is ready to deploy to:

- Netlify (recommended)
- Vercel
- Docker containers
- Any Node.js hosting

## 📖 Documentation

For detailed information:

- `README.md` - Complete project documentation
- `IMPLEMENTATION_SUMMARY.md` - What was built
- Code is well-commented for easy understanding

## 🆘 Troubleshooting

### Page not loading?

- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (F5)
- Check browser console for errors

### Login not working?

- Make sure you selected the correct role (ADMIN/STUDENT)
- Email can be any format
- Password can be anything

### Can't see my created test?

- Refresh the page
- Check the "Tests" section in admin dashboard
- Make sure you created it successfully

### Timer not counting down?

- This is expected for demo
- In production, it will work with real timestamps

## 💡 Tips & Tricks

1. **Quick Test**:
   - Create 5-10 questions first
   - Then create a test with those questions
   - Take the test as a student

2. **Add Content**:
   - Admin can create multiple exams
   - Add subjects under each exam
   - Add many questions per subject
   - Build tests from the question bank

3. **Customization**:
   - Change exam names to your exams
   - Add your own subjects
   - Create realistic questions
   - Set appropriate difficulty levels

4. **Mobile Testing**:
   - Test interface works on mobile
   - Try taking a test on your phone
   - Check responsive design

## 🎓 Learning Path

1. **Start Here**: Homepage → Get familiar with features
2. **Admin First**: Create exams, subjects, and questions
3. **Student Next**: Take a practice test
4. **Review**: Check results and explanations
5. **Iterate**: Create more tests and practice

## 📞 Need Help?

- Check the code comments in files
- Read README.md for detailed docs
- Review IMPLEMENTATION_SUMMARY.md for features
- All components are well-documented

## 🎉 Ready to Explore?

Start with the [homepage](/) and have fun exploring ExamHub!

---

**Next Step**: [Visit the App →](/)
