import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import {
  faImage,
  faFile,
  faEllipsisV,
  faFolder,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileAudio,
  faFileVideo,
  faFileArchive,
  faFileCode,
  faFileAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

function FolderFav({ p2L, name, onClick}) {
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    navigate(`/folder/${p2L}`);
  };

  return (
    <>
      <div className='FavItemActive' onClick={onClick} onDoubleClick={handleDoubleClick}>
        <FontAwesomeIcon icon={faFolder} />&nbsp; {name} &nbsp; 
      </div>

      
    </>
  );
}

export default FolderFav;
