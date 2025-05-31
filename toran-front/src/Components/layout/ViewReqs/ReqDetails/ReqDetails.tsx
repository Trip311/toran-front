import React from 'react';
import styles from './ReqDetails.module.scss';
import { ReqDetailsProps } from '../../../../interfaces/reqdetails.props';
import { useAppDispatch, useAppSelector } from '../../HomePage/Calendar/redux/hooks';
import { deleteRequest } from '../../HomePage/Calendar/redux/requestSlice';
import { updateEvent } from '../../HomePage/Calendar/redux/eventSlice';

const ReqDetails: React.FC<ReqDetailsProps> = ({ request }) => {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector(state => state.event.events);
  const username = localStorage.getItem('username');

  const handleDelete = async () => {
    try {
      if (request?.id) {
        await dispatch(deleteRequest(request.id)).unwrap();
      }
    } catch (error) {
      alert('Failed to delete request: ' + (error as Error).message);
    }
  };

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

  const handleJoin = async () => {
    // Implement your join logic here (e.g., update the request with toUser/toDate)
    alert('Join request logic goes here!');
  };

  return (
    <div className={styles.reqCard}>
      <p className={styles.reqTitle}>
        <strong>{request.fromUser}</strong> → <strong>{request.toUser}</strong>
      </p>
      <p className={styles.reqDetail}><strong>Shift:</strong> {request.shiftType}</p>
      <p className={styles.reqDetail}><strong>Date:</strong> {request.fromDate} → {request.toDate}</p>
      <p className={styles.reqDetail}><strong>Reason:</strong> {request.reason}</p>
      
      <div className={styles.reqButtons}>
        {username === 'Admin' ? (
          <>
            <button className={`${styles.btn} ${styles.approve}`} onClick={handleApprove}>Approve</button>
            <button className={`${styles.btn} ${styles.decline}`} onClick={handleDelete}>Decline</button>
          </>
        ) : (
          // Show join button only if toUser and toDate are empty and user is not guest
          (!request.toUser && !request.toDate && username && username !== 'guest') && (
            <button className={`${styles.btn} ${styles.join}`} onClick={handleJoin}>Join</button>
          )
        )}
      </div>
    </div>
  );
};

export default ReqDetails;