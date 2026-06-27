import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { authService } from '../services';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Steps: 'email' → 'otp' → 'success'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setStep('otp');
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ────────────────────────────────────────────
  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Input Handling ────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ─── Step 2: Verify OTP & Reset Password ───────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(otpCode, password, email);
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 transition-colors duration-300">
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8"
      >
        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Enter Email ─────────────────────────── */}
          {step === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 text-teal-600 dark:text-teal-400 mb-4">
                  <FaEnvelope className="text-xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Wibagiwe Ijambo Ryibanga?</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  Andika email yawe, turakoherereza code yo guhindura.
                </p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/50 text-sm font-medium text-center">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      id="reset-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                      placeholder="champion@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Tegereza...
                    </>
                  ) : 'Ohereza Code'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-semibold transition-colors inline-flex items-center gap-2">
                  <FaArrowLeft className="text-xs" /> Subira inyuma
                </Link>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Enter OTP + New Password ────────────── */}
          {step === 'otp' && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
                  <FaLock className="text-xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Injiza Code</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  Twakoherereje code kuri <span className="font-bold text-teal-600 dark:text-teal-400">{email}</span>
                </p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/50 text-sm font-medium text-center">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* OTP Input Boxes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                    Code (6 digits)
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 text-center text-xl font-black rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-transparent/70 text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ijambo ryibanga rishya
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                      placeholder="Nibura inyuguti 6..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Tegereza...
                    </>
                  ) : 'Hindura Ijambo Ryibanga'}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="mt-5 text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-slate-400">
                    Ohereza nanone muri <span className="font-bold text-teal-600">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    Ohereza code nshya
                  </button>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setStep('email'); setError(''); setOtp(['', '', '', '', '', '']); setPassword(''); }}
                  className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <FaArrowLeft className="text-xs" /> Hindura email
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Success ──────────────────────────────── */}
          {step === 'success' && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-500 mb-5">
                <FaCheckCircle className="text-3xl" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Byagenze neza! 🎉</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Ijambo ryibanga ryahinduwe neza. Ushobora kwinjira ukoresheje ijambo rishya.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Jya ku Kwinjira
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
