import React, { useState } from 'react';
import FileBar from './FileBar.jsx';
import FileFav from './File.jsx';
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
} from '@fortawesome/free-solid-svg-icons';

const DataFile = ({ activeFileType, childFiles, user, searchTerm }) => {
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

  const getFileTypeType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    if (imageExtensions.includes(extension)) {
      return 'Image';
    } else if (pdfExtensions.includes(extension)) {
      return 'pdf';
    } else if (wordExtensions.includes(extension)) {
      return 'Word Document';
    } else if (excelExtensions.includes(extension)) {
      return 'Excel Spreadsheet';
    } else if (pptExtensions.includes(extension)) {
      return 'PowerPoint Presentation';
    } else if (audioExtensions.includes(extension)) {
      return 'audio';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else if (archiveExtensions.includes(extension)) {
      return 'Archive File';
    } else if (codeExtensions.includes(extension)) {
      return 'Code File';
    } else if (textExtensions.includes(extension)) {
      return 'Text Document';
    } else {
      return 'File'; // Default type
    }
  };

  const getIcon = (extension) => {
    if (imageExtensions.includes(extension)) {
      return faImage;
    } else if (pdfExtensions.includes(extension)) {
      return faFilePdf;
    } else if (wordExtensions.includes(extension)) {
      return faFileWord;
    } else if (excelExtensions.includes(extension)) {
      return faFileExcel;
    } else if (pptExtensions.includes(extension)) {
      return faFilePowerpoint;
    } else if (audioExtensions.includes(extension)) {
      return faFileAudio;
    } else if (videoExtensions.includes(extension)) {
      return faFileVideo;
    } else if (archiveExtensions.includes(extension)) {
      return faFileArchive;
    } else if (codeExtensions.includes(extension)) {
      return faFileCode;
    } else if (textExtensions.includes(extension)) {
      return faFileAlt;
    } else if (extension === 'folder') {
      return faFolder;
    } else {
      return faFile;
    }
  };

  const getFileType = (filename) => {
    const split = filename.split('.');
    return split[split.length - 1].toLowerCase(); // Normalize to lowercase
  };

  const changeBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const [activeFile, setActiveFile] = useState(null);
  const showFileBarClick = (folderId) => {
    setActiveFile(activeFile === folderId ? null : folderId);
  };

  return (
    <div className='f1 files'>
      {childFiles.length > 0 && (
        <div className='d-flex flex-wrap'>
          {childFiles
            .filter(childFile => 
              activeFileType === 'all' || getFileTypeType(childFile.name) === activeFileType
            )
            .filter(childFile =>
              childFile.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((childFile) => {
              const fileType = getFileTypeType(childFile.name);

              return (
                <div key={childFile.id} className='all'>
                  <div className='all'>
                    <FileFav
                      onClick={() => showFileBarClick(childFile.id)}
                      url={childFile.url}
                      icon={getIcon(getFileType(childFile.name))}
                      name={childFile.name}
                      p2L={childFile.folderId}
                      file={childFile}  // Pass the file object
                      user={user}  // Pass the user object
                    />
                  </div>
                  <div className={`BarBar ${activeFile === childFile.id ? 'show' : 'hide'}`}>
                    <FileBar
                      childFile={childFile}
                      name={childFile.name}
                      type={getFileTypeType(childFile.name)}
                      url={childFile.url}
                      size={changeBytes(childFile.size)}
                      modified={childFile.createdAt?.toDate().toString()}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default DataFile;
