import React from 'react';
import '../CSS/rightSideDetailBar.css';

function FileBar({ name, type, url, size, modified }) {
  return (
    <div className="rightSideDetailBar">
                <h2>File Details</h2>
                <div className='allButHeading'>
                  <div className="detailItem">
                    <span>Name</span>
                    <span>{name}</span>
                  </div>
                  <div className="detailItem">
                    <span>File Type</span>
                    <span>{type}</span>
                  </div>
                  <div className="detailItem">
                    <span>Location</span>
                    <span>
                        {url}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span>Size</span>
                    <span>{size}</span>
                  </div>
                  <div className="detailItem">
                    <span>Owner</span>
                    <span>me</span>
                  </div>
                  <div className="detailItem">
                    <span>Modified</span>
                    <span>{modified}</span>
                  </div>
                  <div className="detailItem">
                    <span>Created</span>
                    <span>{modified}</span>
                  </div>
                  <div className="detailItem">
                    <span>Permissions</span>
                    <span>Viewers can download</span>
                  </div>
                </div>
              </div>
  );
}

export default FileBar;
