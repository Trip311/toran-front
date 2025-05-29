/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import styles from './ShiftSwitcher.module.scss';
import { useAppDispatch, useAppSelector } from '../../Calendar/redux/hooks';
import { fetchEvents } from '../../Calendar/redux/eventSlice';
import { fetchUsers } from '../../Calendar/redux/userSlice';
import { addRequest } from '../../Calendar/redux/requestSlice';
import { ShiftSwitcherProps } from '../../../../../interfaces/shiftswitch.props';
import { IRequest } from '../../../../../interfaces/request.interface';

type ShiftType = 'jira' | 'kitchen';

const ShiftSwitcher: React.FC<ShiftSwitcherProps> = ({ currentUser, onClose }) => {
  const dispatch = useAppDispatch();

  const [shiftType, setShiftType] = useState<ShiftType>('jira');
  const [userShiftDate, setUserShiftDate] = useState('');
  const [secondUser, setSecondUser] = useState('');
  const [secondUserShiftDate, setSecondUserShiftDate] = useState('');
  const [reason, setReason] = useState('');

  const users = useAppSelector(state => state.users.users);
  const allEvents = useAppSelector(state => state.event.events);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchEvents());
  }, [dispatch]);

  const getShiftDates = (username: string): string[] => {
    const today = new Date();
    return allEvents
      .filter(ev =>
        ev.username === username &&
        ev.type === shiftType &&
        new Date(ev.endDate) >= today
      )
      .map(ev => ev.endDate.split('T')[0]);
  };

  const userShiftDates = useMemo(() => getShiftDates(currentUser), [allEvents, currentUser, shiftType]);
  const secondUserShiftDates = useMemo(() => getShiftDates(secondUser), [allEvents, secondUser, shiftType]);

  const availableUsers = useMemo(
    () => users.filter(u => u.username !== currentUser),
    [users, currentUser]
  );

  useEffect(() => {
    if (userShiftDate && !userShiftDates.includes(userShiftDate)) {
      setUserShiftDate('');
    }
  }, [userShiftDates]);

  useEffect(() => {
    if (secondUserShiftDate && !secondUserShiftDates.includes(secondUserShiftDate)) {
      setSecondUserShiftDate('');
    }
  }, [secondUserShiftDates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shiftType || !userShiftDate || !secondUser || !secondUserShiftDate || !reason.trim()) {
      alert('Please fill all the fields.');
      return;
    }

    const payload: IRequest = {
      fromUser: currentUser,
      fromDate: userShiftDate,
      toUser: secondUser,
      toDate: secondUserShiftDate,
      shiftType,
      reason,
    };

    dispatch(addRequest(payload));
    onClose();
  };

  return (
    <div className={styles.shiftSwitcherContainer}>
      <h2>Switch Shifts</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Your Name:</label>
          <input type="text" value={currentUser} readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>Type of Shift:</label>
          <select value={shiftType} onChange={e => setShiftType(e.target.value as ShiftType)}>
            <option value="jira">Jira</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Your Shift Date:</label>
          <select value={userShiftDate} onChange={e => setUserShiftDate(e.target.value)}>
            <option value="">Select your shift date</option>
            {userShiftDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Select Teammate:</label>
          <select value={secondUser} onChange={e => setSecondUser(e.target.value)}>
            <option value="">Select user</option>
            {availableUsers.map(user => (
              <option key={user.username} value={user.username}>{user.username}</option>
            ))}
          </select>
        </div>

        {secondUser && (
          <div className={styles.formGroup}>
            <label>{secondUser}'s Shift Date:</label>
            <select value={secondUserShiftDate} onChange={e => setSecondUserShiftDate(e.target.value)}>
              <option value="">Select shift date</option>
              {secondUserShiftDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Reason for Switching:</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Enter reason"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ShiftSwitcher;
