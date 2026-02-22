import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/auth';
import { Mail, Lock, Eye, EyeOff, Sparkles, User, BookOpen, ArrowRight } from 'lucide-react';


/**
 * Login page component.
 *
 * Allows users to sign in with their email and password.
 * On successful login:
 *   - Stores JWT token via authService
 *   - Redirects to the journal list page (/journals)
 * On failure:
 *   - Displays backend error message (if available) or generic fallback
 *
 * Features:
 * - Form validation (HTML5 required)
 * - Loading/disabled state during submission
 * - Error message display
 * - Link to registration page
 */

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email.trim(), password);
      navigate('/journals');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0a10] text-white">
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-[#1a0b2e]">
        {/* Subtle Background Image/Gradient */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4c1d95]/40 to-[#1a0b2e]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Cultivate your inner sanctuary.</h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-12">
            Ruminarium is a serene space designed for mindful reflection and the art of intentional journaling.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-left">
              <User className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-semibold text-sm">Mindful Space</h4>
              <p className="text-xs text-gray-400">Distraction-free interface for deep thought.</p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-left">
              <BookOpen className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="font-semibold text-sm">Daily Prompts</h4>
              <p className="text-xs text-gray-400">Curated reflections to spark your journey.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Continue your journey of mindful reflection.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#1a191f] border border-gray-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link to="#" className="text-sm text-purple-400 hover:text-purple-300 transition">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1a191f] border border-gray-800 rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-800 bg-[#1a191f] text-purple-600 focus:ring-purple-500" />
              <label htmlFor="remember" className="text-sm text-gray-400">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
              <div className="relative text-xs text-gray-500 uppercase bg-[#0b0a10] px-2 inline-block">Or continue with</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-800 rounded-xl hover:bg-white/5 transition font-medium text-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-800 rounded-xl hover:bg-white/5 transition font-medium text-sm">
                <img src="https://www.svgrepo.com/show/303108/apple-black-logo.svg" className="w-4 h-4 filter invert" alt="Apple" /> Apple
              </button>
            </div>

            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 font-bold hover:underline">Create an account</Link>
            </p>
          </div>

          <p className="mt-12 text-[10px] text-gray-600 tracking-widest text-center uppercase">
            © 2026 RUMINARIUM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;