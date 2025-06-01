import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './ChangePassword.module.scss';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ChangePasswordProps } from '../../../../../interfaces/changepassword.props';


const ChangePassword: React.FC<ChangePasswordProps> = ({ username, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const passwordChecks = {
        hasMinLength: newPassword.length >= 6,
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };

    const handleSave = async () => {
        if (!Object.values(passwordChecks).every(Boolean)) {
            toast.error("Password does not meet all requirements.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/change", {
                username,
                newPassword
            });
            toast.success(response.data.message || "Password changed successfully!");
            onClose();
        } catch (err) {
            toast.error("Error changing password");
        }
    };

    return ReactDOM.createPortal(
        <div className={styles.helpscreen}>
            <div className={styles.helpcontent}>
                <h2 className={styles.helptitle}>Change password:</h2>
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                />
                {isPasswordFocused && (
                    <div className={styles.passwordValidator}>
                        <p>Password must include:</p>
                        <ul>
                            <li>
                                {passwordChecks.hasMinLength ? "✅" : "❌"} Minimum 6 characters
                            </li>
                            <li>
                                {passwordChecks.hasLowercase ? "✅" : "❌"} One lowercase letter
                            </li>
                            <li>
                                {passwordChecks.hasUppercase ? "✅" : "❌"} One uppercase letter
                            </li>
                            <li>
                                {passwordChecks.hasSpecialChar ? "✅" : "❌"} One special character
                            </li>
                        </ul>
                    </div>
                )}
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button className={styles.savebutton} onClick={handleSave}>
                    <FaSave /> Save
                </button>
                <button className={styles.closebutton} onClick={onClose} onMouseDown={e => e.preventDefault()}>X</button>
            </div>
        </div>,
        document.body
    );
};

export default ChangePassword;