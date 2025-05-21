/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './login.module.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'} | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            })
            console.log(res.data);
            setToast({ message: 'Login successful!', type: 'success'})
            localStorage.setItem('username', username);
            navigate('/home');
        } catch(error: unknown) {
            setToast({ message: 'Login fialed', type: 'error'});
        }
    }
        return (
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <button type="submit">Login</button>

                        {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)} 
                            />
                        )}
                    </form>
                    
                </div>

            </div>
        )
    
}

export default Login