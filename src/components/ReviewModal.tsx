import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAppSelector } from '../store/hooks';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  bookId: number;
  onUpdated?: () => void; // 🔄 refresh parent
}

interface Review {
  id: number;
  userId: number;
  star: number;
  comment: string;
}

interface ApiResponse<T = unknown> {
  data?: T;
}

export default function ReviewModal({
  open,
  onClose,
  bookId,
  onUpdated,
}: ReviewModalProps) {
  const auth = useAppSelector((s) => s.auth);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);

  // Reset state ketika modal ditutup
  useEffect(() => {
    if (!open) {
      setStar(0);
      setComment('');
      setMyReview(null);
    }
  }, [open]);

  // Ambil review user untuk bookId
  useEffect(() => {
    if (!open || !auth.token) return;

    let cancelled = false;

    const fetchMyReview = async () => {
      try {
        const res = await api.get<ApiResponse<{ reviews?: Review[] }>>(
          `/api/reviews/book/${bookId}`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        if (cancelled) return;

        const reviews = res.data?.data?.reviews ?? [];
        const mine = reviews.find((r) => r.userId === auth.user?.id);

        if (mine) {
          setMyReview(mine);
          setStar(mine.star ?? 0);
          setComment(mine.comment ?? '');
        }
      } catch (err) {
        console.warn('⚠️ Gagal fetch review user:', err);
      }
    };

    fetchMyReview();

    return () => {
      cancelled = true;
    };
  }, [open, bookId, auth.token, auth.user?.id]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!auth.token) {
      alert('⚠️ Kamu harus login dulu untuk memberi review');
      return;
    }
    if (!star) {
      alert('⚠️ Rating harus diisi');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        bookId: Number(bookId),
        star,
        comment,
      };

      const res = await api.post('/api/reviews', payload, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Review saved:', res.data);
      alert(
        myReview ? '✅ Review berhasil diperbarui' : '✅ Review berhasil dibuat'
      );

      onClose();
      onUpdated?.();
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error(
        '❌ Gagal simpan review',
        error.response?.data || error.message
      );
      alert(
        `Gagal simpan review: ${
          error.response?.data?.message || 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auth.token || !myReview) {
      alert('⚠️ Tidak ada review yang bisa dihapus');
      return;
    }

    if (!confirm('Yakin mau hapus review ini?')) return;

    try {
      setLoading(true);
      await api.delete(`/api/reviews/${myReview.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      alert('🗑️ Review berhasil dihapus');
      onClose();
      onUpdated?.();
    } catch (err) {
      console.error('❌ Gagal hapus review', err);
      alert('Gagal hapus review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white w-[439px] h-[518px] rounded-lg shadow p-6 flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>
            {myReview ? 'Edit Review' : 'Give Review'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-800'
          >
            ✕
          </button>
        </div>

        <p className='text-sm font-medium mb-2'>Give Rating</p>
        <div className='flex gap-2 mb-4'>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setStar(n)}
              className={`cursor-pointer text-3xl ${
                n <= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder='Please share your thoughts about this book'
          className='flex-1 border rounded p-3 text-sm resize-none'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className='flex gap-2 mt-4'>
          {myReview && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50'
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Sending...' : myReview ? 'Update' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
