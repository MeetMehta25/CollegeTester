import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { UserCircle2, School, BookOpen, Users, ArrowRight, Lock, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleBack = () => {
    setSelectedRole(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        throw new Error('Username and password are required');
      }

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      if (!data.user || !data.user.role) {
        throw new Error('Incomplete user data received');
      }

      onLogin(data.user);

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-3"
      style={{ backgroundImage: 'url(/src/public/images/college_bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="bg-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 relative z-10 transform transition-transform duration-300 hover:scale-[1.015] hover:-translate-y-1">
        <div className="text-center mb-8">
          <div className="bg-[#e8eaf6] p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg">
            <School className="w-8 h-8 text-[#1a237e]" />
          </div>
          <h1 className="text-3xl font-bold mt-4 text-[#1a237e]">College Portal</h1>
          <p className="text-gray-1000 mt-2">
            {selectedRole 
              ? `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` 
              : 'Select your role to continue'}
          </p>
        </div>

        {!selectedRole ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { role: 'student', icon: BookOpen, label: 'Student' },
                { role: 'teacher', icon: UserCircle2, label: 'Teacher' },
                { role: 'admin', icon: Users, label: 'Admin' },
              ].map(({ role, icon: Icon, label }) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role as UserRole)}
                  className="flex items-center p-6 rounded-xl transition-all duration-200 bg-[#e8eaf6] text-[#1a237e] hover:bg-[#d5d8f0] hover:shadow-lg hover:scale-[1.02]"
                >
                  <Icon className="w-8 h-8 mr-4" />
                  <span className="text-lg font-medium">{label}</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1a237e] ml-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-[#1a237e] bg-white"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-[#1a237e] ml-1">Password</label>
                <a href="#" className="text-sm text-[#1a237e] hover:text-[#303f9f] font-medium">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-[#1a237e] bg-white"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-none flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-[#1a237e] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a237e] transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-[#1a237e] hover:bg-[#303f9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a237e] transition-all duration-200 relative overflow-hidden"
              >
                <span className={`transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Sign in
                </span>
                <ArrowRight className={`w-5 h-5 ml-2 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`} />

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
