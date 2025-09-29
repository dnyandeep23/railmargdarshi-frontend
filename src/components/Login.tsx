import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (role: string) => void;
}

const sampleUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', label: 'Admin' },
  { username: 'stationmaster', password: 'sm123', role: 'stationmaster', label: 'Station Master' },
  { username: 'signalcontroller', password: 'sc123', role: 'signalcontroller', label: 'Signal Controller' },
  { username: 'user', password: 'user123', role: 'user', label: 'User' }
];


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);
  const navigate = useNavigate();

  // Autofill when role changes
  useEffect(() => {
    setUsername(sampleUsers[selectedRoleIdx].username);
    setPassword(sampleUsers[selectedRoleIdx].password);
  }, [selectedRoleIdx]);

  const handleSampleClick = (idx: number) => {
    setSelectedRoleIdx(idx);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.role);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center w-full justify-center min-w-screen  min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">RailMargdarshi Login</h2>
          <p className="text-gray-500 text-center mb-4">Sign in to your account</p>
        </div>
        {/* Sliding Role Selector */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-xs">
            <div className="flex bg-gray-100 rounded-lg overflow-hidden shadow">
              {sampleUsers.map((user, idx) => (
                <button
                  key={user.role}
                  type="button"
                  className={`flex-1 py-2 px-2 text-sm font-semibold transition-all duration-300 focus:outline-none
                    ${selectedRoleIdx === idx ? 'bg-blue-600 text-white scale-105 shadow-lg' : 'bg-gray-100 text-blue-700 hover:bg-blue-200'}`}
                  onClick={() => handleSampleClick(idx)}
                  style={{
                    transition: 'all 0.3s',
                  }}
                >
                  {user.label}
                </button>
              ))}
            </div>
            {/* Animated underline */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded transition-all duration-300"
              style={{
                width: `${100 / sampleUsers.length}%`,
                transform: `translateX(${selectedRoleIdx * 100 / sampleUsers.length}%)`,
              }}
            />
          </div>
        </div>
        {/* Sample credentials display */}
        <div className="flex justify-center gap-2 mb-4">
          {sampleUsers.map((user, idx) => (
            <button
              key={user.role + '-sample'}
              type="button"
              className={`border px-2 py-1 rounded text-xs font-mono transition-all duration-200
                ${selectedRoleIdx === idx ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50'}`}
              onClick={() => handleSampleClick(idx)}
            >
              {user.username} / {user.password}
            </button>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl px-8 py-8 flex flex-col gap-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-150 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && (
            <div className="text-red-600 text-center font-medium mt-2">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
