import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/authSlice';
import { useToast } from '../context/ToastContext';
import { CheckSquare, User, Mail, Lock, Loader2 } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearAuthError());
    }
  }, [error, dispatch, showToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});

    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    dispatch(registerUser({ fullName, email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        showToast('Registered successfully!', 'success');
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-xl shadow-indigo-500/20">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Get started by creating your account
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full rounded-xl border bg-slate-950/40 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all ${validationErrors.fullName ? 'border-rose-500/50' : 'border-slate-800 focus:border-slate-700'}`}
                />
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
              {validationErrors.fullName && (
                <span className="text-xs text-rose-400 mt-1 block">{validationErrors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full rounded-xl border bg-slate-950/40 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all ${validationErrors.email ? 'border-rose-500/50' : 'border-slate-800 focus:border-slate-700'}`}
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
              {validationErrors.email && (
                <span className="text-xs text-rose-400 mt-1 block">{validationErrors.email}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-1.5">
                Password (min. 6 chars)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-950/40 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all ${validationErrors.password ? 'border-rose-500/50' : 'border-slate-800 focus:border-slate-700'}`}
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
              {validationErrors.password && (
                <span className="text-xs text-rose-400 mt-1 block">{validationErrors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-950/40 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-550 transition-all ${validationErrors.confirmPassword ? 'border-rose-500/50' : 'border-slate-800 focus:border-slate-700'}`}
                />
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              </div>
              {validationErrors.confirmPassword && (
                <span className="text-xs text-rose-400 mt-1 block">{validationErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-violet-550 hover:to-indigo-550 focus:outline-none focus:ring-2 focus:ring-indigo-550 active:scale-95 disabled:opacity-50 transition-all cursor-pointer font-bold"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-400">Already have an account? </span>
          <Link
            to="/login"
            className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
