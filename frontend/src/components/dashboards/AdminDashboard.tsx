import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { 
  Settings,
  LogOut,
  Users,
  GraduationCap,
  School,
  BarChart3,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  Menu,
  X,
  Search,
  FileText,
  CheckSquare,
  Clock,
  Home,
  User,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface User {
  name: string;
  email: string;
}
interface Teacher {
  name: string;
  department: string;
  tid: string;
  subjects: string[];
  JoinDate: string;
}


interface Student {
  Name: string;
  Class: string;
  UID: string;
  Email: string;
  Contact: string;
}



const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  // Student state
  const [students, setStudents] = useState<Student[]>([]);
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  const [newStudent, setNewStudent] = useState({
    Name: '',
    Class: '',
    UID: '',
    Email: '',
    Contact: '',
  });

  useEffect(() => {
    console.log("useEffect triggered!"); // ← Add this
  fetch("http://localhost:5000/api/students")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);
      setStudents(data);
    })
    .catch(err => console.error("Fetch error:", err));
  }, []);

  // Teacher state
  
  const [isNewTeacherOpen, setIsNewTeacherOpen] = useState(false);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    department: '',
    tid:'',
    subjects: [''],
    JoinDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/teachers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched teachers:", data);
        setTeachers(data);
      })
      .catch((err) => console.error("Failed to fetch teachers:", err));
    }, []);


  // Exam Room state
  const [examRooms, setExamRooms] = useState([
    { id: '1', roomNumber: '101', capacity: 40, floor: '1st', status: 'available' }
  ]);
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false);
  const [roomSearchTerm, setRoomSearchTerm] = useState('');
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    capacity: 20,
    floor: '1st',
    status: 'available'
  });

  // Timetable state
  const [timetable, setTimetable] = useState([
    { id: '1', day: 'Monday', time: '8:00-9:00', subject: 'Mathematics', teacher: 'Dr.Radha', room: '101' }
  ]);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState('');
  const [newSchedule, setNewSchedule] = useState({
    day: 'Monday',
    time: '8:00-9:00',
    subject: '',
    teacher: '',
    room: ''
  });

  // Student functions
  const handleAddStudent = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/students', {
        Name: newStudent.Name,
        Class: newStudent.Class,
        UID: newStudent.UID,
        Email: newStudent.Email,
        Contact: newStudent.Contact
      });
  
      // Add the new student to local state with the ID returned from the database
      setStudents([...students, {
        Name: response.data.Name,
        Class: response.data.Class,
        UID: response.data.UID,
        Email: response.data.Email,
        Contact: response.data.Contact
      }]);
      await fetchStudents(); 
      
      // Reset form and close modal
      setNewStudent({ Name: '', Class: '', UID: '', Email: '', Contact: '' });
      setIsNewStudentOpen(false);
      
      // Optional: Show success notification
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  const handleDeleteStudent = async (uid: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${uid}`);
      await fetchStudents(); // refresh list
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };
  

  // Teacher functions
  const handleAddTeacher = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/teachers', {
        name: newTeacher.name,
        department: newTeacher.department,
        tid: newTeacher.tid,
        subjects: newTeacher.subjects,
        JoinDate: newTeacher.JoinDate
      });
  
      // Add the new teacher to local state
      setTeachers([...teachers, {
        name: response.data.Name,
        department: response.data.department,
        tid: response.data.tid,
        subjects: response.data.subjects,
        JoinDate: response.data.JoinDate
      }]);
  
      await fetchTeachers(); // Refresh teacher list
  
      // Reset form and close modal
      setNewTeacher({ name: '', department: '',tid: '', subjects: [''], JoinDate: format(new Date(), 'yyyy-MM-dd') });
      setIsNewTeacherOpen(false);
  
      alert('Teacher added successfully!');
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Failed to add teacher');
    }
  };
  
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };
  
  const handleDeleteTeacher = async (tid: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${tid}`);
      await fetchTeachers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete teacher:', error);
    }
  };
  

  // Room functions
  const handleAddRoom = () => {
    setExamRooms([...examRooms, { ...newRoom, id: Date.now().toString() }]);
    setNewRoom({ roomNumber: '', capacity: 20, floor: '1st', status: 'available' });
    setIsNewRoomOpen(false);
  };

  const handleDeleteRoom = (id: string) => {
    setExamRooms(examRooms.filter(room => room.id !== id));
  };

  // Schedule functions
  const handleAddSchedule = () => {
    setTimetable([...timetable, { ...newSchedule, id: Date.now().toString() }]);
    setNewSchedule({ day: 'Monday', time: '8:00-9:00', subject: '', teacher: '', room: '' });
    setIsNewScheduleOpen(false);
  };

  const handleDeleteSchedule = (id: string) => {
    setTimetable(timetable.filter(item => item.id !== id));
  };

  const renderOverview = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Users size={24} className="h-12 w-12 text-[#1a237e]/30" />
            <div>
              <h3 className="text-lg font-semibold text-[#1a237e]">Total Students</h3>
              <p className="text-3xl font-bold text-[#1a237e] mt-2">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen size={24} className="h-12 w-12 text-[#1a237e]/30" />
            <div>
              <h3 className="text-lg font-semibold text-[#1a237e]">Active Courses</h3>
              <p className="text-3xl font-bold text-[#1a237e] mt-2">42</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Home size={24} className="h-12 w-12 text-[#1a237e]/30" />
            <div>
              <h3 className="text-lg font-semibold text-[#1a237e]">Available Rooms</h3>
              <p className="text-3xl font-bold text-[#1a237e] mt-2">{examRooms.filter(r => r.status === 'available').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-[#1a237e] mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-xl">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#1a237e]" />
              <span className="text-[#1a237e]">New student registration</span>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-xl">
            <div className="flex items-center gap-3">
              <CheckSquare size={18} className="text-[#1a237e]" />
              <span className="text-[#1a237e]">Exam schedule updated</span>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => {
    const filteredStudents = students.filter(student =>
      student?.Name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student?.Class?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student?.Email?.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  
  

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1a237e]">Student Management</h2>
          <button 
            onClick={() => setIsNewStudentOpen(true)}
            className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f] flex items-center gap-2"
          >
            <PlusCircle size={18} />
            New Student
          </button>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
              <div className="relative flex-1 w-full md:w-auto">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="w-full p-2 pl-10 border rounded-lg"
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-[#1a237e]">All</button>
                <button className="text-[#1a237e] border-l-2 pl-4 border-gray-200">Active</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e8eaf6]">
                  <tr>
                    <th className="p-4 text-left text-[#1a237e]">Name</th>
                    <th className="p-4 text-left text-[#1a237e]">Class</th>
                    <th className="p-4 text-left text-[#1a237e]">UID</th>
                    <th className="p-4 text-left text-[#1a237e]">Email</th>
                    <th className="p-4 text-left text-[#1a237e]">Contact</th>
                    <th className="p-4 text-left text-[#1a237e]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
  {filteredStudents.map((student) => (
    <tr key={student.UID} className="hover:bg-gray-50">
      <td className="p-4 text-[#1a237e] font-medium">{student.Name}</td>
      <td className="p-4 text-[#1a237e]">{student.Class}</td>
      <td className="p-4 text-[#1a237e]">{student.UID}</td>
      <td className="p-4 text-[#1a237e]">{student.Email}</td>
      <td className="p-4 text-[#1a237e]">{student.Contact}</td>
      <td className="p-4 flex gap-4">
        <button className="text-[#1a237e] hover:text-[#303f9f]">
          <Edit size={18} />
        </button>
        <button 
          className="text-red-600 hover:text-red-800"
          onClick={() => handleDeleteStudent(student.UID)} // changed from student.id
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          </div>

          
        </div>

        {/* New Student Modal */}
        {isNewStudentOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a237e]">Add New Student</h3>
                <button onClick={() => setIsNewStudentOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#1a237e] mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newStudent.Name}
                    onChange={(e) => setNewStudent({...newStudent, Name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Class</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newStudent.Class}
                    onChange={(e) => setNewStudent({...newStudent, Class: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">UID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newStudent.UID}
                    onChange={(e) => setNewStudent({...newStudent, UID: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Email</label>
                  <input
                    type="text"                    
                    className="w-full p-2 border rounded-lg"
                    value={newStudent.Email}
                    onChange={(e) => setNewStudent({...newStudent, Email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Contact</label>
                  <input
                    type="text"                    
                    className="w-full p-2 border rounded-lg"
                    value={newStudent.Contact}
                    onChange={(e) => setNewStudent({...newStudent, Contact: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setIsNewStudentOpen(false)}
                    className="px-4 py-2 border border-[#1a237e] text-[#1a237e] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddStudent}
                    className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f]"
                  >
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTeachers = () => {
    const filteredTeachers = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
      teacher.subjects.some(sub => sub.toLowerCase().includes(teacherSearchTerm.toLowerCase()))
    );

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1a237e]">Teacher Management</h2>
          <button 
            onClick={() => setIsNewTeacherOpen(true)}
            className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f] flex items-center gap-2"
          >
            <PlusCircle size={18} />
            New Teacher
          </button>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
              <div className="relative flex-1 w-full md:w-auto">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search teachers..." 
                  className="w-full p-2 pl-10 border rounded-lg"
                  value={teacherSearchTerm}
                  onChange={(e) => setTeacherSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-[#1a237e]">All</button>
                <button className="text-[#1a237e] border-l-2 pl-4 border-gray-200">Active</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e8eaf6]">
                  <tr>
                    <th className="p-4 text-left text-[#1a237e]">Name</th>
                    <th className="p-4 text-left text-[#1a237e]">Department</th>
                    <th className="p-4 text-left text-[#1a237e]">Subjects</th>
                    <th className="p-4 text-left text-[#1a237e]">Join Date</th>
                    <th className="p-4 text-left text-[#1a237e]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
  {filteredTeachers.map((teacher) => (
    <tr key={teacher.tid} className="hover:bg-gray-50">
      <td className="p-4 text-[#1a237e] font-medium">{teacher.name}</td>
      <td className="p-4 text-[#1a237e]">{teacher.department}</td>
      <td className="p-4 text-[#1a237e]">{teacher.subjects.join(', ')}</td>
      <td className="p-4 text-[#1a237e]">
      {teacher.JoinDate ? format(new Date(teacher.JoinDate), 'yyyy-mm-dd') : 'N/A'}
      </td>
      <td className="p-4">
        <div className="flex gap-4 items-center">
        </div>
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          </div>

          
        </div>

        {/* New Teacher Modal */}
        {isNewTeacherOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a237e]">Add New Teacher</h3>
                <button onClick={() => setIsNewTeacherOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#1a237e] mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Department</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">TID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newTeacher.tid}
                    onChange={(e) => setNewTeacher({...newTeacher, tid: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Subjects (comma separated)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newTeacher.subjects.join(', ')}
                    onChange={(e) => setNewTeacher({...newTeacher, subjects: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Join Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    value={newTeacher.JoinDate}
                    onChange={(e) => setNewTeacher({...newTeacher, JoinDate: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setIsNewTeacherOpen(false)}
                    className="px-4 py-2 border border-[#1a237e] text-[#1a237e] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddTeacher}
                    className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f]"
                  >
                    Add Teacher
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExamRooms = () => {
    const filteredRooms = examRooms.filter(room =>
      room.roomNumber.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
      room.status.toLowerCase().includes(roomSearchTerm.toLowerCase())
    );

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1a237e]">Exam Room Management</h2>
          <button 
            onClick={() => setIsNewRoomOpen(true)}
            className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f] flex items-center gap-2"
          >
            <PlusCircle size={18} />
            New Room
          </button>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
              <div className="relative flex-1 w-full md:w-auto">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search rooms..." 
                  className="w-full p-2 pl-10 border rounded-lg"
                  value={roomSearchTerm}
                  onChange={(e) => setRoomSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-[#1a237e]">All</button>
                <button className="text-[#1a237e] border-l-2 pl-4 border-gray-200">Available</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e8eaf6]">
                  <tr>
                    <th className="p-4 text-left text-[#1a237e]">Room Number</th>
                    <th className="p-4 text-left text-[#1a237e]">Capacity</th>
                    <th className="p-4 text-left text-[#1a237e]">Floor</th>
                    <th className="p-4 text-left text-[#1a237e]">Status</th>
                    <th className="p-4 text-left text-[#1a237e]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="p-4 text-[#1a237e] font-medium">{room.roomNumber}</td>
                      <td className="p-4 text-[#1a237e]">{room.capacity}</td>
                      <td className="p-4 text-[#1a237e]">{room.floor}</td>                    
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          room.status === 'available' 
                            ? 'bg-[#e8eaf6] text-[#1a237e]' 
                            : 'bg-[#1a237e] text-white'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-4">
                        <button className="text-[#1a237e] hover:text-[#303f9f]">
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
        </div>

        {/* New Room Modal */}
        {isNewRoomOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a237e]">Add New Room</h3>
                <button onClick={() => setIsNewRoomOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#1a237e] mb-1">Room Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded-lg"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Floor</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                  >
                    <option value="1st">1st Floor</option>
                    <option value="2nd">2nd Floor</option>
                    <option value="3rd">3rd Floor</option>
                    <option value="4th">4th Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Status</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newRoom.status}
                    onChange={(e) => setNewRoom({...newRoom, status: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setIsNewRoomOpen(false)}
                    className="px-4 py-2 border border-[#1a237e] text-[#1a237e] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddRoom}
                    className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f]"
                  >
                    Add Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTimetable = () => {
    const filteredTimetable = timetable.filter(item =>
      item.day.toLowerCase().includes(scheduleSearchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(scheduleSearchTerm.toLowerCase()) ||
      item.teacher.toLowerCase().includes(scheduleSearchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(scheduleSearchTerm.toLowerCase())
    );

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1a237e]">Timetable Management</h2>
          <button 
            onClick={() => setIsNewScheduleOpen(true)}
            className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f] flex items-center gap-2"
          >
            <PlusCircle size={18} />
            New Schedule
          </button>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
              <div className="relative flex-1 w-full md:w-auto">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search schedules..." 
                  className="w-full p-2 pl-10 border rounded-lg"
                  value={scheduleSearchTerm}
                  onChange={(e) => setScheduleSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-[#1a237e]">All</button>
                <button className="text-[#1a237e] border-l-2 pl-4 border-gray-200">Current</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e8eaf6]">
                  <tr>
                    <th className="p-4 text-left text-[#1a237e]">Day</th>
                    <th className="p-4 text-left text-[#1a237e]">Time</th>
                    <th className="p-4 text-left text-[#1a237e]">Subject</th>
                    <th className="p-4 text-left text-[#1a237e]">Teacher</th>
                    <th className="p-4 text-left text-[#1a237e]">Room</th>
                    <th className="p-4 text-left text-[#1a237e]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTimetable.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4 text-[#1a237e] font-medium">{item.day}</td>
                      <td className="p-4 text-[#1a237e]">{item.time}</td>
                      <td className="p-4 text-[#1a237e]">{item.subject}</td>
                      <td className="p-4 text-[#1a237e]">{item.teacher}</td>
                      <td className="p-4 text-[#1a237e]">{item.room}</td>
                      <td className="p-4 flex gap-4">
                        <button className="text-[#1a237e] hover:text-[#303f9f]">
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteSchedule(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
        </div>

        {/* New Schedule Modal */}
        {isNewScheduleOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a237e]">Add New Schedule</h3>
                <button onClick={() => setIsNewScheduleOpen(false)} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#1a237e] mb-1">Day</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Time Slot</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                  >
                    {['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', 
                      '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newSchedule.subject}
                    onChange={(e) => setNewSchedule({...newSchedule, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Teacher</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newSchedule.teacher}
                    onChange={(e) => setNewSchedule({...newSchedule, teacher: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[#1a237e] mb-1">Room</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={newSchedule.room}
                    onChange={(e) => setNewSchedule({...newSchedule, room: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setIsNewScheduleOpen(false)}
                    className="px-4 py-2 border border-[#1a237e] text-[#1a237e] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddSchedule}
                    className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f]"
                  >
                    Add Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-20 lg:w-64 h-screen bg-white shadow-xl fixed left-0">
        <div className="p-4 mb-8 flex items-center justify-center lg:justify-start">
          <Settings className="text-[#1a237e]" size={24} />
          <h1 className="text-xl font-bold text-[#1a237e] ml-3 hidden lg:block">Admin Portal</h1>
        </div>
  
        <nav className="flex-1 space-y-2 px-2">
          {[
            { icon: BarChart3, label: 'Overview' },
            { icon: GraduationCap, label: 'Students' },
            { icon: Users, label: 'Teachers' },
            { icon: School, label: 'Exam Rooms' },
            { icon: Calendar, label: 'Timetable' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeTab === label.toLowerCase() 
                  ? 'bg-[#1a237e] text-white shadow-md'
                  : 'text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm'
              }`}
              onClick={() => setActiveTab(label.toLowerCase())}
            >
              <Icon size={20} className="mx-auto lg:mx-0" />
              <span className="font-medium hidden lg:block">{label}</span>
            </button>
          ))}
        </nav>
  
        {/* Logout button pinned to bottom */}
        <div className="p-4 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-2 p-3 rounded-xl text-[#1a237e] hover:bg-[#e8eaf6] transition-all"
          >
            <LogOut size={20} className="mx-auto lg:mx-0" />
            <span className="font-medium hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
  
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="w-64 bg-white h-screen p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Settings className="text-[#1a237e]" size={24} />
                <h1 className="text-xl font-bold text-[#1a237e]">Admin Portal</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2 flex-1">
              {[
                { icon: BarChart3, label: 'Overview' },
                { icon: GraduationCap, label: 'Students' },
                { icon: Users, label: 'Teachers' },
                { icon: School, label: 'Exam Rooms' },
                { icon: Calendar, label: 'Timetable' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    activeTab === label.toLowerCase() 
                      ? 'bg-[#1a237e] text-white shadow-md'
                      : 'text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setActiveTab(label.toLowerCase());
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
  
            {/* Mobile logout at bottom */}
            <div className="pt-4 pb-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 p-3 text-[#1a237e] hover:bg-[#e8eaf6] rounded-xl"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Main Content */}
      <div className="md:ml-20 lg:ml-64 flex-1">
        <div className="flex justify-between items-center p-6">
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-[#1a237e]">
              <Menu size={24} />
            </button>
          </div>
          <div className="flex-1 ml-4 md:ml-0">
            <h1 className="text-2xl font-bold text-[#1a237e] capitalize">{activeTab}</h1>
            <p className="text-gray-500">Welcome,{user.name}</p>
          </div>          
        </div>
  
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'teachers' && renderTeachers()}
        {activeTab === 'exam rooms' && renderExamRooms()}
        {activeTab === 'timetable' && renderTimetable()}
      </div>
    </div>
  );
  

};

export default AdminDashboard;