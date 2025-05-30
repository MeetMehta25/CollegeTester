export type UserRole = 'student' | 'teacher' | 'admin';
export enum AssignmentStatus {
  Pending = 'pending',
  Submitted = 'submitted'
}

export enum TestStatus {
  Scheduled = 'scheduled',
  Ongoing = 'ongoing',
  Completed = 'completed'
}

export enum SubmissionStatus {
  Pending = 'pending',
  Graded = 'graded'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Grade {
  assessment: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  attendance: number;
  grade?: string;
  grades?: Grade[];
}

export interface Assignment {
  id: string;
  status: AssignmentStatus;
  submissions: number;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'academic' | 'cultural' | 'sports' | 'holiday';
}

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  class: string;
  room: string;
}

export interface Test {
  id: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  subject: string;
  title: string;
  date: string;
  duration: string;
  totalMarks: number;
  class: string;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  assignmentId: string;
  submissionDate: string;
  status: 'pending' | 'graded';
  grade?: string;
  feedback?: string;
}


export interface StudentData {
  id: string;
  name: string;
  email: string;
  grade: string;
  rollNumber: string;
  attendance: number;
  performanceData: {
    subject: string;
    score: number;
  }[];
}

export interface TeacherData {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  joinDate: string;
}

export interface ExamRoom {
  id: string;
  roomnumber: string;
  time: number;
  purpose: string;
  building: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface DepartmentStats {
  name: string;
  studentCount: number;
  teacherCount: number;
  averagePerformance: number;
}