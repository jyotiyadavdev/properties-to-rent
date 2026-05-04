import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signin, isAuthenticated, signup } from '../../utils/api';
import { Home, Lock, Mail, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await signin({ email, password });
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid') || error.message.includes('credentials')) {
        toast.error('Invalid email or password. Please check your credentials or sign up first.');
      } else {
        toast.error(error.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    const defaultEmail = 'admin@homeverse.com';
    const defaultPassword = 'Admin@123456';
    
    setLoading(true);
    try {
      console.log('🚀 Starting Quick Setup...');
      
      // Try to create account first
      const signupResponse = await signup({
        email: defaultEmail,
        password: defaultPassword,
        name: 'Admin User'
      });
      
      console.log('✅ Signup response:', signupResponse);
      toast.success('Default admin account created successfully!');
      
      // Auto-fill the form
      setEmail(defaultEmail);
      setPassword(defaultPassword);
      setSetupMode(true);
      
      toast.info('Now click "Sign In" to login', { duration: 5000 });
    } catch (error: any) {
      console.error('❌ Quick setup error:', error);
      
      // If account already exists, just show credentials
      if (error.message.includes('already') || error.message.includes('exists') || error.message.includes('duplicate')) {
        toast.warning('Account already exists! Using existing account.', { duration: 4000 });
        setEmail(defaultEmail);
        setPassword(defaultPassword);
        setSetupMode(true);
      } else {
        toast.error(`Setup failed: ${error.message}. Please try Sign Up instead.`, { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002b5b] to-[#003d7a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-white">
            <Home className="text-[#f97316]" size={40} />
            <span>ROM</span>
          </Link>
          <p className="text-gray-300 mt-2">Admin Panel Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#002b5b]">Welcome Back!</h2>
            <p className="text-gray-600">Sign in to manage your properties</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f97316] text-white py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
            
            <Link 
              to="/admin/signup" 
              className="w-full block text-center bg-white border-2 border-[#f97316] text-[#f97316] py-3 rounded-lg font-semibold hover:bg-[#f97316] hover:text-white transition"
            >
              Create Admin Account
            </Link>

            <Link to="/" className="block text-center text-[#f97316] hover:underline text-sm font-semibold mt-4">
              ← Back to Website
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-300 text-sm mt-6">
          © 2026 ROM - Rentals On Market. All rights reserved.
        </p>
      </div>
    </div>
  );
}