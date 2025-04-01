import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './A/Home';

import Admin from './A/Admin/Admin';
import Login from './A/Login';

import N404 from './A/N404';
import UnauthorizedPage from './A/UnauthorizedPage'; 
import StaffManagement from './A/StaffManagement';
import PrisonManager from './A/PrisonManager';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return token && allowedRoles.includes(userRole) ? element : <Navigate to="/unauthorized" />;
};

function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager" element={ <ProtectedRoute element={ <PrisonManager />}  allowedRoles={['Prison Manager']}/> } />
        <Route path='/staff' element={<ProtectedRoute element={<StaffManagement/>} allowedRoles={['Staff Member']} />}/>
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} allowedRoles={['Admin']} />} />
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path='*' element={<N404 />} />
      </Routes>
    </Router>
  );
}




export default App1;
