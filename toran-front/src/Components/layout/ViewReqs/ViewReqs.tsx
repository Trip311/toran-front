import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './ViewReqs.module.scss'; // Optional: For custom styling

const ViewReqs: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleGoHome = () => {
    navigate('/home');
  };

  if (username !== 'Admin') {
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

  return (
    <div className="view-reqs-container">
      <h1>Hello world (Admin View)</h1>
      {/* Add your admin-only components here */}
    </div>
  );
};

export default ViewReqs;
