import React from 'react';
// import '../CSS/rightSideDetailBar.css';



function FolderBar({ name, size, URL, uploadedAt }) {
  return (
    <div className="rightSideDetailBar">
      <h2>Folder Details</h2>
      <div className="detailItem">
        <span>Name</span>
        <span>{name}</span>
      </div>
      <div className="detailItem">
        <span>Owner</span>
        <span>me</span>
      </div>
      <div className="detailItem">
        <span>Modified</span>
        <span>{uploadedAt}</span>
      </div>
      <div className="detailItem">
        <span>Created</span>
        <span>{uploadedAt}</span>
      </div>
      <div className="detailItem">
        <span>Permissions</span>
        <span>Read & Write</span>
      </div>
    </div>
  );
}

export default FolderBar;
