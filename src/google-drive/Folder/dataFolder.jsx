import React, { useState } from 'react';
import FolderFav from './Folder.jsx';
import FolderBar from './FolderBar.jsx';

const DataFolder = ({ childFolders }) => {
  const [favoriteFolder, setFavoriteFolder] = useState(null);

  const handleFavoriteClick = (folderId) => {
    setFavoriteFolder(favoriteFolder === folderId ? null : folderId);
  };

  return (
    <div className='f1'>
      {childFolders.length > 0 && (
        <div className="d-flex flex-wrap">
          {childFolders.map(childFolder => (
            <div key={childFolder.id}>

              <FolderFav
                p2L={childFolder.id}
                name={childFolder.name}
                onClick={() => handleFavoriteClick(childFolder.id)}
              />

              <div className={`BarBar ${favoriteFolder === childFolder.id ? 'show' : 'hide'}`}>
                <FolderBar
                  name={childFolder.name}
                  uploadedAt={childFolder.createdAt ? childFolder.createdAt.toDate().toLocaleString() : 'Unknown'} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataFolder;
