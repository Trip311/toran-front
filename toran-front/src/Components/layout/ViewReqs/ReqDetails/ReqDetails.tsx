import React, { useMemo, useState, useEffect } from 'react';
import styles from './ReqDetails.module.scss';
import { ReqDetailsProps } from '../../../../interfaces/reqdetails.props';
import { useAppDispatch, useAppSelector } from '../../HomePage/Calendar/redux/hooks';
import { deleteRequest, updateRequestStatus, updateRequest } from '../../HomePage/Calendar/redux/requestSlice';
import { updateEvent } from '../../HomePage/Calendar/redux/eventSlice';
import { fetchEvents } from '../../HomePage/Calendar/redux/eventSlice';


const ReqDetails: React.FC<ReqDetailsProps> = ({ currentUser, request, mode }) => {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector(state => state.event.events);
  const username = localStorage.getItem('username');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const getShiftDates = (username: string): string[] => {
    const today = new Date();
    return allEvents
      .filter(ev =>
        ev.username === username &&
        ev.type === request.shiftType &&
        new Date(ev.endDate) >= today
      )
      .map(ev => ev.endDate.split('T')[0]);
  };

  const userShiftDates = useMemo(() => getShiftDates(currentUser), [allEvents, currentUser, request.shiftType]);

  const handleDelete = async () => {
    try {
      if (request?.id) {
        await dispatch(deleteRequest(request.id)).unwrap();
      }
    } catch (error) {
      alert('Failed to delete request: ' + (error as Error).message);
    }
  };

  // function to handle approving a shift switch request
  const handleApprove = async () => {
    if (!request?.fromUser || !request?.toUser || !request.fromDate || !request.toDate || !request.shiftType || !request.id) {
      alert("Incomplete request data.");
      return;
    }

    try {
      const fromEvent = allEvents.find(ev =>
        ev.username === request.fromUser &&
        ev.type === request.shiftType &&
        ev.endDate.split('T')[0] === request.fromDate
      );

      const toEvent = allEvents.find(ev =>
        ev.username === request.toUser &&
        ev.type === request.shiftType &&
        ev.endDate.split('T')[0] === request.toDate
      );

      if (!fromEvent || !toEvent || !fromEvent.id || !toEvent.id) {
        alert('Could not find both events for swap.');
        return;
      }

      // Switch events
      await dispatch(updateEvent({
        id: fromEvent.id,
        event: {
          username: request.toUser,
          note: request.toUser,
          type: request.shiftType,
          startDate: fromEvent.startDate,
          endDate: fromEvent.endDate,
        }
      })).unwrap();

      await dispatch(updateEvent({
        id: toEvent.id,
        event: {
          username: request.fromUser,
          note: request.fromUser,
          type: request.shiftType,
          startDate: toEvent.startDate,
          endDate: toEvent.endDate,
        }
      })).unwrap();

      await dispatch(deleteRequest(request.id)).unwrap();

      alert('Shift switch approved successfully.');
    } catch (error) {
      alert('Failed to approve request: ' + (error as Error).message);
    }
  };

  const handleMenuJoin = () => {
    setShowMenu(false);
    setShowJoinForm(true);
  };

  // function to handle joining a shift request
  const handleConfirmJoin = async () => {
    if (
        !request?.fromUser ||
        !selectedDate ||
        !request.fromDate ||
        !request.shiftType ||
        !request.id ||
        !username
    ) {
        alert("Incomplete request data.");
        return;
    }

    try {
        // First update toUser and toDate
        await dispatch(updateRequest({
            id: request.id,
            data: {
                toUser: username,
                toDate: selectedDate
            }
        })).unwrap();

        // Then update status
        await dispatch(updateRequestStatus({
            id: request.id,
            status: 'waitingforuser'
        })).unwrap();

        alert('You have joined the shift. Status is now: waitingforuser.');
        setShowJoinForm(false);
    } catch (error) {
        alert('Failed to join request: ' + (error as Error).message);
    }
  };

  // Only show menu if request is joinable and not created by the current user
  const canJoin = !request.toUser && !request.toDate && username && username !== 'guest' && request.fromUser !== username;

  return (
    <div className={styles.reqCard}>
    {username === 'Admin' && mode === 'approve' ? (

      // Approve design (waitingforadmin)
      <>
        <p className={styles.reqTitle}>
          <strong>{request.fromUser}</strong> → <strong>{request.toUser}</strong>
        </p>
        <p className={styles.reqDetail}><strong>Shift:</strong> {request.shiftType}</p>
        <p className={styles.reqDetail}><strong>Date:</strong> {request.fromDate} → {request.toDate}</p>
        <p className={styles.reqDetail}><strong>Reason:</strong> {request.reason}</p>
        <div className={styles.reqButtons}>
          <button className={`${styles.btn} ${styles.approve}`} onClick={handleApprove}>Approve</button>
          <button className={`${styles.btn} ${styles.decline}`} onClick={handleDelete}>Decline</button>
        </div>
      </>
    ) : (

      // View design (pending)
      <>
        <div className={styles.cardHeader}>
          <span className={styles.reqTitle}><strong>{request.fromUser}</strong></span>
          {canJoin && (
            <div className={styles.menuWrapper}>
              <button
                className={styles.menuBtn}
                onClick={() => setShowMenu(m => !m)}
                aria-label="Open menu"
                type="button"
              >&#8942;</button>
              {showMenu && (
                <div className={styles.menuDropdown}>
                  <div className={styles.menuItem} onClick={handleMenuJoin}>Join</div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.detailsSection}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Shift:</span>
            <span className={styles.detailValue}>{request.shiftType}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Date:</span>
            <span className={styles.detailValue}>{request.fromDate}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Reason:</span>
            <span className={styles.detailValue}>{request.reason}</span>
          </div>
        </div>
        {showJoinForm && (
          <form
            className={styles.joinForm}
            onSubmit={e => {
              e.preventDefault();
              handleConfirmJoin();
            }}
          >
            <div className={styles.formTitle}>Join This Shift</div>
            <hr className={styles.formDivider} />
            <div className={styles.formField}>
              <label>Your Name:</label>
              <input type="text" value={username || ''} readOnly />
            </div>
            <div className={styles.formField}>
              <label>Choose Date:</label>
              <select
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                required
              >
                <option value="">Select shift date</option>
                {userShiftDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div className={styles.formButtons}>
              <button type="submit" className={styles.btn}>Confirm</button>
              <button
                type="button"
                className={styles.btn}
                style={{ backgroundColor: "#aaa" }}
                onClick={() => setShowJoinForm(false)}
              >
                Back
              </button>
            </div>
          </form>
        )}
        <div className={styles.reqButtons}></div>
      </>
    )}
  </div>
  );
};

export default ReqDetails;