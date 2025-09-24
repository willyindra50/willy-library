import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import api, { setAuthToken } from '../api/axios';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loginMutation = useMutation<
    AxiosResponse<LoginResponse>,
    Error,
    LoginPayload
  >({
    mutationFn: (data: LoginPayload) =>
      api.post<LoginResponse>('/api/auth/login', data),

    onSuccess: (res) => {
      const { token, user } = res.data.data;
      dispatch(setCredentials({ token, user }));
      setAuthToken(token);
      navigate('/books');
    },

    onError: (err: unknown) => {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Login failed');
      }
    },
  });

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white px-4'>
      {/* Logo + Brand */}
      <div className='flex items-center gap-2 mb-10'>
        <img src='/navbar.png' alt='Booky Logo' className='w-8 h-8' />
        <h1 className='text-2xl font-bold text-black'>Booky</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginMutation.mutate({ email, password });
        }}
        className='w-full max-w-sm bg-white'
      >
        <h2 className='text-2xl font-semibold mb-1 text-gray-900'>Login</h2>
        <p className='text-sm text-gray-500 mb-6'>
          Sign in to manage your library account.
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='border p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition'
        >
          Login
        </button>

        <p className='text-sm text-gray-600 text-center mt-4'>
          Don’t have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:underline'>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
