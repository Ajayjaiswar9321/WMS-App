import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  useEffect(() => {
    let timer: number;
    if (isLoading && loginProgress < 90) {
      timer = setInterval(() => {
        setLoginProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isLoading, loginProgress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoginProgress(0);

    try {
      const success = await login(email, password);
      if (success) {
        setLoginProgress(100);
        setTimeout(() => setIsSuccess(true), 200);
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
        setLoginProgress(0);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
      setLoginProgress(0);
    }
  };


  return (
    <div className={`h-full w-full bg-[#F5F5F7] dark:bg-gray-950 flex flex-col overflow-hidden relative transition-all duration-700 ${isSuccess ? 'scale-110 opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'}`}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Progress Bar (Visible when loading) */}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-blue-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${loginProgress}%` }}
            />
          </div>
        )}

        {/* Header Section */}
        <div className={`animate-scale-in text-center mb-6 transition-all duration-500 ${isLoading ? 'opacity-50 blur-[1px]' : ''}`}>
          {/* Logo with 3D context */}
          <div className="relative group perspective-1000 mb-4">
            <div className={`w-20 h-20 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-3d animate-float transition-all duration-500 ${isLoading ? 'animate-pulse scale-110' : ''}`}>
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-2xl font-black text-[#1e293b] dark:text-white tracking-tight mb-0.5">
            COMPRINT
          </h1>
          <p className="text-[10px] text-[#64748b] dark:text-gray-400 font-bold uppercase tracking-widest mb-3">
            Operations Management
          </p>
          <p className="text-xs text-[#475569] dark:text-gray-400 max-w-[250px] mx-auto leading-tight mb-6">
            Device Refurbishment & Repair Tracking System
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-10 mb-2">
            <div className="text-center">
              <p className="text-xl font-black text-emerald-600">5K+</p>
              <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter text-center">Devices</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-green-600">98%</p>
              <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter text-center">QC Rate</p>
            </div>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="mobile-card shadow-3d border-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="text-left mb-6">
                <h2 className="text-xl font-black text-[#1e293b] dark:text-white leading-tight mb-1">
                  Welcome Back
                </h2>
                <p className="text-xs font-medium text-[#64748b] dark:text-gray-400">
                  Enter your credentials to access the system
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <Label htmlFor="email" className="text-sm font-semibold text-[#374151] dark:text-gray-200 uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 px-4 rounded-xl border-[#D1D5DB] dark:border-gray-800 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-[#3B82F6] transition-all font-medium text-base shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Label htmlFor="password" className="text-sm font-semibold text-[#374151] dark:text-gray-200 uppercase tracking-wider">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 px-4 rounded-xl border-[#D1D5DB] dark:border-gray-800 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-[#3B82F6] transition-all font-medium text-base shadow-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl animate-shake">
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-base shadow-lg shadow-emerald-500/10 btn-3d animate-slide-up tracking-wider"
                  style={{ animationDelay: '0.5s' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-center w-full justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'SIGN IN'
                  )}
                </Button>
              </form>

              {/* Version & Credits */}
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                  v1.0.0-beta
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
