import styles from './welcome.module.scss';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleHelpScreen = () => {
        setIsOpen(!isOpen);
    }
    localStorage.setItem('username', 'guest');

    return (
        <div className={styles.container}>
            <button className={styles.btnhelp} onClick={toggleHelpScreen}>?</button>
            {isOpen && (
                <div className={styles.helpscreen}>
                    <div className={styles.helpcontent}>
                        <h2 className={styles.helptitle}>About</h2>
                        <p>The Toran website should help us organize daily jira and kitchen shifts.</p>
                        <p>Every Signed user in the team could just go into this website and see the status for the week.</p>
                        <p>In addition, change their shifts accordingly.</p>
                        <button className={styles.closebutton} onClick={toggleHelpScreen}>X</button>
                    </div>
                </div>
            )}
            <h1 className={styles.title}>Toran</h1>
            <div className={styles.toggleButtons}>
                <button datatype='btn-login' onClick={() => navigate('/login')}>Login</button>
                <button datatype='btn-signup' onClick={() => navigate('/signup')}>Signup</button>
            </div>
        </div>
    )
}

export default Welcome
