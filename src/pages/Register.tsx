import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const registerMutation = useMutation<
    AxiosResponse<RegisterResponse>,
    Error,
    RegisterPayload
  >({
    mutationFn: (data: RegisterPayload) =>
      api.post<RegisterResponse>('/api/auth/register', data),

    onSuccess: () => {
      navigate('/login');
    },

    onError: (err: unknown) => {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Register failed');
      }
    },
  });

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white px-4'>
      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          registerMutation.mutate({ name, email, password });
        }}
        className='w-full max-w-sm bg-white'
      >
        {/* Logo + Brand */}
        <div className='flex items-center gap-2 mb-10'>
          <img src='/navbar.png' alt='Booky Logo' className='w-8 h-8' />
          <h1 className='text-2xl font-bold text-black'>Booky</h1>
        </div>

        <h2 className='text-2xl font-semibold mb-1 text-gray-900'>Register</h2>
        <p className='text-sm text-gray-500 mb-6'>
          Create your account to start borrowing books.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          className='border p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
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
          Submit
        </button>

        <p className='text-sm text-gray-600 text-center mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
