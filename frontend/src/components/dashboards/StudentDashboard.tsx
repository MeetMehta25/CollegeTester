// src/components/StudentDashboard/StudentDashboard.tsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChatbotWidget from './ChatbotWidget'; // Adjusted path assuming the file is named ChatbotWidget.tsx
import { User, Subject, Assignment, Notice, Event } from '../../types';
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Bell, 
  LogOut,
  GraduationCap,
  Home,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, CartesianGrid } from 'recharts';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}
interface User {
  name: string;
  email: string;
}

const revenueData = [
  { name: 'Week 1', value: 11000 },
  { name: 'Week 2', value: 12500 },
  { name: 'Week 3', value: 11800 },
  { name: 'Week 4', value: 12300 },
  { name: 'Week 5', value: 13000 },
  { name: 'Week 6', value: 13800 },
  { name: 'Week 7', value: 15231.89 }
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enhanced mock data with detailed grade tracking
  const subjects: Subject[] = [
    { 
      id: '1', 
      name: 'Mathematics', 
      code: 'MATH101', 
      teacher: 'Radha ', 
      attendance: 85,
      grades: [
        { assessment: 'Quiz 1', score: 85, maxScore: 100, weight: 0.2 },
        { assessment: 'Midterm', score: 78, maxScore: 100, weight: 0.3 },
        { assessment: 'Project', score: 92, maxScore: 100, weight: 0.2 },
        { assessment: 'Final', score: 88, maxScore: 100, weight: 0.3 }
      ]
    },
    { 
      id: '2', 
      name: 'Physics', 
      code: 'PHY101', 
      teacher: 'Dr. KK', 
      attendance: 90,
      grades: [
        { assessment: 'Lab 1', score: 88, maxScore: 100, weight: 0.15 },
        { assessment: 'Midterm', score: 82, maxScore: 100, weight: 0.35 },
        { assessment: 'Lab 2', score: 95, maxScore: 100, weight: 0.15 },
        { assessment: 'Final', score: 85, maxScore: 100, weight: 0.35 }
      ]
    },
    { 
      id: '3', 
      name: 'Computer Science', 
      code: 'CS101', 
      teacher: 'Prof. KKD', 
      attendance: 95,
      grades: [
        { assessment: 'Assignment 1', score: 90, maxScore: 100, weight: 0.2 },
        { assessment: 'Project', score: 95, maxScore: 100, weight: 0.3 },
        { assessment: 'Assignment 2', score: 88, maxScore: 100, weight: 0.2 },
        { assessment: 'Final', score: 92, maxScore: 100, weight: 0.3 }
      ]
    },
  ];

  const assignments: Assignment[] = [
    { id: '1', title: 'Calculus Assignment', subject: 'Mathematics', dueDate: '2024-03-25', status: 'pending' },
    { id: '2', title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-03-28', status: 'submitted' },
    { id: '4', title: 'Community Project', subject: 'English', dueDate: '2024-04-11', status: 'graded', grade: 'B' },
    { id: '5', title: 'BEE', subject: 'Electronics', dueDate: '2024-04-16', status: 'graded', grade: 'C' },
  ];

  const notices: Notice[] = [
    { id: '1', title: 'Semester End Exam Schedule', content: 'Final exams will begin from April 15th. Please check the department notice board for detailed schedule.', date: '2024-03-20', priority: 'high' },
    { id: '2', title: 'Library Timing Change', content: 'Library will now be open till 8 PM on weekdays and 6 PM on weekends starting next week.', date: '2024-03-19', priority: 'medium' },
    { id: '3', title: 'Career Fair', content: 'Annual career fair will be held on April 5th in the main auditorium. All final year students are required to attend.', date: '2024-03-22', priority: 'high' },
  ];

  const events: Event[] = [
    { id: '1', title: 'Annual Sports Day', date: '2024-04-05', description: 'College annual sports event', type: 'sports' },
    { id: '2', title: 'Technical Symposium', date: '2024-04-10', description: 'Department technical event', type: 'academic' },
    { id: '3', title: 'Mid-Semester Exams Begin', date: '2024-03-30', description: 'Mid-semester examinations start', type: 'academic' },
    { id: '4', title: 'Workshop on AI', date: '2024-04-15', description: 'Workshop on artificial intelligence applications', type: 'academic' },
    { id: '5', title: 'Cultural Fest', date: '2024-04-20', description: 'Annual cultural festival', type: 'cultural' },
  ];

  // Calculate weighted average for each subject
  const calculateWeightedAverage = (grades: any[]) => {
    return grades.reduce((acc, grade) => acc + (grade.score * grade.weight), 0);
  };

  // Get overall attendance across all subjects
  const getOverallAttendance = () => {
    const sum = subjects.reduce((acc, subject) => acc + subject.attendance, 0);
    return (sum / subjects.length).toFixed(1);
  };

  // Get pending assignments count
  const getPendingAssignmentsCount = () => {
    return assignments.filter(a => a.status === 'pending').length;
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    });
  };

  const renderHighPriorityNotices = () => {
    const highPriorityNotices = notices.filter(notice => notice.priority === 'high');
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-[#1a237e]" />
          <h3 className="text-xl font-bold text-[#1a237e] ml-2">Important Notices</h3>
        </div>
        <div className="space-y-4">
          {highPriorityNotices.map(notice => (
            <div key={notice.id} className="p-4 bg-[#f5f5f5] rounded-xl">
              <h4 className="font-medium text-[#1a237e]">{notice.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.content}</p>
              <p className="text-xs text-[#1a237e] mt-1">
                {format(new Date(notice.date), 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
          {highPriorityNotices.length === 0 && (
            <p className="text-sm text-gray-500">No important notices at this time</p>
          )}
        </div>
        <button 
          onClick={() => setActiveTab('notices')}
          className="mt-4 text-sm text-[#1a237e] hover:text-[#303f9f] flex items-center"
        >
          View all notices
        </button>
      </div>
    );
  };

  const renderCalendarWithEvents = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Fill initial empty days
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
  
    const dayHasEvent = (day: number) => {
      if (!day) return false;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return events.some(event => event.date.startsWith(dateStr));
    };
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1a237e]">
            {format(new Date(currentYear, currentMonth), 'MMMM yyyy')}
          </h3>
          <button className="p-1 rounded hover:bg-[#e8eaf6]">
            <Calendar className="h-6 w-6 text-[#1a237e]" />
          </button>
        </div>
  
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm font-medium text-[#1a237e] p-2">
              {day}
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${
                day === currentDate.getDate() ? 'bg-[#1a237e] text-white' : 'text-[#1a237e] hover:bg-[#1a237e] hover:text-white'
              } cursor-pointer transition-colors`}
            >
              {day}
            </div>
          ))}
        </div>
  
        <button
          onClick={() => setActiveTab('calendar')}
          className="mt-4 text-sm text-[#1a237e] hover:text-[#303f9f] flex items-center"
        >
          View all events
        </button>
      </div>
    );
  };

  const renderAttendanceSummary = () => {
    return (
      <div className="space-y-4">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white p-6 rounded-2xl shadow-lg">
            <h4 className="font-medium text-[#1a237e]">{subject.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">Attendance</span>
              <span className="text-sm font-semibold text-[#1a237e]">
                {subject.attendance}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-[#1a237e] rounded-full h-2"
                style={{ width: `${subject.attendance}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSubjectCard = (subject: Subject) => {
    const weightedAverage = calculateWeightedAverage(subject.grades || []);
    const gradeData = subject.grades?.map((g) => ({
      name: g.assessment,
      score: g.score,
      average: weightedAverage
    }));

    return (
      <div key={subject.id} className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#1a237e]">{subject.name}</h3>
            <p className="text-sm text-gray-600">Code: {subject.code}</p>
            <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#1a237e]">{weightedAverage.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Overall Grade</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Attendance</span>
            <span className="text-sm font-semibold text-[#1a237e]">{subject.attendance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#1a237e] rounded-full h-2"
              style={{ width: `${subject.attendance}%` }}
            ></div>
          </div>
        </div>

        <div className="h-48 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#1a237e" name="Score" />
              <Line type="monotone" dataKey="average" stroke="#303f9f" name="Average" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {subject.grades && subject.grades.map((grade, index) => (
            <div key={index} className="bg-[#e8eaf6] p-4 rounded-xl">
              <div className="text-sm font-medium text-[#1a237e]">{grade.assessment}</div>
              <div className="text-lg font-bold text-[#1a237e]">{grade.score}%</div>
              <div className="text-xs text-gray-600">Weight: {grade.weight * 100}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHomePage = () => {
    return (
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center">
            <div className="rounded-full bg-[#e8eaf6] p-3 mr-4">
              <BookOpen className="h-6 w-6 text-[#1a237e]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Attendance</p>
              <p className="text-2xl font-bold text-[#1a237e]">{getOverallAttendance()}%</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center">
            <div className="rounded-full bg-[#e8eaf6] p-3 mr-4">
              <CheckSquare className="h-6 w-6 text-[#1a237e]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Assignments</p>
              <p className="text-2xl font-bold text-[#1a237e]">{getPendingAssignmentsCount()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center">
            <div className="rounded-full bg-[#e8eaf6] p-3 mr-4">
              <Calendar className="h-6 w-6 text-[#1a237e]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-bold text-[#1a237e]">{getUpcomingEvents().length}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar (1/3 width) */}
          <div>
            {renderCalendarWithEvents()}
          </div>

          {/* Notices (1/3 width) */}
          <div>
            {renderHighPriorityNotices()}
          </div>

          {/* Attendance Summary (1/3 width) */}
          <div>
            <h3 className="text-xl font-bold text-[#1a237e] mb-6">Attendance Summary</h3>
            {renderAttendanceSummary()}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomePage();

      case 'subjects':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-20 max-w-6xl mx-auto">
            {subjects.map(renderSubjectCard)}
          </div>
        );

      case 'assignments':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 px-2">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a237e]">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-[#1a237e] mt-1">{assignment.subject}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.status === 'pending'
                        ? 'bg-[#e8eaf6] text-[#1a237e]'
                        : assignment.status === 'submitted'
                        ? 'bg-[#1a237e] text-white'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                  </p>
                  {assignment.grade && (
                    <span className="text-sm font-bold text-[#1a237e]">
                      Grade: {assignment.grade}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'calendar':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a237e]">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'academic'
                        ? 'bg-[#1a237e] text-white'
                        : event.type === 'cultural'
                        ? 'bg-purple-100 text-purple-800'
                        : event.type === 'sports'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-[#1a237e]">
                  {format(new Date(event.date), 'MMMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-6">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a237e]">{notice.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{notice.content}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      notice.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : notice.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {notice.priority}
                  </span>
                </div>
                <p className="text-sm text-[#1a237e]">
                  Posted: {format(new Date(notice.date), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const navigation = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'subjects', icon: BookOpen, label: 'Subjects' },
    { id: 'assignments', icon: CheckSquare, label: 'Assignments' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'notices', icon: Bell, label: 'Notices' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 ml-20 lg:ml-64">
      {/* Vertical Navigation - Desktop */}
      <div className="w-20 lg:w-64 h-screen bg-white shadow-xl fixed left-0 flex flex-col">
      <div className="p-4 mb-8 flex items-center gap-3 lg:justify-start justify-center">
  <GraduationCap className="h-8 w-8 text-[#1a237e]" />
  
  <div className="flex flex-col">
    <h1 className="text-lg font-bold text-[#1a237e]">Student Portal</h1>
    <h3 className="text-sm text-gray-500">Welcome back, {user.name}</h3>
  </div>
</div>

        
        <div className="flex-1 space-y-2 px-2">
          {navigation.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeTab === id
                  ? 'bg-[#1a237e] text-white shadow-md'
                  : 'text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:block">{label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-[#1a237e]" />
          <h1 className="text-lg font-bold text-[#1a237e] ml-2">Student Portal</h1>
        
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#1a237e] p-1"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-0 bottom-0 w-64 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-500">Welcome,</p>
              <p className="font-medium text-[#1a237e]">{user.name}</p>
            </div>
            
            <div className="py-4">
              <ul>
                {navigation.map(({ id, icon: Icon, label }) => (
                  <li key={id}>
                    <button
                      onClick={() => {
                        setActiveTab(id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        activeTab === id
                          ? 'bg-[#1a237e] text-white shadow-md'
                          : 'text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm md:mt-0 mt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-bold text-[#1a237e]">
              {navigation.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>
      </div>

      {/* Chatbot Widget (fixed at bottom-right) */}
      <ChatbotWidget />
    </div>
  );
};

export default StudentDashboard;