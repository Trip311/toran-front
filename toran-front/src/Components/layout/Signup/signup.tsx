/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from './signup.module.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Toast from "../Toast";

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [toast, setToast] = useState<{ message: string;type: 'success' | 'error' } | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            setToast({ message: 'Password must be at least 6 chracters long', type: 'error'})
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                password,
                dateOfBirth,
                gender
            })
            console.log(res.data);
            setToast({ message: 'Signup successful!', type: 'error'});
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch(error: unknown) {
            setToast({ message: 'Signup failed', type: 'error'})
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.signupBox}>
                <h2>Sign up</h2>
                <form onSubmit={handleSignup}>
                    <label>Username:</label>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <label>Password:</label>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <label>Date of birth:</label>
                        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required/>
                    <fieldset>
                        <legend>Gender</legend>
                            <label>
                                <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)}></input>
                                Male
                            </label>
                            <label>
                                <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)}></input>
                                Feamle
                            </label>
                            <label>
                                <input type="radio" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)}></input>
                                Other
                            </label>
                    </fieldset>
                    <button type="submit">Sign up</button>
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

export default Signup