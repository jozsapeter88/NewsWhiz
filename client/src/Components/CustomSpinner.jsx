import React from 'react';
import './CustomSpinner.css';

const CustomSpinner = () => {
  return (
    <div className="custom-spinner-overlay">
      <img src="assets/images/spinner.gif" alt="loading" />
    </div>
  );
};

export default CustomSpinner;
