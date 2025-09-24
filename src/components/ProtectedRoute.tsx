import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { ReactNode } from 'react'; // ⬅ pakai type-only import

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to='/login' replace />;
  return <>{children}</>;
}
