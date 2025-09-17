"use client"

import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'

export default function page() {

  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login')
      return;
    }

    try {

      const decode = jwt.decode(token)
      setUser(decode)

    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }

  }, [])


  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };




  return (
    <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden h-screen">
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/30 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-400/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600 to-pink-500 rounded-full translate-x-20 translate-y-20"></div>

      <div className="text-center text-white z-10">
        <h1 className="text-4xl font-bold mb-4">WELCOME!</h1>
        <p className="text-lg mb-8 opacity-90">{user?.email}</p>

        <button onClick={logout} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold cursor-pointer">
          LOG OUT
        </button>

      </div>
    </div>
  )
}

