import React, { useState } from 'react';
import "./CSS/bHeader.css";
import './CSS/header.css';
import DataFolder from "./Folder/dataFolder.jsx";
import DataFile from "./File/dataFile.jsx";
import VButton from "./bHeader";
import Sidebar from "./Sidebar/sidebar";
import { useFolder } from '../hooks/useFolder';
import { useTrash } from '../hooks/useTrash';
import { useFavourites } from '../hooks/usefavourites';
import PProfile from './pProfile.jsx';
import { useParams, useLocation } from 'react-router-dom';
import PathToRoot from './PathToRoot.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { folderId } = useParams();
  const { pathname } = useLocation();

  const isTrash = pathname.includes("trash");
  const isFavourites = pathname.includes("favourites");

  const { folder, childFolders, childFiles } = useFolder(folderId);
  const trash = useTrash();
  const favourites = useFavourites();

  const [activeFileType, setActiveFileType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (fileType) => {
    setActiveFileType(fileType);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let displayedFiles = childFiles;
  if (isTrash) {
    displayedFiles = trash.childFiles;
  } else if (isFavourites) {
    displayedFiles = favourites.childFiles;
  }

  return (
    <div>
      <div className="appContainer">
        <Sidebar folder={folder} childFolders={childFolders} user={currentUser} min="6" max="15" />
        <div className="mainContent">
          <header>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <PProfile email={currentUser.email} />
          </header>
          <VButton onFilterChange={handleFilterChange} />
          <div className="cBaby">
            <PathToRoot currentFolder={folder} />
            <hr />
            <div className="iContainFolderAndFile">
            {!isTrash && !isFavourites && <DataFolder childFolders={childFolders} />}
            <hr />

            <DataFile
              childFiles={displayedFiles}
              activeFileType={activeFileType}
              user={currentUser}
              searchTerm={searchTerm}
            />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
