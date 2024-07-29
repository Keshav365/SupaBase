import React, { createContext, useContext } from 'react';
import { useFolder } from '../hooks/useFolder.js';

const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const { folder, childFolders } = useFolder('AB2Uo9oTThfIXtuuURLn');

  return (
    <FolderContext.Provider value={{ folder, childFolders }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = () => {
  return useContext(FolderContext);
};
