/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import styles from './signup.module.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const navigate = useNavigate();

    // ✅ Use useMemo to memoize password checks
    const passwordChecks = useMemo(() => {
        return {
            hasMinLength: password.length >= 6,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    }, [password]);

    const isPasswordValid = useMemo(() => {
        return (
            passwordChecks.hasMinLength &&
            passwordChecks.hasUppercase &&
            passwordChecks.hasLowercase &&
            passwordChecks.hasSpecialChar
        );
    }, [passwordChecks]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error('Password does not meet all requirements.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                password,
                dateOfBirth,
                gender
            });
            toast.success('Signup successful!');
            setTimeout(() => navigate('/'), 2000);
        } catch (error: unknown) {
            toast.error('Signup failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.signupBox}>
                <h2>Sign up</h2>
                <form onSubmit={handleSignup}>
                    <label>Username:</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label>Password:</label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsPasswordFocused(true)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {isPasswordFocused && (
                        <div className={styles.passwordValidator}>
                            <p>Password must include:</p>
                            <ul>
                                <li>
                                    {passwordChecks.hasMinLength ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} Minimum 6 characters
                                </li>
                                <li>
                                    {passwordChecks.hasLowercase ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} One lowercase letter
                                </li>
                                <li>
                                    {passwordChecks.hasUppercase ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} One uppercase letter
                                </li>
                                <li>
                                    {passwordChecks.hasSpecialChar ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} One special character
                                </li>
                            </ul>
                        </div>
                    )}

                    <label>Date of birth:</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        className={styles.datePicker}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                    />

                    <fieldset>
                        <legend>Gender</legend>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={gender === 'other'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            Other
                        </label>
                    </fieldset>

                    <button type="submit">Sign up</button>
                    <button type="button" onClick={() => navigate('/')}>Back</button>
                </form>
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default Signup;
