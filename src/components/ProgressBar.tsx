import { useState } from "react";
import progressBarModule from '@styles/progressBar.module.css';

interface Props {
  value: number;
  max: number;
  label: string;
}

const ProgressBar = ({ value , max, label } : Props) => {
  const completedWidth = (value / max) * 100;
  return (
    <div className={progressBarModule.progressBar} aria-labelledby="progress-bar-label">
      <span id={progressBarModule.progressBarLabel}>{label}: {value}%</span>
      <div 
        className={progressBarModule.progressBarCompleted} 
        style={{ width: `${completedWidth}%` }}
      />
    </div>
  );
}   

export default ProgressBar;