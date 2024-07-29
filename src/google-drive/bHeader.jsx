// bHeader.jsx
import React, { useEffect } from 'react';
import './CSS/bHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faFilePdf, faFile, faVideo, faFileAudio, faImage } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faBullseye, faFilePdf, faFile, faVideo, faFileAudio, faImage);

const VButton = ({ onFilterChange }) => {
  useEffect(() => {
    function activateDiv(event) {
      var divs = document.querySelectorAll('div.b');
      divs.forEach(function (div) {
        div.classList.remove('active');
      });
      event.target.classList.add('active');
    }

    var divs = document.querySelectorAll('div.b');
    divs.forEach(function (div) {
      div.addEventListener('click', activateDiv);
    });

    return () => {
      divs.forEach(function (div) {
        div.removeEventListener('click', activateDiv);
      });
    };
  }, []);

  const handleClick = (fileType) => {
    onFilterChange(fileType);
  };
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
  const pdfExtensions = ['pdf'];
  const wordExtensions = ['doc', 'docx'];
  const excelExtensions = ['xls', 'xlsx'];
  const pptExtensions = ['ppt', 'pptx'];
  const audioExtensions = ['mp3', 'wav', 'ogg'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv'];
  const archiveExtensions = ['zip', 'rar', '7z', 'tar'];
  const codeExtensions = ['html', 'css', 'js', 'json', 'xml', 'c', 'cpp', 'py', 'java'];
  const textExtensions = ['txt', 'rtf'];
  return (
    <div className="container">
      <div className="b active" onClick={() => handleClick('all')}>
        <FontAwesomeIcon icon="bullseye" />&nbsp;All
      </div>
      <div className="b" onClick={() => handleClick('pdf')}>
        <FontAwesomeIcon icon="file-pdf" />&nbsp;PDF
      </div>
      <div className="b" onClick={() => handleClick('Word Document')}>
        <FontAwesomeIcon icon="file" />&nbsp;DOC
      </div>
      <div className="b" onClick={() => handleClick('Excel Spreadsheet')}>
        <FontAwesomeIcon icon="file" />&nbsp;Spreadsheet
      </div>
      <div className="b" onClick={() => handleClick('video')}>
        <FontAwesomeIcon icon="video" />&nbsp;Video
      </div>
      <div className="b" onClick={() => handleClick('audio')}>
        <FontAwesomeIcon icon="file-audio" />&nbsp;Audio
      </div>
      <div className="b" onClick={() => handleClick('Image')}>
        <FontAwesomeIcon icon="image" />&nbsp;Img
      </div>
    </div>
  );
};

export default VButton;
