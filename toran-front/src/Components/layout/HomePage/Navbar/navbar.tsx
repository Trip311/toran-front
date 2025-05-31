/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { FiRepeat } from 'react-icons/fi';
import { FaCog, FaSave, FaListAlt } from 'react-icons/fa';
import styles from './navbar.module.scss';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from './ChangePassword/ChangePassword';
import ShiftSwitcher from './ShiftSwitcher/ShiftSwitcher'; // adjust the path if needed
import { useAppSelector, useAppDispatch } from '../Calendar/redux/hooks';
import { fetchRequests } from '../Calendar/redux/requestSlice';




const Navbar: React.FC = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const storedUsername = localStorage.getItem('username');
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [showSwitchShifts, setShowSwitchShifts] = useState(false);
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state) => state.request.requests);


    
    useEffect(() => {
    if (storedUsername && storedUsername !== 'guest') {
        dispatch(fetchRequests());
    }
    }, [dispatch, storedUsername]);
    

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
            toast.error('Please login to switch shifts');
        }
    }

    const handleViewRequests = () => {
        navigate('/requests');
    }

    const pendingRequests = requests.filter(
        req => (!req.toUser || req.toUser === "") && (!req.toDate || req.toDate === "")
    );

    
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
                        onClose={() => setShowSwitchShifts(false)}
                    />
                )}


                {storedUsername === 'Admin' && (
                    <div className={styles.navitem} onClick={handleViewRequests}>
                        <FaListAlt size={20} />
                        <span>Approve Shift Requests</span>
                        {requests.length > 0 && (
                            <span className={styles.badge}>{requests.length}</span>
                    )}
                    </div>
                )}

                {storedUsername !== 'Admin' && storedUsername !== 'guest' && (
                    <div className={styles.navitem} onClick={handleViewRequests}>
                        <FaListAlt size={20} />
                        <span>View Shift Requests</span>
                        {pendingRequests.length > 0 && (
                            <span className={styles.badge}>{requests.length}</span>
                    )}
                    </div>
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