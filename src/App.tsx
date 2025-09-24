import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Detail from './pages/Detail';
import BookList from './pages/BookList';
import MyCart from './pages/MyCart';
import Profile from './pages/Profile';
import CheckOut from './pages/Checkout';
import Success from './pages/Success';
import BorrowedList from './pages/BorrowedList';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className='flex-1'>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Book list + detail */}
          <Route path='/books' element={<BookList />} />
          <Route path='/books/:id' element={<Detail />} />

          {/* My Cart (protected) */}
          <Route
            path='/my-cart'
            element={
              <ProtectedRoute>
                <MyCart />
              </ProtectedRoute>
            }
          />

          {/* Checkout (protected) */}
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <CheckOut />
              </ProtectedRoute>
            }
          />

          {/* Success (protected) */}
          <Route
            path='/success'
            element={
              <ProtectedRoute>
                <Success />
              </ProtectedRoute>
            }
          />

          {/* Borrowed List (protected) */}
          <Route
            path='/borrowed-list'
            element={
              <ProtectedRoute>
                <BorrowedList />
              </ProtectedRoute>
            }
          />

          {/* Profile (protected) */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
