import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { setAuthToken } from '../api/axios';
import type { AuthState } from './slices/authSlice';
import type { CartState } from './slices/cartSlice';

// --- fungsi untuk load state dari localStorage ---
function loadState(): { auth: AuthState; cart: CartState } | undefined {
  try {
    const state = localStorage.getItem('reduxState');
    if (state) return JSON.parse(state) as { auth: AuthState; cart: CartState };
  } catch (e) {
    console.error('Load state error', e);
  }
  return undefined;
}

// --- fungsi untuk save state ke localStorage ---
function saveState(state: { auth: AuthState; cart: CartState }) {
  try {
    localStorage.setItem('reduxState', JSON.stringify(state));
  } catch (e) {
    console.error('Save state error', e);
  }
}

// --- bikin store ---
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState: loadState(),
});

// --- set token ke axios kalau ada ---
const savedToken = store.getState().auth.token;
if (savedToken) {
  setAuthToken(savedToken);
}

// --- subscribe supaya setiap perubahan disimpan ---
store.subscribe(() => {
  const state = store.getState();
  saveState({
    auth: state.auth,
    cart: state.cart,
  });
});

// ✅ perbaikan: pastikan RootState diexport
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
