'use client';

import React, { useState } from 'react';
import { Building2, ArrowRight, AlertCircle, UserCircle2, KeyRound, ArrowLeft, Mail, Lock } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('otp');
  const [step, setStep] = useState<1 | 2>(1);
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP state
  const [empId, setEmpId] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === 'admin@rsgl.com' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (empId.toUpperCase() === 'EMP-001' || empId.toUpperCase() === 'EMP-002') {
        setStep(2);
        setIsLoading(false);
      } else {
        setError('Employee ID not found. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (otp === '1234') {
        onLogin();
      } else {
        setError('Invalid OTP. Please enter the code sent to your mobile.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setError('');
  };

  const toggleMethod = (method: 'email' | 'otp') => {
    setLoginMethod(method);
    setStep(1);
    setError('');
    setOtp('');
    setEmpId('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8fd34f] dark:bg-[#1a3a0e] relative overflow-hidden">
      
      {/* Background Decor Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Login Card */}
      <div className="w-full max-w-md flex flex-col rounded-[2.5rem] bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800/50 z-10 m-4 p-8 sm:p-12 relative">
        
        {/* Branding (Always visible) */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="bg-[#1a3b38] dark:bg-emerald-500 p-2.5 rounded-xl shadow-lg">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">RSGL</span>
        </div>

        {/* Step 1: Input (Email OR Emp ID) */}
        {step === 1 && (
          <div className="animate-fade-in-right">
            
            {/* Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-8">
              <button 
                onClick={() => toggleMethod('otp')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginMethod === 'otp' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Employee ID & OTP
              </button>
              <button 
                onClick={() => toggleMethod('email')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Email Address
              </button>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {loginMethod === 'otp' ? 'Enter your Employee ID to receive an OTP.' : 'Enter your credentials to access your account.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* OTP Flow - Step 1 */}
            {loginMethod === 'otp' ? (
              <form onSubmit={handleRequestOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserCircle2 className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#1a3b38] focus:bg-white dark:focus:border-emerald-500 transition-all uppercase"
                      placeholder="e.g. EMP-001"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !empId}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Request OTP
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Email Flow */
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#1a3b38] focus:bg-white dark:focus:border-emerald-500 transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs font-bold text-blue-600 dark:text-emerald-400 hover:underline">Forgot?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#1a3b38] focus:bg-white dark:focus:border-emerald-500 transition-all"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 2: OTP Verification (Only reachable in OTP flow) */}
        {step === 2 && loginMethod === 'otp' && (
          <div className="animate-fade-in-left">
            <button onClick={handleBack} className="absolute top-8 left-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="mb-10 text-center mt-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Enter OTP</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                We've sent a 4-digit code to your registered mobile number for <span className="font-bold text-slate-700 dark:text-slate-200">{empId.toUpperCase()}</span>.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center block">One Time Password</label>
                <div className="relative max-w-[200px] mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // only allow numbers
                    className="w-full pl-11 pr-4 py-4 text-center text-2xl tracking-[0.5em] bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-black focus:outline-none focus:border-[#1a3b38] focus:bg-white dark:focus:border-emerald-500 transition-all"
                    placeholder="••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otp.length !== 4}
                className="w-full flex items-center justify-center gap-2 bg-[#1a3b38] hover:bg-[#122e2b] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button type="button" className="text-xs font-bold text-slate-400 hover:text-[#1a3b38] dark:hover:text-emerald-400 transition-colors">
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Demo Hint & Credits */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-4">
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            <span className="font-bold text-slate-500">OTP Demo:</span> Emp ID: <span className="font-bold text-slate-700 dark:text-slate-300">EMP-001</span> | OTP: <span className="font-bold text-slate-700 dark:text-slate-300">1234</span><br/>
            <span className="font-bold text-slate-500">Email Demo:</span> <span className="font-bold text-slate-700 dark:text-slate-300">admin@rsgl.com</span> | Pass: <span className="font-bold text-slate-700 dark:text-slate-300">admin123</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            DESIGNED & DEVELOPED BY <span className="text-purple-600 dark:text-purple-400 capitalize">Vjay Software PVT Ltd.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
