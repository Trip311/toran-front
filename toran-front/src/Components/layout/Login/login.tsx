/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './login.module.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Login: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            })
            console.log(res.data);
            toast.success('Login successful!');
            localStorage.setItem('username', username);
            navigate('/home');
        } catch(error: unknown) {
            toast.error('Login failed');
        }
    }
        return (
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <button type="submit">Login</button>
                    </form>
                </div>
                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />

            </div>
        )
    
}

export default Login