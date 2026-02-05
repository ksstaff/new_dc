
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Requirements: ks.staff00@gmail.com / 8999 (as per final notice)
    if (email === 'ks.staff00@gmail.com' && (password === '8999' || password === 'ks15518891')) {
      sessionStorage.setItem('adminAuthed', 'true');
      navigate('/admin');
    } else {
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl">A</div>
          <h1 className="text-2xl font-bold">관리자 시스템 접속</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">권한이 있는 사용자만 접근 가능합니다.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">이메일 주소</label>
            <input
              type="email"
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="ks.staff00@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">비밀번호</label>
            <input
              type="password"
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
            로그인하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
