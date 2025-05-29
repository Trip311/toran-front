import React from 'react';
import styles from './ReqDetails.module.scss';
import { ReqDetailsProps } from '../../../../interfaces/reqdetails.props';
import { useAppDispatch } from '../../HomePage/Calendar/redux/hooks';
import { deleteRequest } from '../../HomePage/Calendar/redux/requestSlice';


const ReqDetails: React.FC<ReqDetailsProps> = ({ request }) => {

  const dispatch = useAppDispatch();

  const handleDelete = async () => {

    try {

      if (request?.id) {
        await dispatch(deleteRequest(request.id)).unwrap();
      }
    } catch (error) {
        alert('Failed to delete request: ' + (error as Error).message);
    }

  }

  const handleApprove = () => {

  }


  return (
    <div className={styles.reqCard}>
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
    </div>
  );
};

export default ReqDetails;
