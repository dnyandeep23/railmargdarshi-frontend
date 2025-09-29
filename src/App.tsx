import { UserProvider, useUser } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import TrainDetails from './pages/TrainDetails';
import TrafficMap from './pages/TrafficMap';
import Reports from './pages/Reports';
import RoleAccess from './pages/RoleAccess';
import Logout from './pages/Logout';

function AppContent() {
  const { user, setUser } = useUser();
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!user ? (
          <main className="flex items-center justify-center h-screen">
            <Login onLogin={role => setUser({ username: '', role })} />
          </main>
        ) : (
          <>
            <Navbar currentRole={user.role}
            // onRoleChange={role => setUser({ ...user, role })} 
            />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Dashboard currentRole={user.role} />} />
                <Route path="/trains" element={<TrainDetails currentRole={user.role} />} />
                <Route path="/map" element={<TrafficMap currentRole={user.role} />} />
                <Route path="/reports" element={<Reports currentRole={user.role} />} />
                <Route path="/roles" element={<RoleAccess currentRole={user.role} />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;