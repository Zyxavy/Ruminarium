import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth';
import { Mail, Lock, Sparkles, User, BookOpen, UserPlus } from 'lucide-react';

 /**
 * Registration page component.
 *
 * Allows new users to create an account with email and password.
 * On successful registration:
 *   - Calls authService.register()
 *   - Redirects to /login with a success message passed via navigation state
 * On failure:
 *   - Displays backend error detail (if available) or generic message
 *   - Shows client-side validation for password mismatch
 *
 * Features:
 * - Client-side password confirmation check
 * - Loading/disabled state during submission
 * - Error message display
 * - Link back to login page
 */

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await authService.register(email.trim(), password);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0a10] text-white">
      {/* Left Side: Branding (Shared with Login) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-[#1a0b2e]">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4c1d95]/40 to-[#1a0b2e]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-8">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">Begin your reflection.</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-12">
            Join a community dedicated to mindful growth and personal sanctuary.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-left">
              <User className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-semibold text-sm">Safe Haven</h4>
              <p className="text-xs text-gray-400">Your thoughts are private and encrypted.</p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-left">
              <BookOpen className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-semibold text-sm">Zen Interface</h4>
              <p className="text-xs text-gray-400">Designed to reduce digital noise.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-400">Start your journey of mindful reflection today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#1a191f] border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  required
                  className="w-full bg-[#1a191f] border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  required
                  className="w-full bg-[#1a191f] border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 font-bold hover:underline">Login here</Link>
            </p>
          </div>

          <p className="mt-12 text-[10px] text-gray-600 tracking-widest text-center uppercase">
            © 2024 RUMINARIUM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;