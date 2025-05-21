import React, { useState, useEffect } from 'react'
import { FiRepeat } from 'react-icons/fa';
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

    const 
}