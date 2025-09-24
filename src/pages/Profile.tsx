import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/axios';
import Loader from '../components/Loader';

interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: Profile;
    loanStats: LoanStats;
    reviewsCount: number;
  };
}

export default function Profile() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  const { data, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<ProfileResponse>('/api/me');
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className='flex justify-center p-6'>
        <div className='w-full max-w-[537px] text-center text-red-500'>
          Failed to load profile. Please login again.
        </div>
      </div>
    );
  }

  const user = data?.data?.profile;

  return (
    <div className='flex flex-col items-center p-6'>
      <div className='w-full max-w-[537px]'>
        {/* Judul pas di atas card */}
        <h2 className='text-2xl font-bold mb-4'>Profile</h2>

        <div className='bg-white rounded-2xl shadow p-6'>
          {user && (
            <div className='flex flex-col items-center'>
              {/* Avatar di atas */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random`}
                alt={user.name}
                className='w-20 h-20 rounded-full object-cover mb-4'
              />

              {/* Info */}
              <div className='w-full space-y-4'>
                <div className='flex justify-between text-sm sm:text-base'>
                  <span className='text-gray-600'>Name</span>
                  <span className='font-medium'>{user.name}</span>
                </div>
                <div className='flex justify-between text-sm sm:text-base'>
                  <span className='text-gray-600'>Email</span>
                  <span className='font-medium'>{user.email}</span>
                </div>
                <div className='flex justify-between text-sm sm:text-base'>
                  <span className='text-gray-600'>Nomor Handphone</span>
                  <span className='font-medium'>081234567890</span>
                </div>

                <button className='w-full mt-6 h-[48px] bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition'>
                  Update Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
