/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './login.module.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isForgotMode, setIsForgotMode] = useState(false);

    // 👁 Add state for visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            toast.success('Login successful!');
            localStorage.setItem('username', username);
            navigate('/home');
        } catch (error: unknown) {
            toast.error('Login failed');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/change', {
                username,
                newPassword
            });
            toast.success('Password reset successful!');
            setIsForgotMode(false);
        } catch (error: unknown) {
            toast.error('Password reset failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <h2>{isForgotMode ? 'Reset Password' : 'Login'}</h2>
                <form onSubmit={isForgotMode ? handleResetPassword : handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {isForgotMode ? (
                        <>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label="Toggle new password visibility"
                                >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className={styles.passwordInput}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle confirm password visibility"
                                >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.passwordInput}>
                            <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    )}
                    <button type="submit">{isForgotMode ? 'Reset Password' : 'Login'}</button>
                    <button type="button" onClick={() => navigate('/')}>Back</button>
                </form>
                <p className={styles.forgotLink} onClick={() => setIsForgotMode(!isForgotMode)}>
                    {isForgotMode ? '← Back to Login' : 'Forgot Password?'}
                </p>
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default Login;
