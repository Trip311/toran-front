/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import styles from './signup.module.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
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
            toast.success('Signup successful!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch(error: unknown) {
            toast.error('Signup failed');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.signupBox}>
                <h2>Sign up</h2>
                <form onSubmit={handleSignup}>
                    <label>Username:</label>
                        <input type="text" 
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required/>
                    <label>Password:</label>
                        <input type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required/>
                    <label>Date of birth:</label>
                        <input type="date"
                            value={dateOfBirth}
                            className={styles.datePicker}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required/>
                    <fieldset>
                        <legend>Gender</legend>
                            <label>
                                <input
                                 type="radio"
                                 name="gender"
                                 value="male" 
                                 checked={gender === 'male'} 
                                 onChange={(e) => setGender(e.target.value)}>
                                </input>
                                Male
                            </label>
                            <label>
                                <input 
                                type="radio" 
                                name="gender" 
                                value="female" 
                                checked={gender === 'female'} 
                                onChange={(e) => setGender(e.target.value)}>
                                </input>
                                Feamle
                            </label>
                            <label>
                                <input 
                                type="radio" 
                                name="gender" 
                                value="other" 
                                checked={gender === 'other'} 
                                onChange={(e) => setGender(e.target.value)}>
                                </input>
                                Other
                            </label>
                    </fieldset>
                    <button type="submit">Sign up</button>
                    <button type="button" onClick={() => navigate('/')}>Back</button>      
                </form>
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
        </div>
    )
}

export default Signup;