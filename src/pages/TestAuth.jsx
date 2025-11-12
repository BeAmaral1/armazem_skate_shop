import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestAuth = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">🔍 Debug Auth</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Loading:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify(loading, null, 2)}
            </pre>
          </div>

          <div>
            <strong>User:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div>
            <strong>LocalStorage - user:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              {localStorage.getItem('user') || 'null'}
            </pre>
          </div>

          <div>
            <strong>SessionStorage - user:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              {sessionStorage.getItem('user') || 'null'}
            </pre>
          </div>

          <div>
            <strong>LocalStorage - token:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              {localStorage.getItem('token') ? 'EXISTS' : 'null'}
            </pre>
          </div>

          <div>
            <strong>SessionStorage - token:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1">
              {sessionStorage.getItem('token') ? 'EXISTS' : 'null'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
