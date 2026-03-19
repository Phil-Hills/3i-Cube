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
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/assets/logo_3i_lambda.png" alt="3iΛ Logo" className="mx-auto h-24 w-auto mb-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">3iΛ</h2>
          <p className="mt-2 text-sm text-blue-400 font-medium tracking-wide uppercase">Powered by Q Protocol</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className={`rounded-md shadow-sm -space-y-px transition-transform ${error ? 'animate-shake' : ''}`}>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-800 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-colors"
            >
              Enter
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">Access Denied</p>
          )}
        </form>
      </div>
    </div>
  );
};
