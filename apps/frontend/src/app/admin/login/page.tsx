'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

 const handleLogin = async () => {
  try {
    const res = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', res.data.access_token); // ✅
    document.cookie = `token=${res.data.access_token}; path=/`;

    router.push('/admin/dashboard');
  } catch {
    alert('Invalid credentials');
  }
};


  return (
    <div>
      <h1>Login Admin</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
