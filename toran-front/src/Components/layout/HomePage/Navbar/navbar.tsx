/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { FiRepeat } from 'react-icons/fi';
import { FaCog, FaSave } from 'react-icons/fa';
import styles from './navbar.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const storedUsername = localStorage.getItem('username');
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [username, setUsername] = useState('guest');

    useEffect(() => {
        const storedUsername = localStorage.getItem('guest');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    }

    const toggleChangePasswordScreen = () => {
        setIsChangePassword(!isChangePassword);
    }

    const handleSave = async () => {
        
        if (newPassword.length < 6) {
            alert("Password cant be over than 6 letters");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            console.log(username);

            const response = await axios.post("http://localhost:5000/api/auth/change", {
                username,
                newPassword
            })
            alert(response.data.message);
            console.log(response.data);
        } catch (err) {
            alert("Error changing password");
        }
    }


    return (
        <div className={styles.sidenavbar}>
            <div className={styles.logosection}>
                <h1>Toran</h1>
            </div>

            <div className={styles.navoptions}>
                <div className={styles.navitem} onClick={() => setSettingsOpen(!settingsOpen)}>
                    <FaCog size={20}/>
                    <span>Settings</span>
                </div>
                {settingsOpen && (
                    <div className={styles.settingsubmenu}>
                        <div className={styles.submenuitem} onClick={toggleChangePasswordScreen}>Change Password</div>
                        {isChangePassword && (
                            <div className={styles.helpscreen}>
                                <div className={styles.helpcontent}>
                                    <h2 className={styles.helptitle}>Change password: </h2>
                                    <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                                    <input type="password" placeholder="Confirm New password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                                    <button className={styles.savebutton} onClick={handleSave}><FaSave/> Save</button>
                                    <button className={styles.closebutton} onClick={toggleChangePasswordScreen}>X</button>
                                </div>
                            </div>
                        )}
                        <div className={styles.submenuitem} onClick={handleLogout}>Logout</div>
                    </div>
                )}

                <div className={styles.navitem}>
                    <FiRepeat size={20}/>
                    <span>switch shifts</span>
                </div>
                <div className={styles.footer}>
                    <p>Logget in as:</p>
                    <strong>{storedUsername}</strong>
                </div>
            </div>
        </div>
    )
}

export default Navbar;