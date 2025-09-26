import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TrainDetails from './pages/TrainDetails';
import TrafficMap from './pages/TrafficMap';
import Reports from './pages/Reports';
import RoleAccess from './pages/RoleAccess';

function App() {
  const [currentRole, setCurrentRole] = useState('traffic-manager');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentRole={currentRole} onRoleChange={setCurrentRole} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard currentRole={currentRole} />} />
            <Route path="/trains" element={<TrainDetails currentRole={currentRole} />} />
            <Route path="/map" element={<TrafficMap currentRole={currentRole} />} />
            <Route path="/reports" element={<Reports currentRole={currentRole} />} />
            <Route path="/roles" element={<RoleAccess currentRole={currentRole} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;