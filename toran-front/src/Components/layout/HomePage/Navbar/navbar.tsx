/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { FiRepeat } from 'react-icons/fi';
import { FaCog, FaSave } from 'react-icons/fa';
import styles from './navbar.module.scss';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from './ChangePassword/ChangePassword';
import ShiftSwitcher from './ShiftSwitcher/ShiftSwitcher'; // adjust the path if needed




const Navbar = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const storedUsername = localStorage.getItem('username');
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [showSwitchShifts, setShowSwitchShifts] = useState(false);

    const usersList = ['user1', 'user2'];

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
        setIsChangePassword(prev => !prev);
    }

    const toggleSwitchShifts = () => {
        if (storedUsername) {  // Only allow if user logged in
            setShowSwitchShifts(prev => !prev);
        } else {
            alert('Please login to switch shifts');
        }
    }

    
    return (
        <div className={styles.sidenavbar}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
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
                            <ChangePassword
                                username={storedUsername}
                                onClose={toggleChangePasswordScreen}
                            />
                        )}
                        <div className={styles.submenuitem} onClick={handleLogout}>Logout</div>
                    </div>
                )}

                <div className={styles.navitem} onClick={toggleSwitchShifts}>
                    <FiRepeat size={20}/>
                    <span>switch shifts</span>
                </div>

                {showSwitchShifts && storedUsername && storedUsername !== 'guest' && (
                    <ShiftSwitcher
                        currentUser={storedUsername}
                        users={usersList}
                        onClose={() => setShowSwitchShifts(false)}
                    />
                )}
                <div className={styles.footer}>
                    <p>Logged in as:</p>
                    <strong>{storedUsername}</strong>
                </div>
            </div>
        </div>
    )
}

export default Navbar;