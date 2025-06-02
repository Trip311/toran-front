/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import styles from './ShiftSwitcher.module.scss';
import { useAppDispatch, useAppSelector } from '../../Calendar/redux/hooks.js';
import { fetchEvents } from '../../Calendar/redux/eventSlice.js';
import { fetchUsers } from '../../Calendar/redux/userSlice.js';
import { addRequest } from '../../Calendar/redux/requestSlice.js';
import { ShiftSwitcherProps } from '../../../../../interfaces/shiftswitch.props.js';
import { IRequest } from '../../../../../interfaces/request.interface.js';
import ReactDOM from 'react-dom';

type ShiftType = 'jira' | 'kitchen';

const ShiftSwitcher: React.FC<ShiftSwitcherProps> = ({ currentUser, onClose }) => {

  const dispatch = useAppDispatch();

  const [shiftType, setShiftType] = useState<ShiftType>('jira');
  const [userShiftDate, setUserShiftDate] = useState('');
  const [reason, setReason] = useState('');

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
      .map(ev => {
        const dateStr = typeof ev.endDate === 'string'
          ? ev.endDate
          : (ev.endDate instanceof Date ? ev.endDate.toISOString() : '');
        return dateStr.split('T')[0];
      });
  };

  // instead of calcultating it every time there's a render

  const userShiftDates = useMemo(() => getShiftDates(currentUser), [allEvents, currentUser, shiftType]);


  useEffect(() => {
    if (userShiftDate && !userShiftDates.includes(userShiftDate)) {
      setUserShiftDate('');
    }
  }, [userShiftDates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shiftType || !userShiftDate || !reason.trim()) {
      alert('Please fill all the fields.');
      return;
    }

    const payload: IRequest = {
      fromUser: currentUser,
      fromDate: userShiftDate,
      toUser: null,
      toDate: null,
      shiftType,
      reason,
      status: 'pending'
    };
    console.log(payload);

    dispatch(addRequest(payload));
    onClose();
  };

  return ReactDOM.createPortal(
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
    </div>,
    document.body
  );
};

export default ShiftSwitcher;
