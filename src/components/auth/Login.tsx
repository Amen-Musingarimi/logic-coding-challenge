import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from 'aws-amplify/api';
import { LoginResponse } from './types';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await post({
        apiName: 'apilogin',
        path: '/login',
        options: {
          body: { username, password },
        },
      });

      const { body } = await response.response;
      const result = (await body.json()) as LoginResponse | null;

      if (!result) {
        setError('Invalid response from server');
        return;
      }

      if (result.error) {
        setError(result.error.message || 'Failed to login');
        return;
      }

      const { user } = result;

      localStorage.setItem('user', user);
      navigate('/user-details');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to login');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {error && (
          <div className="p-2 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block mb-2 text-lg font-bold text-gray-700 text-start"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-lg text-start font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-3 py-2 font-bold text-white bg-blue-950 rounded hover:bg-blue-900 focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
