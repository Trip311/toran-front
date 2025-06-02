import styles from './homepage.module.scss';
import Navbar from './Navbar/navbar.js';
import MyCalendar from './Calendar/calendar.js';
import React from 'react';


const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <Navbar/>
            <MyCalendar/>
        </div>
    )
}

export default  Home;