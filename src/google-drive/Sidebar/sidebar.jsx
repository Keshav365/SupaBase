import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faStar, faTrash, faCloud } from '@fortawesome/free-solid-svg-icons';
import FolderUploadForm from '../Folder/uploadFolder';
import FileUploadForm from '../File/uploadFile';
import DataFolderCopy from './dataFolderCopy';
import { useNavigate, useLocation } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
import { calculateStorageUsed } from '../../firebase.js'; 

function Sidebar({ folder, childFolders, user}) {

  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchStorageUsed = async () => {
        const totalStorage = await calculateStorageUsed(user.uid);
        setStorageUsed(totalStorage);
      };

      fetchStorageUsed();
    }
  }, [user]);


  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active item based on the current path
  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleNavigate = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const changeBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
console.log(storageUsed)
  const progress = {
    min: storageUsed,
    max: 15*1024*1024*1024
  };
  const progress1 = (progress.min / progress.max) * 100;

  return (
    <div className="sidebar">
      <div className='addNew'>
        <FileUploadForm currentFolder={folder} />
        <FolderUploadForm currentFolder={folder} />
      </div>
      <div
        className={`sidebarItem ${activeItem === '/' ? 'active' : ''}`}
        onClick={() => handleNavigate('/')}
      >
        <FontAwesomeIcon icon={faFolder} />&nbsp;My Drive
      </div>
      <div
        className={`sidebarItem ${activeItem === '/favourites' ? 'active' : ''}`}
        onClick={() => handleNavigate('/favourites')}
      >
        <FontAwesomeIcon icon={faStar} />&nbsp;Favourite
      </div>
      <div
        className={`sidebarItem ${activeItem === '/trash' ? 'active' : ''}`}
        onClick={() => handleNavigate('/trash')}
      >
        <FontAwesomeIcon icon={faTrash} />&nbsp;Trash
      </div>
      <div className="frequentFolder">
        <DataFolderCopy childFolders={childFolders} />
      </div>
      <div className="ProgressDiv">
        <div>
          <FontAwesomeIcon icon={faCloud} />&nbsp;Storage
        </div>
        <progress id="file" value={progress1} max="100"></progress>
        <div className='ofStorage'> {changeBytes(progress.min)}  of {changeBytes(progress.max)} Used</div>
      </div>
    </div>
  );
}

export default Sidebar;
