import React from 'react';
import styles from './ReqDetails.module.scss';
import { ReqDetailsProps } from '../../../../interfaces/reqdetails.props';



const ReqDetails: React.FC<ReqDetailsProps> = ({ request }) => {
  return (
    <div className={styles.reqCard}>
      <p className={styles.reqTitle}>
        <strong>{request.fromUser}</strong> → <strong>{request.toUser}</strong>
      </p>
      <p className={styles.reqDetail}><strong>Shift:</strong> {request.shiftType}</p>
      <p className={styles.reqDetail}><strong>Date:</strong> {request.fromDate} → {request.toDate}</p>
      <p className={styles.reqDetail}><strong>Reason:</strong> {request.reason}</p>
      
      <div className={styles.reqButtons}>
        <button className={`${styles.btn} ${styles.approve}`}>Approve</button>
        <button className={`${styles.btn} ${styles.decline}`}>Decline</button>
      </div>
    </div>
  );
};

export default ReqDetails;
