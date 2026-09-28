import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuroraBackground } from '../components/common/AuroraBackground';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Basic password strength hint
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password);
      toast.success('Account created successfully! Welcome to TradeVault.', 'Welcome Trader');
      navigate('/challenges');
    } catch (err) {
      console.error('Signup error:', err);
      const errMsg =
        err.response?.data?.error || err.message || 'Failed to create account';
      setError(errMsg);
      toast.error(errMsg, 'Signup Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 to-blue-600 p-[1.5px] shadow-navy mb-4">
            <div className="w-full h-full bg-[#fbfcfd] rounded-[14px] flex items-center justify-center shadow-inner">
              <Shield className="w-7 h-7 text-navy-950" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-wider text-slate-900 font-mono">
            TRADE<span className="text-aurora">VAULT</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Simulated Funded-Account Trading Challenges & Journal
          </p>
        </div>

        {/* Signup Card */}
        <Card padding="p-8" className="border-slate-200/90 shadow-xl bg-[#fbfcfd]/95 backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 font-mono">Create Trader Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Start your journey toward funded trader evaluation
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@tradevault.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full shadow-lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4">
              Log in to Terminal
            </Link>
          </div>
        </Card>
      </div>
    </AuroraBackground>
  );
};

export default SignupPage;
