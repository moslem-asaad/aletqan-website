import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage/Home';
import Login from './components/LoginPage/Login';
import Register from './components/RegisterPage/Register';
import TeacherHome from './components/Teacher/TeacherHome';
import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthProvider } from './context/AuthContext ';
import TeacherCourseDetails from './components/Teacher/TeacherCourseDetails';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/teacher"
            element={<ProtectedRoute element={TeacherHome} allowedRole="TEACHER" />}
          />
          <Route
            path="/teacher/course/:id"
            element={<ProtectedRoute element={TeacherCourseDetails} allowedRole="TEACHER" />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App;
