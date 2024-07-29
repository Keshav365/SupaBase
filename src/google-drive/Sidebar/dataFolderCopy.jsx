import React, { useState } from 'react';
import '../CSS/rightSideDetailBar.css';
import FolderFav from '../Folder/Folder.jsx';
// import FolderBar from './FolderBar.jsx';

const DataFolderCopy = ({ childFolders }) => {
  const [favoriteFolder, setFavoriteFolder] = useState(null);

  const handleFavoriteClick = (folderId) => {
    setFavoriteFolder(favoriteFolder === folderId ? null : folderId);
  };

  return (
    <div className='f1'>
      
        <div className="d-flex flex-wrap">
          {childFolders.map(childFolder => (
            <div key={childFolder.id}>

              <FolderFav
                p2L={childFolder.id}
                name={childFolder.name}
                onClick={() => handleFavoriteClick(childFolder.id)}
              />
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default DataFolderCopy;
