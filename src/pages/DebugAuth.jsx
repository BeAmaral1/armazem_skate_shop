import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DebugAuth = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog('Componente montado');
    addLog(`Loading: ${loading}`);
    addLog(`User: ${user ? user.email : 'NULL'}`);
    addLog(`User Role: ${user?.role || 'NULL'}`);
    addLog(`isAuthenticated: ${isAuthenticated()}`);
    addLog(`localStorage user: ${localStorage.getItem('user') ? 'EXISTS' : 'NULL'}`);
    addLog(`sessionStorage user: ${sessionStorage.getItem('user') ? 'EXISTS' : 'NULL'}`);
  }, [user, loading]);

  const handleNavigateAdmin = () => {
    addLog('Tentando navegar para /admin...');
    setTimeout(() => {
      navigate('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Debug de Autenticação</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Estado Atual:</h2>
            <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify({
                loading,
                isAuthenticated: isAuthenticated(),
                user: user ? {
                  email: user.email,
                  role: user.role,
                  name: user.name
                } : null
              }, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Storage:</h2>
            <div className="text-sm space-y-2">
              <div>
                <strong>localStorage user:</strong>
                <div className="bg-gray-50 p-2 rounded mt-1 text-xs break-all max-h-32 overflow-auto">
                  {localStorage.getItem('user') || 'NULL'}
                </div>
              </div>
              <div>
                <strong>sessionStorage user:</strong>
                <div className="bg-gray-50 p-2 rounded mt-1 text-xs break-all max-h-32 overflow-auto">
                  {sessionStorage.getItem('user') || 'NULL'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-2">Logs:</h2>
          <div className="bg-gray-50 p-4 rounded max-h-64 overflow-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-sm font-mono">{log}</div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleNavigateAdmin}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Navegar para /admin
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Ir para Login
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              addLog('Storage limpo!');
              window.location.reload();
            }}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Limpar Storage e Recarregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
