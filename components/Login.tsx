import React, { useState } from 'react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple SHA-256 hash using Web Crypto API
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Default hash for 'password' if env var is not set
    const expectedHash = import.meta.env.VITE_APP_PASSWORD_HASH || '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; 
    
    if (hashHex === expectedHash) {
      sessionStorage.setItem('isAuthenticated', 'true');
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 selection:bg-sky-500/30">
      <div className="max-w-md w-full space-y-8 bg-[#0a0a0a] p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"></div>
        <div className="text-center">
          <div className="mx-auto h-16 w-16 mb-6 flex items-center justify-center rounded-2xl bg-[#050505] border border-white/5 shadow-inner">
             <svg className="w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
          </div>
          <h2 className="mt-2 text-2xl font-mono tracking-widest text-zinc-100 uppercase">Q Protocol</h2>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-widest text-sky-400/80">SlideBook™ Integration</p>
        </div>
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className={`rounded-md shadow-sm -space-y-px transition-transform ${error ? 'animate-shake' : ''}`}>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-white/10 bg-[#050505] placeholder-zinc-600 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:z-10 sm:text-sm font-mono shadow-inner transition-colors"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-[13px] font-mono uppercase tracking-wider rounded-lg text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-[#050505] transition-all duration-200 shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              Initialize Session
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-[11px] font-mono uppercase tracking-widest text-center mt-4">Access Denied</p>
          )}
        </form>
      </div>
    </div>
  );
};
