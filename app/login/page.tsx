'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Optional: For redirecting after login
import Link from 'next/link'; // Optional: For a "Sign up" link
import { useDispatch } from "react-redux";
import { } from "@reduxjs/toolkit"
import { AuthData } from '@/lib/type';
import { setAuthUser } from '@/lib/store/states/sessionsSlice';

import React from 'react'
import { userLogin } from '../auth/actions';

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await userLogin({email, password});
        if (res) {
            console.log(res);
            dispatch(setAuthUser(res));
            router.push('/dashboard');
        } else {
            alert('Login failed');
        }
    }
  

  return (
    <>
    {/* make a basic login page */}
    <div>
        <h1>Login</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <p>Dont have an account? <Link href="/register">Sign up</Link></p>
    </div>
    </>
  )
}
