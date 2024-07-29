import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faFileUpload } from '@fortawesome/free-solid-svg-icons';

function UploadingPara({progress}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        const fileInput = document.querySelector('#fileInput');
        formData.append('file', fileInput.files[0]);
        // You can now submit formData to your backend API for file handling
        console.log('Form submitted with file:', fileInput.files[0]);
    };

    return (
        <div className="UploadDiv">
            <div className="container-content">
                Uploading.......
            </div>
            <progress id="file" value={progress} max="100" style={{width:'80%'}}></progress>
        </div>
    );
}

export default UploadingPara;
