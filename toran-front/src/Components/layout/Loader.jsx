import React from 'react';
import './Loader.scss';
import loadingGif from '../../assets/loading.gif'; 

const Loader = () => {
    return (
        <div className="loader-container">
            <img src={loadingGif} alt="Loading..." className="loader-gif" />
            <p>Loading...</p>
        </div>
    );
};

export default Loader;