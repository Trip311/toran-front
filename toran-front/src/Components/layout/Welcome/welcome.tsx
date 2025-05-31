import styles from './welcome.module.scss';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleHelpScreen = () => setIsOpen(!isOpen);

    localStorage.setItem('username', 'guest');

    return (
        <div className={styles.container}>
            <button className={styles.btnhelp} onClick={toggleHelpScreen}>?</button>

            {isOpen && (
                <div className={styles.helpscreen}>
                    <div className={styles.helpcontent}>
                        <h2 className={styles.helptitle}>About</h2>
                        <p>The Toran website should help us organize daily jira and kitchen shifts.</p>
                        <p>Every signed user in the team can visit this website and view the weekly status.</p>
                        <p>They can also change their shifts accordingly.</p>
                        <p className={styles['superuser-note']}><strong>Only super user can approve switching shifts.</strong></p>
                        <button className={styles.closebutton} onClick={toggleHelpScreen}>X</button>
                    </div>
                </div>
            )}

            <h1 className={styles.title}>Toran</h1>
            <div className={styles.toggleButtons}>
                <button datatype="btn-login" onClick={() => navigate('/login')}>Login</button>
                <button datatype="btn-signup" onClick={() => navigate('/signup')}>Signup</button>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Toran. All rights reserved.
            </div>
        </div>
    );
};

export default Welcome;
