import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ViewReqs.module.scss'; // Optional: For custom styling
import { useAppDispatch, useAppSelector } from '../../layout/HomePage/Calendar/redux/hooks';
import { fetchRequests } from "../HomePage/Calendar/redux/requestSlice";

import ReqDetails from './ReqDetails/ReqDetails'

const ViewReqs: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const pendingReqs = useAppSelector((state) => state.request.requests);
  const usersReqs = pendingReqs.filter(
    req => (!req.toUser || req.toUser === '') && (!req.toDate || req.toDate === '')
  );



  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  

  const handleGoHome = () => {
    navigate('/home');
  };

  if (username === 'guest') {
    return (
      <div className={styles.notadmincontainer}>
        <div className={styles.notadmincard}>
            <h2>🔒 Admin Access Required</h2>
            <p>This page is restricted. Please log in as <strong>Admin</strong> to continue.</p>
            <button onClick={handleGoHome}>🔙 Go to Homepage</button>
        </div>
        </div>
    );
  }
  else if (username === 'Admin') {
    return (
      <div className={styles.viewreqscontainer}>
        <div className={styles.reqListWrapper}>
          {pendingReqs.map(req => (
            <ReqDetails
              currentUser={username ?? ''}
              key={req.id}
              request={req}
            />
        ))}
        </div>
    </div>
    );
  }

  return (
    <div className={styles.viewreqscontainer}>
        <div className={styles.reqListWrapper}>
          {usersReqs.map(req => (
            <ReqDetails
              currentUser={username ?? ''}
              key={req.id}
              request={req}
            />
        ))}
        </div>
    </div>
  );
};

export default ViewReqs;
