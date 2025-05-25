import React, { useState, useEffect } from 'react';
import styles from './ShiftSwitcher.module.scss';

interface ShiftSwitcherProps {
  currentUser: string;
  users?: string[];      // usernames array for second user selection
  onClose: () => void;
}

type ShiftType = 'jira' | 'kitchen'; // add in global defintion



// default data for testing , TODO: use api for those.
const mockShiftData: Record<ShiftType, Record<string, string[]>> = {
  jira: {
    user1: ['2025-06-01', '2025-06-03', '2025-06-05'],
    user2: ['2025-06-02', '2025-06-04', '2025-06-06'],
  },
  kitchen: {
    user1: ['2025-06-01', '2025-06-02', '2025-06-07'],
    user2: ['2025-06-03', '2025-06-05', '2025-06-06'],
  }
};

const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

const ShiftSwitcher: React.FC<ShiftSwitcherProps> = ({
  currentUser,
  users = ['user1', 'user2'], // default users if not provided, TODO: api req for users
  onClose
}) => {

  // Set default shiftType to 'jira' so form shows immediately
  const [shiftType, setShiftType] = useState<ShiftType>('jira');
  const [userShiftDates, setUserShiftDates] = useState<string[]>([]);
  // default first available date from mockShiftData for currentUser & jira
  const defaultUserShiftDate = mockShiftData['jira'][currentUser]?.[0] || '';
  const [userShiftDate, setUserShiftDate] = useState(defaultUserShiftDate);

  // default second user different from currentUser
  const defaultSecondUser = users.find(u => u !== currentUser) || '';
  const [secondUser, setSecondUser] = useState(defaultSecondUser);

  const [secondUserShiftDates, setSecondUserShiftDates] = useState<string[]>([]);
  const defaultSecondUserShiftDate = defaultSecondUser
    ? mockShiftData['jira'][defaultSecondUser]?.[0] || ''
    : '';
  const [secondUserShiftDate, setSecondUserShiftDate] = useState(defaultSecondUserShiftDate);

  const [reason, setReason] = useState('Testing shift switch');

  // Update current user's shifts when shiftType or currentUser changes
  useEffect(() => {
    if (!shiftType) {
      setUserShiftDates([]);
      setUserShiftDate('');
      return;
    }

    const shiftsForUser = mockShiftData[shiftType][currentUser] || [];

    const filteredShifts = shiftType === 'jira'
      ? shiftsForUser.filter(date => date > today)
      : shiftsForUser;

    setUserShiftDates(filteredShifts);

    // Set to first available date or empty string if none
    setUserShiftDate(filteredShifts[0] || '');
    setSecondUser('');
    setSecondUserShiftDates([]);
    setSecondUserShiftDate('');
  }, [shiftType, currentUser]);

  // Update second user's shifts when secondUser or shiftType changes
  useEffect(() => {
    if (!secondUser || !shiftType) {
      setSecondUserShiftDates([]);
      setSecondUserShiftDate('');
      return;
    }

    const shiftsForSecondUser = mockShiftData[shiftType]?.[secondUser] || [];
    setSecondUserShiftDates(shiftsForSecondUser);

    setSecondUserShiftDate(shiftsForSecondUser[0] || '');
  }, [secondUser, shiftType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shiftType || !userShiftDate || !secondUser || !secondUserShiftDate || !reason.trim()) {
      alert('Please fill all the fields.');
      return;
    }


    // TODO: implement the switching or sent it to a component that will be like a list of reqs for super user
    alert(`Request to switch shifts:
            User1: ${currentUser} on ${userShiftDate}
            User2: ${secondUser} on ${secondUserShiftDate}
            Reason: ${reason}`);

    onClose();
  };

  // TODO: change the date picker so it would work with api 
  // to fetch all events for user at a specific type that happen after current day
  // using api to fetch all users when the second user choosing
  // to fetch all events for user at a specific type that happen after current day in second user


  // implement switching method or sending notification to super user

  return (
    <div className={styles.shiftSwitcherContainer}>
      <h2>Switch Shifts</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>The teammate:</label>
          <input type="text" value={currentUser} readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>Type of Shift:</label>
          <select value={shiftType} onChange={e => setShiftType(e.target.value as ShiftType)} required>
            <option value="">Select shift type</option>
            <option value="jira">Jira</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </div>

        
        
        {shiftType && (
          <div className={styles.formGroup}>
            <label>Your Shift Date:</label>
            <select value={userShiftDate} onChange={e => setUserShiftDate(e.target.value)} required>
              <option value="">Select your shift date</option>
              {(userShiftDates.length > 0 ? userShiftDates : ['2025-07-01']).map(date => (
              <option key={date} value={date}>{date}</option>
            ))} 
            </select>
          </div>
        )}

        {userShiftDate && (
          <>
            <div className={styles.formGroup}>
              <label>Second User:</label>
              <select value={secondUser} onChange={e => setSecondUser(e.target.value)} required>
                <option value="">Select user</option>
                {users.filter(u => u !== currentUser).map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {secondUser && (
              <div className={styles.formGroup}>
                <label>Second User's Shift Date:</label>
                <select
                  value={secondUserShiftDate}
                  onChange={e => setSecondUserShiftDate(e.target.value)}
                  required
                >
                  <option value="">Select shift date</option>
                  {secondUserShiftDates.length > 0 ? (
                    secondUserShiftDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))
                  ) : (
                    <option disabled>No shifts available</option>
                  )}
                </select>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Reason for Switching:</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Enter reason"
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit">Submit</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ShiftSwitcher;
