import React, { useState, useEffect } from 'react';
import '../CSS/mainBody.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashRestore, faTrash, faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarLight } from '@fortawesome/free-regular-svg-icons'; // Light icon
import { database } from '../../firebase.js';

function FileFav({ p2L, onClick, name, url, icon, file, user }) {
  const [isFavorite, setIsFavorite] = useState(file.fileState === 'Fav');


  const handleDoubleClick = () => {
    window.open(url, '_blank');
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('You need to be signed in to add or remove a file from favorites');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await database.removeFromFavourites(file.id);
        await database.updateDocument('files', file.id, { fileState: 'nonFav' });
        setIsFavorite(false);
      } else {
        // Add to favorites
        const favoriteFile = {
          name: file.name,
          url: file.url,
          userId: user.uid,
          createdAt: file.createdAt,
          size: file.size,
          originalFileId: file.id,
          folderId: file.folderId,
          favourite: true
        };
        await database.updateDocument('files', file.id, { fileState: 'Fav' });
        if (file.fileState !== 'fav') {
          await database.addFavourite(favoriteFile);
        }
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite status: ', error);
    }
  };

  const handleMoveToTrash = async () => {
    if (!user) {
      alert('You need to be signed in to delete a file');
      return;
    }

    try {
      // Add to trash collection
      const trashFile = {
        name: file.name,
        url: file.url,
        userId: user.uid,
        createdAt: file.createdAt,
        size: file.size,
        originalFileId: file.id,
        folderId: file.folderId,
        trash: true
      };

      await database.addTrash(trashFile);

      // Delete from files collection
      await database.deleteFile(file.id);

      // Remove from favorites collection if it exists
      if (isFavorite) {
        await database.removeFromFavourites(file.id);
      }

    } catch (error) {
      console.error('Error moving file to trash: ', error);
    }
  };

  const handlePermanentDelete = async () => {
    if (!user) {
      alert('You need to be signed in to delete a file permanently');
      return;
    }

    try {
      // Delete from trash collection
      await database.deleteFileFromTrash(file.id);

      // Delete from favorites collection if it exists
      await database.removeFromFavourites(file.id);

    } catch (error) {
      console.error('Error deleting file permanently: ', error);
    }
  };

  const handleRestoreFile = async () => {
    if (!user) {
      alert('You need to be signed in to restore a file');
      return;
    }

    try {
      const restoredFile = {
        name: file.name,
        url: file.url,
        userId: user.uid,
        createdAt: file.createdAt,
        size: file.size,
        // originalFileId: file.id,
        folderId: file.folderId,
        trash: false
      };

      // Add back to files collection
      await database.addFile(restoredFile);

      // Delete from trash collection
      await database.deleteFileFromTrash(file.id);

    } catch (error) {
      console.error('Error restoring file from trash: ', error);
    }
  };

  useEffect(() => {
    setIsFavorite(file.fileState === 'Fav');
  }, [file.fileState]);

  return (
    <div className='FavItemActive all' onClick={onClick} onDoubleClick={handleDoubleClick}>
      <FontAwesomeIcon icon={icon} />&nbsp;
      <p className='nameFileIs'>{name} &nbsp;</p>
      {isFavorite && (
        <FontAwesomeIcon
          icon={faStarRegular}
          onClick={handleToggleFavorite}
          style={{ cursor: 'pointer' }}
        />
      )}

      {!isFavorite && !file.favourite && !file.trash && (
        <FontAwesomeIcon
          icon={faStarLight}
          onClick={handleToggleFavorite}
          style={{ cursor: 'pointer' }}
        />
      )}
      {!isFavorite && !file.favourite && !file.trash && (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={handleMoveToTrash}
          style={{ cursor: 'pointer' }}
        />
      )}

      {isFavorite && !file.favoriteFile && (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={handleMoveToTrash}
          style={{ cursor: 'pointer' }}
        />
      )}
      {!isFavorite && !file.favourite && file.trash && (
        <>
          <FontAwesomeIcon
            icon={faTrashRestore}
            onClick={handleRestoreFile}
            style={{ cursor: 'pointer' }}
          />
          <FontAwesomeIcon
            icon={faTrash}
            onClick={handlePermanentDelete}
            style={{ cursor: 'pointer' }}
          />
        </>
      )}

    </div>
  );
}

export default FileFav;
