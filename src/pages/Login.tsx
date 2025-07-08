import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Heart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GlassCard } from '../components/ui/glass-card';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast, Toaster } from 'sonner';
import { GoogleLogo } from '../google-logo';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Welcome back to CareLink AI!');
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        if (formData.name) {
          await updateProfile(userCredential.user, {
            displayName: formData.name
          });
        }

        toast.success('Account created successfully!');
        navigate('/');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = 'An error occurred';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google successfully!');
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success('Password reset email sent! Check your inbox.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-10 w-10 text-teal-500 group-hover:text-teal-400 transition-colors duration-300" />
              <div className="absolute -inset-1 bg-teal-500/20 rounded-full blur-sm group-hover:bg-teal-400/30 transition-all duration-300 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              CareLink AI
            </span>
          </Link>
        </div>

        <GlassCard className="p-8 backdrop-blur-lg">
          <div className="flex mb-6 p-1 bg-white/20 dark:bg-slate-800/20 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-teal-500'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${!isLogin
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-teal-500'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <span className="relative z-10">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2"
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <GoogleLogo className="h-5 w-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-teal-600 hover:text-teal-500 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            {isLogin && (
              <button
                onClick={handlePasswordReset}
                className="mt-2 text-sm text-teal-600 hover:text-teal-500 font-medium transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}