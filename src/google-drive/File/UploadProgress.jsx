import React from 'react';

function UploadProgress({ progress }) {
    return (
        <div className="upload-progress-container">
            {Object.entries(progress).map(([fileName, percent]) => (
                percent < 100 && (
                    <div key={fileName} className="progress-item">
                        <p>{fileName}</p>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                            <span>{Math.round(percent)}%</span>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}

export default UploadProgress;
