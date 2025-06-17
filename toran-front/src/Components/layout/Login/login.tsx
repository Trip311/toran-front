/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './login.module.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordToValidate = isForgotMode ? newPassword : password;

    const {
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasSpecialChar,
        isPasswordValid,
    } = React.useMemo(() => {
        const hasMinLength = passwordToValidate.length >= 6;
        const hasUppercase = /[A-Z]/.test(passwordToValidate);
        const hasLowercase = /[a-z]/.test(passwordToValidate);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordToValidate);
        const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;

        return {
            hasMinLength,
            hasUppercase,
            hasLowercase,
            hasSpecialChar,
            isPasswordValid,
        };
    }, [passwordToValidate]);

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
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed From Unknown Error';
            toast.error(errorMessage);
            // toast.error('Login failed');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!isPasswordValid) {
            toast.error('Password does not meet all requirements.');
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
                                    onFocus={() => setIsNewPasswordFocused(true)}
                                    required
                                />
                                <button
                                    type='button'
                                    className={styles.eyeButton}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label="Toggle new password visibility"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {(isNewPasswordFocused || newPassword.length > 0) && (
                                <div className={styles.passwordValidator}>
                                    <p>Password must include:</p>
                                    <ul>
                                        <li>
                                            {hasMinLength ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} Minimum 6 characters
                                        </li>
                                        <li>
                                            {hasLowercase ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} One lowercase letter
                                        </li>
                                        <li>
                                            {hasUppercase ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} One uppercase letter
                                        </li>
                                        <li>
                                            {hasSpecialChar ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} One special character
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <div className={styles.passwordInput}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type='button'
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
                                type='button'
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    )}
                    <button type="submit" className={styles.actionButton}>{isForgotMode ? 'Reset Password' : 'Login'}</button>
                    <button type="button" className={styles.actionButton} onClick={() => navigate('/')}>Back</button>
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
