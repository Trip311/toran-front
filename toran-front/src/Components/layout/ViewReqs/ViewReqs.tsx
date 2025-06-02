import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './ViewReqs.module.scss'; // Optional: For custom styling
import { useAppDispatch, useAppSelector } from '../../layout/HomePage/Calendar/redux/hooks.js';
import { fetchRequestsByStatus } from "../HomePage/Calendar/redux/requestSlice.js";
import ReqDetails from './ReqDetails/ReqDetails.js'
import { IRequest } from '../../../interfaces/request.interface.js';

const ViewReqs: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const pendingReqs = useAppSelector((state) => state.request.requests);
  // const usersReqs = pendingReqs.filter(
  //   req => (!req.toUser || req.toUser === '') && (!req.toDate || req.toDate === '')
  // );
  const location = useLocation();
  const mode = location.state?.mode || 'view';



  useEffect(() => {
  if (username === 'Admin' && mode === 'approve') {
    dispatch(fetchRequestsByStatus('waitingforadmin'));
  } else {
    dispatch(fetchRequestsByStatus('pending'));
  }
}, [dispatch, username, mode]);

  

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
  
    // Filter requests based on role and mode
  let filteredReqs: IRequest[] = [];
  if (username === 'Admin' && mode === 'approve') {
    filteredReqs = pendingReqs.filter(req => req.status === 'waitingforadmin');
  } else {
    filteredReqs = pendingReqs.filter(req => req.status === 'pending');
    console.log('Filtered Requests:', filteredReqs);
  }

  return (
    <div className={styles.viewreqscontainer}>
        <div className={styles.reqListWrapper}>
          {filteredReqs.map(req => (
            <ReqDetails
              currentUser={username ?? ''}
              key={req.id}
              request={req}
              mode={mode}
            />
        ))}
        </div>
    </div>
  );
};

export default ViewReqs;
