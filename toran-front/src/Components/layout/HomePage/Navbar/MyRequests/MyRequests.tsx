import React from 'react';
import styles from './MyRequests.module.scss';
import { useAppSelector, useAppDispatch } from '../../Calendar/redux/hooks.js';
import { updateRequestStatus, updateRequest } from '../../Calendar/redux/requestSlice.js';

const MyRequests: React.FC = () => {
    const dispatch = useAppDispatch();
    const username = localStorage.getItem('username');
    const requests = useAppSelector(state => state.request.requests);

    // Filter requests for current user and status 'waitingforuser'
    const myWaitingReqs = requests.filter(
        req => req.fromUser === username && req.status === 'waitingforuser'
    );

    const handleApprove = async (id: number) => {
        try {
            await dispatch(updateRequestStatus({ id, status: 'waitingforadmin' })).unwrap();
            alert('Request approved and sent to admin.');
        } catch (error) {
            alert('Failed to approve request: ' + (error as Error).message);
        }
    };

    const handleDecline = async (id: number) => {
        try {
            // Remove toUser and toDate
            await dispatch(updateRequest({
                id,
                data: { toUser: null, toDate: null }
            })).unwrap();

            // Set status back to 'pending'
            await dispatch(updateRequestStatus({
                id,
                status: 'pending'
            })).unwrap();

            alert('Request declined and returned to pending.');
        }   catch (error) {
        alert('Failed to decline request: ' + (error as Error).message);
        }
    };

    return (
        <div className={styles.myRequestsContainer}>
            <h2>My Requests Awaiting Approval</h2>
            {myWaitingReqs.length === 0 ? (
                <p>No requests awaiting your approval.</p>
            ) : (
                myWaitingReqs.map(req => (
                    <div className={styles.reqCard} key={req.id}>
                        <p className={styles.reqTitle}>
                            <strong>{req.fromUser}</strong> → <strong>{req.toUser}</strong>
                        </p>
                        <p className={styles.reqDetail}><strong>Shift:</strong> {req.shiftType}</p>
                        <p className={styles.reqDetail}><strong>Date:</strong> {req.fromDate} → {req.toDate}</p>
                        <p className={styles.reqDetail}><strong>Reason:</strong> {req.reason}</p>
                        <div className={styles.reqButtons}>
                            <button
                                className={`${styles.btn} ${styles.approve}`}
                                onClick={() => handleApprove(req.id!)}
                            >
                                Approve
                            </button>
                            <button
                                className={`${styles.btn} ${styles.decline}`}
                                onClick={() => handleDecline(req.id!)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyRequests;