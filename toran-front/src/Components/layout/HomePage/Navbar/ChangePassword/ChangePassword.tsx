/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styles from './ChangePassword.module.scss';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';


interface ChangePasswordProps {
  username: string | null;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ username, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/change", {
                storedUsername: username,
                newPassword
            });
            toast.success(response.data.message || "Password changed successfully!");
            onClose(); // Close the modal
        } catch (err) {
            toast.error("Error changing password");
        }
    };

    return (
        <div className={styles.helpscreen}>
            <div className={styles.helpcontent}>
                <h2 className={styles.helptitle}>Change password:</h2>
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
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
                <button className={styles.closebutton} onClick={onClose}>X</button>
            </div>
        </div>
    );
};

export default ChangePassword;
