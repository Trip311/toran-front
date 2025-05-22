import styles from './homepage.module.scss';
import Navbar from './Navbar/navbar';
import MyCalendar from './Calendar/calendar';
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